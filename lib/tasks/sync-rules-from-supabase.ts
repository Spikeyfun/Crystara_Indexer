import { sqliteDb, supabaseDb } from '@/lib/prismadb';
import { createLogger } from '@/app/indexer/utils';

const logger = createLogger('sync-rules-from-supabase');

export async function syncAnchorTokensFromSupabaseToSqlite(network: string) {
  logger.info(`[${network}] Starting anchor token sync: Supabase -> SQLite...`);
  
  try {
    // 1. Leer todas las reglas desde Supabase (la fuente de la verdad)
    const supabaseAnchorTokens = await supabaseDb.anchorToken.findMany({
      where: { network },
    });

    if (supabaseAnchorTokens.length === 0) {
      logger.warn(`[${network}] No anchor tokens found in Supabase. SQLite will be cleared if it has any.`);
    }

    // ANTES de sincronizar los AnchorTokens, nos aseguramos de que los Tokens a los que hacen referencia existan en la BD local.
    const tokenAddresses = [...new Set(supabaseAnchorTokens.map(at => at.tokenAddress))];

    if (tokenAddresses.length > 0) {
      logger.info(`[${network}] Found ${tokenAddresses.length} unique tokens associated with anchor tokens. Syncing them first...`);
      
      // 1. Obtener la información completa de los tokens desde Supabase
      const tokensFromSupabase = await supabaseDb.token.findMany({
        where: {
          address: { in: tokenAddresses },
          network: network,
        },
      });

      // 2. Sincronizar estos tokens en la base de datos SQLite local (usando upsert)
      // Esto asegura que si el token ya existe, se actualiza; si no, se crea.
      const tokenSyncPromises = tokensFromSupabase.map(token =>
        sqliteDb.token.upsert({
          where: { network_address: { network: token.network, address: token.address } },
          update: {
            name: token.name,
            symbol: token.symbol,
            decimals: token.decimals,
            minTradeVolume: token.minTradeVolume,
          },
          create: {
            address: token.address,
            network: token.network,
            name: token.name,
            symbol: token.symbol,
            decimals: token.decimals,
            minTradeVolume: token.minTradeVolume,
          },
        })
      );
      await Promise.all(tokenSyncPromises);
      logger.info(`[${network}] Successfully synced ${tokensFromSupabase.length} tokens to SQLite.`);
    }

    // 2. Preparar los datos para SQLite
    const sqliteAnchorTokenData = supabaseAnchorTokens.map(anchor => ({
      network: anchor.network,
      tokenAddress: anchor.tokenAddress,
      priority: anchor.priority,
      category: anchor.category,
    }));

    // 3. Estrategia "Borrar y Reemplazar" en SQLite
    // Esta es la forma más simple y segura de garantizar una copia exacta.
    await sqliteDb.$transaction([
      // Primero, borra todas las reglas existentes en SQLite para esta red
      sqliteDb.anchorToken.deleteMany({ where: { network } }),
      // Luego, crea las nuevas reglas que vienen de Supabase
      sqliteDb.anchorToken.createMany({
        data: sqliteAnchorTokenData,
      }),
    ]);

    logger.info(`[${network}] Successfully synchronized ${sqliteAnchorTokenData.length} anchor tokens from Supabase to SQLite.`);

  } catch (error) {
    logger.error(`[${network}] Failed to sync anchor tokens from Supabase to SQLite:`, error);
    // Es importante manejar este error, porque si falla, el agregador podría usar reglas antiguas.
    throw error; // Lanzar el error para detener el proceso si la sincronización falla.
  }
}