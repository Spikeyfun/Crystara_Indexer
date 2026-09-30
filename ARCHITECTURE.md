# Arquitectura de datos — contrato (Hoglet / Spikey)

Documento de referencia: **qué tabla vive dónde, quién escribe y quién lee.**
Regla de oro: **una sola fuente de verdad por tabla, un solo writer por tabla.**

## Bases de datos

| Ref | Región | Rol | Usado por |
|-----|--------|-----|-----------|
| `agjqkuhdbxhjvnqbsqwy` | us-east-1 | **AMM / OHLC / tokens-pools** | `amm_indexer` (writer), `telegram_bot` (reader + config) |
| `yziweryfpwwlokijgalb` | us-west-1 | **Farm / stats** | `spike_indexer` → `d1-sync-worker` → `/farm` |

> `amm_indexer` usa además **SQLite local** (VPS) como capa "hot" para swaps y velas 1m.

## Propiedad de datos

| Dato | BD | Writer | Readers |
|------|----|--------|---------|
| `OhlcData` 5m / 1h / 1d | `agjq…` | **`amm_indexer`** | `telegram_bot`, `spike_indexer` |
| `tokens_v2` / `ammpair_v2` | `agjq…` | **`amm_indexer`** | `telegram_bot` |
| `group_configuration` | `agjq…` | **`telegram_bot`** (`/settoken`, `/monitor`) | `telegram_bot` (spike monitor) |
| `BlockProgress` / `EventTracking` | `agjq…` | **`amm_indexer`** | `amm_indexer` |
| OHLC 1m + snaps crudos | SQLite (VPS) | **`amm_indexer`** | `amm_indexer` (agrega) |
| `ammpair_v2` / `ammpair_stats` | `yziw…` | **`spike_indexer`** | `d1-sync-worker` |

## Esquema canónico: V2

`tokens_v2.id` = **dirección del token** (texto). `ammpair_v2.id` = **dirección del pool**.
`OhlcData` referencia tokens por `token0Address` / `token1Address` (direcciones).

`tokens_v2` campos: `id`, `numId` (id numérico corto, para `callback_data` de Telegram), `network`,
`name`, `symbol`, `decimals`, `wrappedAddress`, `maxSupply`, `circulatingSupply`, `minTradeVolume`, `createdAt`.

**V1 deprecada** (sigue presente, aditivo, sin drop): `Token`, `Pair`, `GroupConfiguration` (PascalCase).
No usar en código nuevo. Migración V1→V2: `scripts/migrate-v2.ts` (idempotente, con guarda de project-ref).

## Pipeline

```
chain
  └─ amm_indexer (poller REST/WS) ─▶ SQLite { swaps, 1m OHLC, tokens/pairs }
        └─ cada min : 1m (SQLite)
        └─ sync     : tokens_v2 / ammpair_v2        (Supabase agjq…)
        └─ cada 5m  : 5m  (Supabase agjq…)
        └─ cada 1h  : 1h  (Supabase agjq…)
        └─ diario   : 1d  (Supabase agjq…)
              ├─ telegram_bot   : charts 5m/1h/1d, /price, market cap, monitor de spikes
              └─ spike_indexer  : APR/APY → ammpair_stats (yziw…) → D1 → /farm
```

## Retención

| Dato | Dónde | Retención |
|------|-------|-----------|
| swaps + 1m | SQLite | 7 días (`executeDbCleanup`) |
| 5m | Supabase `agjq…` | **180 días** (`SUPABASE_OHLC_5M_RETENTION_DAYS`, 0 = off) |
| 1h | Supabase `agjq…` | sin poda por defecto (`SUPABASE_OHLC_1H_RETENTION_DAYS`) |
| 1d | Supabase `agjq…` | sin poda |

## Reglas operativas

1. **Un writer por tabla.** OHLC y `tokens_v2`/`ammpair_v2`: solo `amm_indexer`. `group_configuration`: solo el bot.
2. `amm_indexer` **no** debe fallar en silencio: si el anchor-sync falla, los crons **igual** arrancan.
3. **Watchdog** (`lib/tasks/freshnessWatchdog.ts`): vigila que `BlockProgress` avance + edad de datos; opcional `ALERT_WEBHOOK_URL`.
4. El poller avanza gratis; el **peligro real es la agregación** (crons). Si no hay velas nuevas, mirar los crons y `blockProgress`.
5. El bot obtiene el token del monitor de **D1** (`/api/tokens?search=<address>`), no de Supabase.

## Pendiente / decisiones abiertas

- Retirar V1 (`Token`/`Pair`/`GroupConfiguration`) cuando todo consumidor esté en V2.
- (Opcional) Rol **read-only** en `agjq…` para OHLC. Nota: el bot **escribe** `group_configuration`,
  así que requeriría separar conexiones (RO para OHLC, RW para config).
- (Opcional) Desacoplar el monitor de spikes de la SQLite de `amm_indexer`.
