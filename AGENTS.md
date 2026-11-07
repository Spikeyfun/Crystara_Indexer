# AGENTS.md — AMM Indexer (Supra AMM Events & OHLC Engine)

Guía técnica y contexto operativo para agentes autónomos y LLMs.
**Objetivo:** Comprender la ingesta de eventos on-chain, buffers SQLite, agregación OHLC y sincronización a Supabase sin releer el código fuente.

---

## 1. 📌 Qué es y Responsabilidades

`amm_indexer` es el servicio de indexación y agregación de eventos AMM para **Supra L1** (Spikey, Atmos, Dexlyn). 
- **Escucha / Polling On-chain**: Lee eventos de swap, creación de pares y sincronización de reservas via REST/WS RPC.
- **Hot Buffer (SQLite Local)**: Almacena en crudo los swaps y calcula las velas rápidas de 1 minuto (`1m`).
- **Agregador Multi-Temporal**: Genera y persiste velas periódicas hacia Supabase (`5m`, `1h`, `1d`).
- **Metadata Sync**: Sincroniza pares y tokens hacia el esquema canónico V2 (`tokens_v2`, `ammpair_v2`).
- **Watchdog de Frescura**: Supervisa `BlockProgress` y genera alertas si el indexador se congela.

---

## 2. 🗄️ Bases de Datos y Roles

| Base de Datos | Ubicación | Rol | Tablas Clave |
| :--- | :--- | :--- | :--- |
| **SQLite Local** | VPS (`./prisma/sqlite/dev.db`) | Ingesta "hot", buffers rápidos | `RawSwaps`, `Ohlc1m`, `Token`, `Pair` |
| **Supabase AMM** (`agjqkuhdbxhjvnqbsqwy`) | us-east-1 (Cloud PG) | Consumo público, histórico | `tokens_v2`, `ammpair_v2`, `OhlcData` (5m/1h/1d), `BlockProgress` |

> ⚠️ **Regla de Oro**: Solo `amm_indexer` tiene permisos de escritura en `OhlcData`, `tokens_v2` y `ammpair_v2`. Los demás componentes (`telegram_bot`, `spike_indexer`) son solo lectores de estas tablas.

---

## 3. 📁 Estructura del Código

```
amm_indexer/
├── scripts/
│   ├── run-indexer.ts           # Punto de entrada principal (Pollers + Crons de agregación)
│   ├── migrate-v2.ts            # Migración idempotente de esquema V1 -> V2
│   ├── backfill-mainnet.ts      # Reindexación y backfilling histórico
│   ├── cleanup-ohlc-by-token.ts # Poda y limpieza manual de velas inconsistentes
│   └── inspect-sqlite-db.ts     # Diagnóstico del estado del buffer local
├── lib/
│   ├── TaskProcessor.ts         # Orquestador de tareas periódicas (1m, 5m, 1h, sync DB)
│   ├── prismadb.ts              # Conexión dual: SQLite (`prismaSqlite`) + Supabase (`prismaSupabase`)
│   ├── tasks/                   # Lógica modular de agregación OHLC, sincronización y retención
│   │   ├── ohlcAggregation.ts   # Cálculo matemático de velas (O, H, L, C, Volume)
│   │   ├── freshnessWatchdog.ts # Monitoreo de lag en bloques
│   │   └── executeDbCleanup.ts  # Purga de datos locales > 7 días
│   └── functions/               # Desempaquetado de eventos y llamadas a vistas RPC
├── prisma/
│   ├── sqlite/schema.prisma     # Definición del buffer local
│   └── supabase/schema.prisma   # Esquema canónico en PostgreSQL Supabase
├── ecosystem.config.js          # Configuración PM2 de producción (`amm-indexer`)
└── Dockerfile.indexer           # Empaquetado para despliegue en contenedor
```

---

## 4. 🔄 Ciclo de Vida y Tareas Periódicas (`TaskProcessor`)

```
Eventos On-Chain (Spikey / Dexlyn / Atmos)
   │
   ▼
SQLite: Swaps crudos insertados inmediatamente
   ├─ Cada 1 minuto: Agrega swaps -> SQLite `Ohlc1m`
   ├─ Cada 1 minuto: Sincroniza tokens y pares a Supabase (`tokens_v2`, `ammpair_v2`)
   ├─ Cada 5 minutos: Agrega velas `5m` -> Supabase `OhlcData` (Retención: 180 días)
   ├─ Cada 1 hora: Agrega velas `1h` -> Supabase `OhlcData` (Sin poda)
   ├─ Cada 24 horas: Agrega velas `1d` -> Supabase `OhlcData` (Sin poda)
   └─ Diario: Poda de swaps y 1m en SQLite (`executeDbCleanup` > 7 días)
```

---

## 5. 🚀 Comandos de Desarrollo y Operación

```bash
# Instalar dependencias
pnpm install

# Generar clientes de Prisma para ambas bases de datos
pnpm run prisma:generate:sqlite
pnpm run prisma:generate:supabase

# Ejecutar el indexador en desarrollo (con recarga automática)
pnpm run dev:indexer

# Ejecutar en producción con PM2
pnpm run pm2:start
pnpm run pm2:logs
pnpm run pm2:restart

# Ejecutar migración a esquema V2
pnpm exec tsx scripts/migrate-v2.ts
```

---

## 6. ⚠️ Gotchas y Restricciones Críticas

1. **Esquema V2 Canónico**:
   - `tokens_v2.id` = Dirección del token (`0x...` en minúsculas).
   - `ammpair_v2.id` = Dirección del pool/pair.
   - NUNCA usar IDs autoincrementales para relacionar pares o tokens en código nuevo.
2. **Normalización de Decimales**:
   - Diferentes tokens en Supra usan decimales dispares (ej. SUPRA = 8 dec, USDC = 6 dec). Los cálculos de precio en `ohlcAggregation.ts` normalizan siempre la escala para evitar distorsiones de factor $10^2$ o $10^6$.
3. **Resiliencia ante caídas de RPC**:
   - El script `run-indexer.ts` implementa backoff exponencial y reconexión. Si falla la sincronización con Supabase, los crons locales en SQLite NO deben detenerse.
4. **Alerta de Inactividad (Watchdog)**:
   - Si `BlockProgress` no avanza en 10 minutos, el watchdog lanza un webhook de alerta a Discord/Telegram si `ALERT_WEBHOOK_URL` está configurado.

