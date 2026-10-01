# 🔧 Handoff — Degradación del AMM Indexer (DaoCreated / gaps de eventos)

> Destinatario: dev del VPS. Fecha: 2026-10-01. Repo: `amm_indexer`.
> Todo el código de este trabajo ya está escrito, compila limpio y **falta probarlo en el VPS**.

---

## 1. Resumen: qué estaba pasando

El dev reportó este error repetido en los logs del `amm_indexer`:

```
[rpcClient] ERROR: Max retries reached for
0xe3604080…::petra::DaoCreated. Throwing error to abort batch.
```

Y se acompañaba de: el indexer se quedaba atascado reintentando el mismo bloque, y además
aparecían timeouts de SQLite que rompían `executeOhlcAggregation5m` y `freshnessWatchdog`.

**Diagnóstico real (verificado contra código y RPC):**

El error viene de `app/indexer/rpcClient.ts`, **no** del handler del evento DAO ni del
webhook. El fetch de eventos pedía los **23 tipos de evento** (AMM + DAO) en lotes de 5
con `Promise.all`. Si **un solo tipo** agotaba sus 3 reintentos, `Promise.all` rechazaba
**todo el lote**, y con ello se perdían también los `SwapEvent`/`SyncEvent` del AMM.
El `DaoCreated` que aparecía en el log era simplemente el tipo que perdía la carrera de
reintentos — no tenía nada de especial.

Encima de eso, el poller tiene un mecanismo de escape: tras **15 fallos consecutivos**
(`MAX_BATCH_FAILURES_BEFORE_SKIP`) con infra sana, **salta 50 bloques** (`BATCH_SIZE`) y
loguea `Events in this range WILL BE MISSING`. O sea: los swaps reales se perdían.

Y lo peor: **un fallo de *fetch* no dejaba rastro en ninguna tabla**, porque `eventTracking`
solo se escribe al _procesar_ el evento. Si el fetch falla, no se llega a procesar, no hay
fila, y el `retryJob` no tenía nada que reintentar. La pérdida era estructuralmente invisible.

### Correcciones a las hipótesis iniciales

- ❌ **"El webhook de la DAO devuelve error"** — el webhook se llama en `eventProcessor.ts:202`,
  **después** del fetch, y su fallo ya está capturado. No puede producir un error de `rpcClient`.
- ❌ **"Revisar el código del evento DAO"** — nunca se llega al handler; el fetch falla antes.
- ⚠️ **"SQLite locks"** — es un problema real pero **separado**, no causa este error.

### Causa raíz de fondo: el API de eventos es intermitente

El endpoint `/rpc/v3/events/{tipo}` devolvió **200** y luego **404** para la *misma*
consulta, con minutos de diferencia. El código trata el 404 como "bloque todavía no
indexado" y reintenta; si persiste, agotaba reintentos.

---

## 2. Qué se cambió (ya está en el código)

Cuatro archivos. `tsc` limpio (0 errores nuevos; el baseline del repo es de 23).

### `app/indexer/gapLog.ts` — NUEVO

`recordEventGap(network, startBlock, endBlock, reason)` escribe un marcador `__GAP__` en
`EventTracking` con el rango codificado en `sequenceNumber` como `"start-end"`.

**No hay base de datos nueva ni migración**: reusa `EventTracking`, que ya es durable
(SQLite) y que el `retryJob` ya recorre cada 5 minutos. Eso fue decisión deliberada para
no tocar el deploy ni el schema.

### `app/indexer/rpcClient.ts`

- `CRITICAL_EVENT_TYPES`: los 3 tipos del AMM (`Swap`/`Sync` de Spike y Dexlyn) son
  **críticos**; todo lo demás (DAO) es **best-effort**.
- `Promise.all` → **`Promise.allSettled`**. Un tipo DAO caído ya **no aborta** el fetch del
  AMM. Si un crítico falla, se relanza el error como antes (el poller reintenta el rango).
- `fetchBlockEventsDetailed(...)` devuelve `{ events, failedBestEffort }`.
  `fetchBlockEvents(...)` queda como wrapper con la firma vieja, así que
  `scripts/manual-index.ts` y `test-rpc.ts` siguen funcionando sin cambios.
- El error de reintentos agotados lleva `isNotIndexed = true` cuando la causa fue un 404
  ("bloque no indexado todavía" = lag del RPC, no un lote roto).

### `app/indexer/poller.ts`

- Usa `fetchBlockEventsDetailed` y **registra el hueco** si algún tipo DAO falló.
- **Un 404 (`isNotIndexed`) ya no cuenta para el skip**: el poller espera y reintenta en
  lugar de saltar 50 bloques. Los eventos van a existir; saltarlos los perdería.
- Cuando igual decide saltar, **registra el hueco antes de avanzar el cursor** (si el
  proceso muere entre el skip y el registro, el rango se perdería para siempre).

### `app/indexer/retryJob.ts`

- Detecta los marcadores `__GAP__`, re-fetchea el rango completo y reprocesa.
- Dentro de un hueco reprocesa **todo** el rango (no hay "fallo exacto" que filtrar;
  `processEvents` es idempotente y salta lo ya procesado). Fuera del hueco conserva el
  filtrado exacto que ya tenía.
- **Cierra el hueco solo si el re-fetch salió limpio.** Si el re-fetch vuelve a fallar en
  los tipos DAO, el hueco queda abierto para el siguiente pass (si no, se cerraría un hueco
  que sigue incompleto).

**Validado localmente:** el write/lectura/parseo del marcador contra la DB SQLite real
(crear → leer → parsear `"1000-1050"` → `1000..1050` → borrar). **No** se ejecutó el
`runRetryPass` completo a propósito, porque reprocesar dispararía eventos al webhook de
**producción** (`daos.hoglet.xyz`) — eso se prueba en el VPS.

---

## 3. ⚠️ TODO lo que falta hacer (tareas del dev)

### Tarea 1 — Deploy y verificación en el VPS

```bash
cd /ruta/al/proyecto/amm_indexer
git pull
pnpm install
docker compose up -d --build      # o el comando de deploy que usen
docker compose logs -f --tail 200
```

**Qué mirar en los logs:**

| Log esperado | Significado |
|---|---|
| `⏸️` NO debe aparecer | si aparece `Batch @N not indexed yet ... NOT skipping` es **normal** (lag del RPC) |
| `[gap] Rango A-B registrado para replay` | se registró un hueco → se reprocesará en ≤5 min |
| `Retry: re-procesando N eventos ... N hueco(s) cerrados` | el replay funcionó |
| `huecos NO cerrados` | el re-fetch volvió a fallar; se reintentará en el próximo pass |
| `best-effort fetch: <tipos>` | un tipo DAO falló pero el AMM siguió |

**Prueba funcional:** correr un par de veces y confirmar que el `blockProgress` avanza
de forma sostenida (antes se quedaba atascado / saltaba bloques).

### Tarea 2 — 🔴 IMPORTANTE: confirmar que el SQLite está en un volumen persistente

Este es el **mayor riesgo de pérdida de datos de todo el stack** y no lo puedo verificar
desde acá.

`prisma/sqlite/schema.prisma` tiene:

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"     # ← LITERAL y RELATIVA
}
```

Por ser un string literal (no `env(...)`), Prisma lo graba en el cliente generado e
**ignora `DATABASE_URL`**. Y al ser relativa, se resuelve contra el **cwd del proceso**, no
contra la carpeta del proyecto.

**Si en el VPS el `dev.db` queda dentro de la capa del contenedor (sin bind mount), un
`docker compose down` lo borra entero**, y con él:

- todos los swaps crudos,
- `eventTracking` (**incluyendo los huecos que acabamos de crear**),
- **todo el OHLC 1m** — que **no existe en Supabase** (verificado: Supra tiene 1d/1h/5m,
  y `1m → 0 filas`). El spike monitor del bot de Telegram lee el 1m de ahí.

**Cómo verificarlo:**

```bash
# 1. Ver los volúmenes declarados en el compose real
cat docker-compose.yml            # (en el repo está vacío; el real está en el VPS)

# 2. Ver qué archivo tiene abierto el proceso
docker exec <container> ls -la /app/*.db
docker exec <container> sh -c 'ls -la /app/dev.db'

# 3. Confirmar que sobrevive a un restart
docker compose restart <servicio>
docker exec <container> sh -c 'ls -la /app/dev.db'
```

**Si NO está en un volumen**, agregar un bind mount al compose (junto a los que ya hay) y
documentarlo acá:

```yaml
volumes:
  - ./data:/app/data          # ← el .db debería vivir acá
```

y cambiar la ruta del schema (o `STATE_DIR`-style) para que apunte a `/app/data/dev.db`.
Esto es un cambio de deploy — **no lo apliqué**; lo dejo a criterio del dev.

> Nota: el spike monitor del bot depende de este mismo `dev.db` (lo lee por
> `INDEXER_SQLITE_PATH`). Si el archivo se regenera vacío, el bot simplemente no tiene
> velas 1m y no alerta.

### Tarea 3 — Confirmar `SUPRA_RPC_URL_MAINNET`

`retryJob.ts:93-95` lee `process.env.SUPRA_RPC_URL_MAINNET` y
`process.env.SUPRA_RPC_URL_TESTNET` — **sin** el prefijo `NEXT_PUBLIC_` que sí usa el resto
del indexer (`.env` define `NEXT_PUBLIC_SUPRA_RPC_URL_MAINNET`).

Si la variable sin prefijo no existe, cae al default `https://rpc-mainnet.supra.com/rpc/v1`,
que **funciona** — pero conviene definirla explícitamente para que el replay use el mismo
endpoint (y failover) que el resto:

```bash
# en el .env del amm_indexer, junto a las otras
SUPRA_RPC_URL_MAINNET=<misma URL que NEXT_PUBLIC_SUPRA_RPC_URL_MAINNET>
```

El dev dijo que las env están correctas en el VPS y que todo funcionaba — así que esto
probablemente ya esté bien; es solo para que quede **explícito** y no dependa del default.

### Tarea 4 — Backfill de los bloques ya perdidos (opcional)

Antes de este fix, cada vez que el poller saltaba 50 bloques **se perdían para siempre**.
Si quieren recuperar ese histórico:

1. Revisar los logs del VPS buscando `Skipping blocks A-B` (el mensaje viejo, antes del fix).
2. Ojo: los huecos ya perdidos **no** quedaron registrados (el registro es nuevo). Habría
   que hacerlo manual: buscar los swaps faltantes por fecha y reindexarlos con
   `scripts/manual-index.ts`.
3. Si no es prioridad, se puede dejar — a partir de ahora no se pierde más.

---

## 4. Resumen de archivos

```
app/indexer/gapLog.ts       NUEVO  — registro durable de huecos (reusa EventTracking)
app/indexer/rpcClient.ts           — allSettled, tipos críticos vs best-effort, isNotIndexed
app/indexer/poller.ts              — no saltar en 404, registrar huecos (skip y fetch DAO)
app/indexer/retryJob.ts            — replay de huecos, cierre condicional
```

Sin cambios en: schemas, migraciones, `docker-compose`, contratos, ni el worker de D1.

---

## 5. Lo que NO hice a propósito (y por qué)

- **No** agregué columnas nuevas a D1 / al schema: el `docker-compose.yml` del repo está
  vacío (el real está en el VPS) y no quiero arriesgar un cambio de deploy que no puedo
  probar.
- **No** toqué el manejo de timeouts de SQLite: es un tema real pero independiente; primero
  hay que confirmar la Tarea 2.
- **No** ejecuté el `retryJob` completo localmente (habría golpeado el webhook de producción).