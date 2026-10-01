# 🔧 Handoff — Degradación del AMM Indexer (DaoCreated / gaps de eventos)

> Destinatario: dev del VPS. Fecha: 2026-10-01. Repo: `amm_indexer`.
> Todo el código de este trabajo ya está escrito, compila limpio y **falta probarlo en el VPS**.

---

## 0. TL;DR para el dev

**Es un `git pull` + deploy.** El código está hecho, compila limpio (0 errores nuevos) y
probado a nivel de base de datos. Después, **una sola verificación de 30 segundos** (§3 Tarea 2).

```
1. git pull && pnpm install && docker compose up -d --build
2. docker compose logs -f --tail 200      # mirar la tabla de logs en §3 Tarea 1
3. VERIFICAR EL .db (lo importante):      # §3 Tarea 2 — 3 comandos
```

**Lo único que puede salir mal** es que el archivo SQLite no esté en un volumen persistente
(§3 Tarea 2). Si tu compose ya lo monta —que es lo más probable, porque si no el indexador
no habría arrancado nunca— **no tenés que tocar nada, solo verificar**.

Nada de esto requiere cambios de schema, migraciones ni tocar el AMM.

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
- **Trocea los rangos** en trozos de ≤ `MAX_RANGE_SPAN` (90) antes de pedir nada.

**Validado localmente:** el write/lectura/parseo del marcador contra la DB SQLite real
(crear → leer → parsear `"1000-1050"` → `1000..1050` → borrar). El troceado de rangos se
verificó con 4 casos (hueco de 150, de 400, el peor caso del coalescer con 200 fallos, y
uno chico) — ninguno excede el límite del RPC y la cobertura de bloques es completa.
**No** se ejecutó el `runRetryPass` completo a propósito, porque reprocesar dispararía
eventos al webhook de **producción** (`daos.hoglet.xyz`) — eso se prueba en el VPS.

### 🐛 Bug latente encontrado y corregido: truncado silencioso de rangos

Al revisar la eficiencia encontré un bug **preexistente** (y que agravaba el replay de
huecos). Dos constantes no coincidían:

```ts
retryJob.ts  MAX_RANGE_SPAN  = 400   // lo que el retryJob pedía
rpcClient.ts MAX_BLOCK_RANGE = 100   // lo que el RPC realmente devolvía
```

`fetchBlockEvents` **clampa** los rangos mayores a 100 **sin avisar al llamador**:

```
retryJob pide bloques 1000-1400 (400)
  → rpcClient: "exceeds MAX_BLOCK_RANGE 100. Clamping."
  → devuelve SOLO 1000-1100
  → el retryJob cree que reprocesó todo
  → 1101-1400: nunca vistos, nunca marcados  ← PÉRDIDA SILENCIOSA
```

Y era peor de lo que parecía: `MAX_RANGE_SPAN` **ni siquiera se usaba** — el coalescer
agrupaba por `gap ≤ 2` sin tope, así que 200 fallos separados por 2 bloques se convertían
en un rango de 400. La constante era decorativa.

Para los huecos era especialmente dañino: el `retryJob` marcaba el hueco como
`processed=true` ("cerrado") habiendo recuperado **solo una parte**.

**Corrección:** `MAX_RANGE_SPAN = 90` (deja margen para el ±1 que añade el propio retryJob)
y **troceado explícito** de todos los rangos — normales y de hueco — antes de pedir nada.
Verificado con 4 casos: 0 rangos exceden el límite y la cobertura de bloques es completa.

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

> **Dato confirmado en el repo:** `.gitignore` tiene `*.db`, y `git ls-files` confirma que
> `prisma/sqlite/dev.db` **no está versionado**. El `Dockerfile.indexer` hace `COPY . .`,
> así que **el `.db` tampoco entra al contenedor desde git**: en el contenedor nace de cero
> en cada build. Por eso el indexador hoy debe estar funcionando o bien (a) porque el compose
> del VPS monta un volumen con un `.db` ya inicializado, o (b) porque alguien corrió
> `prisma db push` a mano una vez.
>
> Además el `CMD` es `npx tsx scripts/run-indexer.ts`, que **no** corre `prisma db push`
> para el schema sqlite. Si tu compose NO monta un `.db` inicializado, las tablas no
> existirían y el indexador no arrancaría — así que **si hoy funciona, es que algo de esto
> ya está resuelto en el compose real**. Por eso la instrucción es *verificar*, no *cambiar*.

**Cómo verificarlo (30 segundos, solo lectura):**

```bash
# 1. ¿Qué volúmenes declara el compose real?
cd /ruta/al/proyecto/amm_indexer
docker compose config | grep -A3 volumes

# 2. ¿Qué .db tiene abierto el proceso EN VIVO?
docker compose exec <servicio> sh -c 'ls -la /app/*.db /app/prisma/sqlite/*.db 2>/dev/null'

# 3. La prueba definitiva: ¿el archivo tiene datos y pesa?
docker compose exec <servicio> sh -c 'ls -la $(find /app -name "*.db" 2>/dev/null | head -1)'
```

Un `.db` sano pesa varios MB y **crece**. Si ves un archivo de 0–20 KB, o que no cambia de
tamaño entre dos consultas, estás frente a una base vacía → **Tarea 2bis**.

**Tarea 2bis — solo si la prueba da archivo vacío/pequeño:**

Agregar un bind mount al compose (junto a los que ya tengas) y pre-inicializar el `.db`:

```yaml
volumes:
  - ./data:/app/data        # el .db debe vivir acá
```

y en el schema cambiar `url = "file:./dev.db"` por `url = "file:/app/data/dev.db"`, o mejor,
volverlo configurable:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("SQLITE_DATABASE_URL")   # y setear SQLITE_DATABASE_URL=file:/app/data/dev.db
}
```

Luego, **una sola vez**, inicializar las tablas dentro del volumen:

```bash
docker compose exec <servicio> sh -c 'npx prisma db push --schema=./prisma/sqlite/schema.prisma'
```

> **No apliqué este cambio a propósito.** El `docker-compose.yml` del repo está vacío (el real
> vive en el VPS) y `*.db` está gitignored, así que cualquier cambio de deploy aquí sería a
> ciegas. **Si tu compose ya monta el volumen y todo funciona, no toques nada** — solo
> verificá el punto 3.

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

### En `amm_indexer` (este repo)

```
app/indexer/gapLog.ts       NUEVO  — registro durable de huecos (reusa EventTracking)
app/indexer/rpcClient.ts           — allSettled, tipos críticos vs best-effort, isNotIndexed
app/indexer/poller.ts              — no saltar en 404, registrar huecos (skip y fetch DAO)
app/indexer/retryJob.ts            — replay de huecos, cierre condicional
app/indexer/eventProcessor.ts      — refresca updatedAt al marcar un evento como fallido
```

### En `dao-hoglet-cloudflare/Full-stack` (repo del webhook — deploy aparte)

```
src/app/api/indexer/webhook/route.ts   — tipo no manejado devuelve 501 (antes 200 + pérdida silenciosa)
```

> **Ojo:** este segundo cambio está en **otro repositorio** y **otro deploy**. Si solo se
> despliega el `amm_indexer`, el fix del webhook no entra. Y al revés también.

---

## 4b. Por qué el cambio del webhook (501) es la mitad del fix

Los dos cambios son complementarios. Uno sin el otro no arregla nada:

| Cambio | Qué arregla |
|---|---|
| **A** — webhook responde 501 a tipos no manejados | Que el evento **no se marque como procesado** cuando en realidad no se procesó |
| **B** — `updatedAt` se refresca en cada reintento | Que el evento **siga reintentándose** y no expire a las 24h |

**El detalle que hace B indispensable.** `EventTracking.updatedAt` es
`DateTime @default(now())` — **sin** `@updatedAt`. Prisma solo lo setea al **insertar**,
nunca al actualizar. Y el `retryJob` filtra:

```ts
where: { processed: false, updatedAt: { gte: now - 24h } }   // retryJob.ts:50
```

Sin B: el evento se inserta a las 10:00 → se reintenta a las 10:05, 10:10… pero
`updatedAt` **sigue siendo 10:00** → a las 10:00 del día siguiente cae fuera de la ventana
y **el retryJob deja de verlo para siempre**. Queda huérfano en la DB: evidencia, pero
nadie lo reintenta más.

Con B: `updatedAt` se renueva en cada intento → la ventana significa *"24h sin tocarse"*,
que es la semántica correcta.

**Cómo saber en una semana qué no se procesó** (esto es lo que preguntabas):

```sql
-- Eventos pendientes (se reintentan cada 5 min)
SELECT eventType, COUNT(*) AS veces, MIN(createdAt) AS primer_fallo, MAX(error)
FROM EventTracking
WHERE processed = 0
GROUP BY eventType
ORDER BY veces DESC;
```

Un `eventType` con muchas filas y `updatedAt` reciente = algo que **sigue fallando ahora**.
Ese es el signal para investigar.

---

## 5. Lo que NO hice a propósito (y por qué)

- **No** agregué columnas nuevas a D1 / al schema: el `docker-compose.yml` del repo está
  vacío (el real está en el VPS) y no quiero arriesgar un cambio de deploy que no puedo
  probar.
- **No** toqué el manejo de timeouts de SQLite: es un tema real pero independiente; primero
  hay que confirmar la Tarea 2.
- **No** ejecuté el `retryJob` completo localmente (habría golpeado el webhook de producción).