import { sqliteDb } from '@/lib/prismadb';
import { createLogger } from '@/app/indexer/utils';
import { getDb, tokens_v2 } from '../drizzle';
import { inArray } from 'drizzle-orm';

const logger = createLogger('sync-rules-from-supabase');

const HARDCODED_ANCHORS = [
    { tokenAddress: '0x3db05342523bd72817b09f264761a7621eeb21d0960d9676ba5ce14651b17c43', priority: 10, category: 'NATIVE' }, // SUPRA
    { tokenAddress: '0x1_USDC', priority: 5, category: 'STABLE' }, // Example USDC
    { tokenAddress: '0x1_USDT', priority: 5, category: 'STABLE' }, // Example USDT
];

export async function syncAnchorTokensFromSupabaseToSqlite(network: string) {
  logger.info(`[${network}] Starting anchor token sync (V2)...`);
  
  try {
    const tokenAddresses = HARDCODED_ANCHORS.map(at => at.tokenAddress);

    if (tokenAddresses.length > 0) {
      logger.info(`[${network}] Found ${tokenAddresses.length} unique tokens associated with anchor tokens. Syncing them first...`);
      
      const db = await getDb();
      // 1. Obtener la información completa de los tokens desde Supabase V2
      const tokensFromSupabase = await db.select()
        .from(tokens_v2)
        // @ts-ignore
        .where(inArray(tokens_v2.id, tokenAddresses));

      // 2. Sincronizar estos tokens en la base de datos SQLite local
      const tokenSyncPromises = tokensFromSupabase.map((token: any) =>
        sqliteDb.token.upsert({
          where: { network_address: { network: token.network, address: token.id } },
          update: {
            name: token.name,
            symbol: token.symbol,
            decimals: token.decimals,
          },
          create: {
            address: token.id,
            network: token.network,
            name: token.name,
            symbol: token.symbol,
            decimals: token.decimals,
          },
        })
      );
      await Promise.all(tokenSyncPromises);
      logger.info(`[${network}] Successfully synced ${tokensFromSupabase.length} tokens to SQLite.`);
    }

    // 2. Preparar los datos para SQLite
    const sqliteAnchorTokenData = HARDCODED_ANCHORS.map(anchor => ({
      network: network,
      tokenAddress: anchor.tokenAddress,
      priority: anchor.priority,
      category: anchor.category,
    }));

    await sqliteDb.$transaction([
      sqliteDb.anchorToken.deleteMany({ where: { network } }),
      sqliteDb.anchorToken.createMany({
        data: sqliteAnchorTokenData,
      }),
    ]);

    logger.info(`[${network}] Successfully synchronized ${sqliteAnchorTokenData.length} anchor tokens to SQLite.`);

  } catch (error) {
    logger.error(`[${network}] Failed to sync anchor tokens to SQLite:`, error);
    throw error;
  }
}