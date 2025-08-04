
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model EventTracking
 * 
 */
export type EventTracking = $Result.DefaultSelection<Prisma.$EventTrackingPayload>
/**
 * Model SpikeyAmmSwap
 * 
 */
export type SpikeyAmmSwap = $Result.DefaultSelection<Prisma.$SpikeyAmmSwapPayload>
/**
 * Model DexlynSwap
 * 
 */
export type DexlynSwap = $Result.DefaultSelection<Prisma.$DexlynSwapPayload>
/**
 * Model Token
 * 
 */
export type Token = $Result.DefaultSelection<Prisma.$TokenPayload>
/**
 * Model Pair
 * 
 */
export type Pair = $Result.DefaultSelection<Prisma.$PairPayload>
/**
 * Model OhlcData
 * 
 */
export type OhlcData = $Result.DefaultSelection<Prisma.$OhlcDataPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more EventTrackings
 * const eventTrackings = await prisma.eventTracking.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more EventTrackings
   * const eventTrackings = await prisma.eventTracking.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.eventTracking`: Exposes CRUD operations for the **EventTracking** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EventTrackings
    * const eventTrackings = await prisma.eventTracking.findMany()
    * ```
    */
  get eventTracking(): Prisma.EventTrackingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.spikeyAmmSwap`: Exposes CRUD operations for the **SpikeyAmmSwap** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SpikeyAmmSwaps
    * const spikeyAmmSwaps = await prisma.spikeyAmmSwap.findMany()
    * ```
    */
  get spikeyAmmSwap(): Prisma.SpikeyAmmSwapDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.dexlynSwap`: Exposes CRUD operations for the **DexlynSwap** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DexlynSwaps
    * const dexlynSwaps = await prisma.dexlynSwap.findMany()
    * ```
    */
  get dexlynSwap(): Prisma.DexlynSwapDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.token`: Exposes CRUD operations for the **Token** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tokens
    * const tokens = await prisma.token.findMany()
    * ```
    */
  get token(): Prisma.TokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pair`: Exposes CRUD operations for the **Pair** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Pairs
    * const pairs = await prisma.pair.findMany()
    * ```
    */
  get pair(): Prisma.PairDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ohlcData`: Exposes CRUD operations for the **OhlcData** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OhlcData
    * const ohlcData = await prisma.ohlcData.findMany()
    * ```
    */
  get ohlcData(): Prisma.OhlcDataDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.13.0
   * Query Engine version: 361e86d0ea4987e9f53a565309b3eed797a6bcbd
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    EventTracking: 'EventTracking',
    SpikeyAmmSwap: 'SpikeyAmmSwap',
    DexlynSwap: 'DexlynSwap',
    Token: 'Token',
    Pair: 'Pair',
    OhlcData: 'OhlcData'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "eventTracking" | "spikeyAmmSwap" | "dexlynSwap" | "token" | "pair" | "ohlcData"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      EventTracking: {
        payload: Prisma.$EventTrackingPayload<ExtArgs>
        fields: Prisma.EventTrackingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventTrackingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTrackingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventTrackingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTrackingPayload>
          }
          findFirst: {
            args: Prisma.EventTrackingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTrackingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventTrackingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTrackingPayload>
          }
          findMany: {
            args: Prisma.EventTrackingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTrackingPayload>[]
          }
          create: {
            args: Prisma.EventTrackingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTrackingPayload>
          }
          createMany: {
            args: Prisma.EventTrackingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EventTrackingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTrackingPayload>[]
          }
          delete: {
            args: Prisma.EventTrackingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTrackingPayload>
          }
          update: {
            args: Prisma.EventTrackingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTrackingPayload>
          }
          deleteMany: {
            args: Prisma.EventTrackingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventTrackingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EventTrackingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTrackingPayload>[]
          }
          upsert: {
            args: Prisma.EventTrackingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTrackingPayload>
          }
          aggregate: {
            args: Prisma.EventTrackingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEventTracking>
          }
          groupBy: {
            args: Prisma.EventTrackingGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventTrackingGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventTrackingCountArgs<ExtArgs>
            result: $Utils.Optional<EventTrackingCountAggregateOutputType> | number
          }
        }
      }
      SpikeyAmmSwap: {
        payload: Prisma.$SpikeyAmmSwapPayload<ExtArgs>
        fields: Prisma.SpikeyAmmSwapFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SpikeyAmmSwapFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpikeyAmmSwapPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SpikeyAmmSwapFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpikeyAmmSwapPayload>
          }
          findFirst: {
            args: Prisma.SpikeyAmmSwapFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpikeyAmmSwapPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SpikeyAmmSwapFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpikeyAmmSwapPayload>
          }
          findMany: {
            args: Prisma.SpikeyAmmSwapFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpikeyAmmSwapPayload>[]
          }
          create: {
            args: Prisma.SpikeyAmmSwapCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpikeyAmmSwapPayload>
          }
          createMany: {
            args: Prisma.SpikeyAmmSwapCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SpikeyAmmSwapCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpikeyAmmSwapPayload>[]
          }
          delete: {
            args: Prisma.SpikeyAmmSwapDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpikeyAmmSwapPayload>
          }
          update: {
            args: Prisma.SpikeyAmmSwapUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpikeyAmmSwapPayload>
          }
          deleteMany: {
            args: Prisma.SpikeyAmmSwapDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SpikeyAmmSwapUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SpikeyAmmSwapUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpikeyAmmSwapPayload>[]
          }
          upsert: {
            args: Prisma.SpikeyAmmSwapUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpikeyAmmSwapPayload>
          }
          aggregate: {
            args: Prisma.SpikeyAmmSwapAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSpikeyAmmSwap>
          }
          groupBy: {
            args: Prisma.SpikeyAmmSwapGroupByArgs<ExtArgs>
            result: $Utils.Optional<SpikeyAmmSwapGroupByOutputType>[]
          }
          count: {
            args: Prisma.SpikeyAmmSwapCountArgs<ExtArgs>
            result: $Utils.Optional<SpikeyAmmSwapCountAggregateOutputType> | number
          }
        }
      }
      DexlynSwap: {
        payload: Prisma.$DexlynSwapPayload<ExtArgs>
        fields: Prisma.DexlynSwapFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DexlynSwapFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DexlynSwapPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DexlynSwapFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DexlynSwapPayload>
          }
          findFirst: {
            args: Prisma.DexlynSwapFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DexlynSwapPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DexlynSwapFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DexlynSwapPayload>
          }
          findMany: {
            args: Prisma.DexlynSwapFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DexlynSwapPayload>[]
          }
          create: {
            args: Prisma.DexlynSwapCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DexlynSwapPayload>
          }
          createMany: {
            args: Prisma.DexlynSwapCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DexlynSwapCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DexlynSwapPayload>[]
          }
          delete: {
            args: Prisma.DexlynSwapDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DexlynSwapPayload>
          }
          update: {
            args: Prisma.DexlynSwapUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DexlynSwapPayload>
          }
          deleteMany: {
            args: Prisma.DexlynSwapDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DexlynSwapUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DexlynSwapUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DexlynSwapPayload>[]
          }
          upsert: {
            args: Prisma.DexlynSwapUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DexlynSwapPayload>
          }
          aggregate: {
            args: Prisma.DexlynSwapAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDexlynSwap>
          }
          groupBy: {
            args: Prisma.DexlynSwapGroupByArgs<ExtArgs>
            result: $Utils.Optional<DexlynSwapGroupByOutputType>[]
          }
          count: {
            args: Prisma.DexlynSwapCountArgs<ExtArgs>
            result: $Utils.Optional<DexlynSwapCountAggregateOutputType> | number
          }
        }
      }
      Token: {
        payload: Prisma.$TokenPayload<ExtArgs>
        fields: Prisma.TokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          findFirst: {
            args: Prisma.TokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          findMany: {
            args: Prisma.TokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>[]
          }
          create: {
            args: Prisma.TokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          createMany: {
            args: Prisma.TokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>[]
          }
          delete: {
            args: Prisma.TokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          update: {
            args: Prisma.TokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          deleteMany: {
            args: Prisma.TokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>[]
          }
          upsert: {
            args: Prisma.TokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          aggregate: {
            args: Prisma.TokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateToken>
          }
          groupBy: {
            args: Prisma.TokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<TokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.TokenCountArgs<ExtArgs>
            result: $Utils.Optional<TokenCountAggregateOutputType> | number
          }
        }
      }
      Pair: {
        payload: Prisma.$PairPayload<ExtArgs>
        fields: Prisma.PairFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PairFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PairPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PairFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PairPayload>
          }
          findFirst: {
            args: Prisma.PairFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PairPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PairFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PairPayload>
          }
          findMany: {
            args: Prisma.PairFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PairPayload>[]
          }
          create: {
            args: Prisma.PairCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PairPayload>
          }
          createMany: {
            args: Prisma.PairCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PairCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PairPayload>[]
          }
          delete: {
            args: Prisma.PairDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PairPayload>
          }
          update: {
            args: Prisma.PairUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PairPayload>
          }
          deleteMany: {
            args: Prisma.PairDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PairUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PairUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PairPayload>[]
          }
          upsert: {
            args: Prisma.PairUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PairPayload>
          }
          aggregate: {
            args: Prisma.PairAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePair>
          }
          groupBy: {
            args: Prisma.PairGroupByArgs<ExtArgs>
            result: $Utils.Optional<PairGroupByOutputType>[]
          }
          count: {
            args: Prisma.PairCountArgs<ExtArgs>
            result: $Utils.Optional<PairCountAggregateOutputType> | number
          }
        }
      }
      OhlcData: {
        payload: Prisma.$OhlcDataPayload<ExtArgs>
        fields: Prisma.OhlcDataFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OhlcDataFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OhlcDataPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OhlcDataFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OhlcDataPayload>
          }
          findFirst: {
            args: Prisma.OhlcDataFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OhlcDataPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OhlcDataFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OhlcDataPayload>
          }
          findMany: {
            args: Prisma.OhlcDataFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OhlcDataPayload>[]
          }
          create: {
            args: Prisma.OhlcDataCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OhlcDataPayload>
          }
          createMany: {
            args: Prisma.OhlcDataCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OhlcDataCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OhlcDataPayload>[]
          }
          delete: {
            args: Prisma.OhlcDataDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OhlcDataPayload>
          }
          update: {
            args: Prisma.OhlcDataUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OhlcDataPayload>
          }
          deleteMany: {
            args: Prisma.OhlcDataDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OhlcDataUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OhlcDataUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OhlcDataPayload>[]
          }
          upsert: {
            args: Prisma.OhlcDataUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OhlcDataPayload>
          }
          aggregate: {
            args: Prisma.OhlcDataAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOhlcData>
          }
          groupBy: {
            args: Prisma.OhlcDataGroupByArgs<ExtArgs>
            result: $Utils.Optional<OhlcDataGroupByOutputType>[]
          }
          count: {
            args: Prisma.OhlcDataCountArgs<ExtArgs>
            result: $Utils.Optional<OhlcDataCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    eventTracking?: EventTrackingOmit
    spikeyAmmSwap?: SpikeyAmmSwapOmit
    dexlynSwap?: DexlynSwapOmit
    token?: TokenOmit
    pair?: PairOmit
    ohlcData?: OhlcDataOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type TokenCountOutputType
   */

  export type TokenCountOutputType = {
    pairsAsToken0: number
    pairsAsToken1: number
  }

  export type TokenCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pairsAsToken0?: boolean | TokenCountOutputTypeCountPairsAsToken0Args
    pairsAsToken1?: boolean | TokenCountOutputTypeCountPairsAsToken1Args
  }

  // Custom InputTypes
  /**
   * TokenCountOutputType without action
   */
  export type TokenCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenCountOutputType
     */
    select?: TokenCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TokenCountOutputType without action
   */
  export type TokenCountOutputTypeCountPairsAsToken0Args<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PairWhereInput
  }

  /**
   * TokenCountOutputType without action
   */
  export type TokenCountOutputTypeCountPairsAsToken1Args<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PairWhereInput
  }


  /**
   * Count Type PairCountOutputType
   */

  export type PairCountOutputType = {
    spikeyAmmSwaps: number
    dexlynSwaps: number
    ohlcData: number
  }

  export type PairCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    spikeyAmmSwaps?: boolean | PairCountOutputTypeCountSpikeyAmmSwapsArgs
    dexlynSwaps?: boolean | PairCountOutputTypeCountDexlynSwapsArgs
    ohlcData?: boolean | PairCountOutputTypeCountOhlcDataArgs
  }

  // Custom InputTypes
  /**
   * PairCountOutputType without action
   */
  export type PairCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PairCountOutputType
     */
    select?: PairCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PairCountOutputType without action
   */
  export type PairCountOutputTypeCountSpikeyAmmSwapsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpikeyAmmSwapWhereInput
  }

  /**
   * PairCountOutputType without action
   */
  export type PairCountOutputTypeCountDexlynSwapsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DexlynSwapWhereInput
  }

  /**
   * PairCountOutputType without action
   */
  export type PairCountOutputTypeCountOhlcDataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OhlcDataWhereInput
  }


  /**
   * Models
   */

  /**
   * Model EventTracking
   */

  export type AggregateEventTracking = {
    _count: EventTrackingCountAggregateOutputType | null
    _avg: EventTrackingAvgAggregateOutputType | null
    _sum: EventTrackingSumAggregateOutputType | null
    _min: EventTrackingMinAggregateOutputType | null
    _max: EventTrackingMaxAggregateOutputType | null
  }

  export type EventTrackingAvgAggregateOutputType = {
    id: number | null
    blockHeight: number | null
  }

  export type EventTrackingSumAggregateOutputType = {
    id: number | null
    blockHeight: bigint | null
  }

  export type EventTrackingMinAggregateOutputType = {
    id: number | null
    eventType: string | null
    blockHeight: bigint | null
    transactionHash: string | null
    processed: boolean | null
    error: string | null
    createdAt: Date | null
    updatedAt: Date | null
    network: string | null
    sequenceNumber: string | null
  }

  export type EventTrackingMaxAggregateOutputType = {
    id: number | null
    eventType: string | null
    blockHeight: bigint | null
    transactionHash: string | null
    processed: boolean | null
    error: string | null
    createdAt: Date | null
    updatedAt: Date | null
    network: string | null
    sequenceNumber: string | null
  }

  export type EventTrackingCountAggregateOutputType = {
    id: number
    eventType: number
    blockHeight: number
    transactionHash: number
    processed: number
    error: number
    createdAt: number
    updatedAt: number
    network: number
    sequenceNumber: number
    _all: number
  }


  export type EventTrackingAvgAggregateInputType = {
    id?: true
    blockHeight?: true
  }

  export type EventTrackingSumAggregateInputType = {
    id?: true
    blockHeight?: true
  }

  export type EventTrackingMinAggregateInputType = {
    id?: true
    eventType?: true
    blockHeight?: true
    transactionHash?: true
    processed?: true
    error?: true
    createdAt?: true
    updatedAt?: true
    network?: true
    sequenceNumber?: true
  }

  export type EventTrackingMaxAggregateInputType = {
    id?: true
    eventType?: true
    blockHeight?: true
    transactionHash?: true
    processed?: true
    error?: true
    createdAt?: true
    updatedAt?: true
    network?: true
    sequenceNumber?: true
  }

  export type EventTrackingCountAggregateInputType = {
    id?: true
    eventType?: true
    blockHeight?: true
    transactionHash?: true
    processed?: true
    error?: true
    createdAt?: true
    updatedAt?: true
    network?: true
    sequenceNumber?: true
    _all?: true
  }

  export type EventTrackingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventTracking to aggregate.
     */
    where?: EventTrackingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventTrackings to fetch.
     */
    orderBy?: EventTrackingOrderByWithRelationInput | EventTrackingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventTrackingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventTrackings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventTrackings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EventTrackings
    **/
    _count?: true | EventTrackingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EventTrackingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EventTrackingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventTrackingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventTrackingMaxAggregateInputType
  }

  export type GetEventTrackingAggregateType<T extends EventTrackingAggregateArgs> = {
        [P in keyof T & keyof AggregateEventTracking]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEventTracking[P]>
      : GetScalarType<T[P], AggregateEventTracking[P]>
  }




  export type EventTrackingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventTrackingWhereInput
    orderBy?: EventTrackingOrderByWithAggregationInput | EventTrackingOrderByWithAggregationInput[]
    by: EventTrackingScalarFieldEnum[] | EventTrackingScalarFieldEnum
    having?: EventTrackingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventTrackingCountAggregateInputType | true
    _avg?: EventTrackingAvgAggregateInputType
    _sum?: EventTrackingSumAggregateInputType
    _min?: EventTrackingMinAggregateInputType
    _max?: EventTrackingMaxAggregateInputType
  }

  export type EventTrackingGroupByOutputType = {
    id: number
    eventType: string
    blockHeight: bigint
    transactionHash: string
    processed: boolean
    error: string | null
    createdAt: Date
    updatedAt: Date
    network: string
    sequenceNumber: string | null
    _count: EventTrackingCountAggregateOutputType | null
    _avg: EventTrackingAvgAggregateOutputType | null
    _sum: EventTrackingSumAggregateOutputType | null
    _min: EventTrackingMinAggregateOutputType | null
    _max: EventTrackingMaxAggregateOutputType | null
  }

  type GetEventTrackingGroupByPayload<T extends EventTrackingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventTrackingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventTrackingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventTrackingGroupByOutputType[P]>
            : GetScalarType<T[P], EventTrackingGroupByOutputType[P]>
        }
      >
    >


  export type EventTrackingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventType?: boolean
    blockHeight?: boolean
    transactionHash?: boolean
    processed?: boolean
    error?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    network?: boolean
    sequenceNumber?: boolean
  }, ExtArgs["result"]["eventTracking"]>

  export type EventTrackingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventType?: boolean
    blockHeight?: boolean
    transactionHash?: boolean
    processed?: boolean
    error?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    network?: boolean
    sequenceNumber?: boolean
  }, ExtArgs["result"]["eventTracking"]>

  export type EventTrackingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventType?: boolean
    blockHeight?: boolean
    transactionHash?: boolean
    processed?: boolean
    error?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    network?: boolean
    sequenceNumber?: boolean
  }, ExtArgs["result"]["eventTracking"]>

  export type EventTrackingSelectScalar = {
    id?: boolean
    eventType?: boolean
    blockHeight?: boolean
    transactionHash?: boolean
    processed?: boolean
    error?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    network?: boolean
    sequenceNumber?: boolean
  }

  export type EventTrackingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "eventType" | "blockHeight" | "transactionHash" | "processed" | "error" | "createdAt" | "updatedAt" | "network" | "sequenceNumber", ExtArgs["result"]["eventTracking"]>

  export type $EventTrackingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EventTracking"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      eventType: string
      blockHeight: bigint
      transactionHash: string
      processed: boolean
      error: string | null
      createdAt: Date
      updatedAt: Date
      network: string
      sequenceNumber: string | null
    }, ExtArgs["result"]["eventTracking"]>
    composites: {}
  }

  type EventTrackingGetPayload<S extends boolean | null | undefined | EventTrackingDefaultArgs> = $Result.GetResult<Prisma.$EventTrackingPayload, S>

  type EventTrackingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EventTrackingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EventTrackingCountAggregateInputType | true
    }

  export interface EventTrackingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EventTracking'], meta: { name: 'EventTracking' } }
    /**
     * Find zero or one EventTracking that matches the filter.
     * @param {EventTrackingFindUniqueArgs} args - Arguments to find a EventTracking
     * @example
     * // Get one EventTracking
     * const eventTracking = await prisma.eventTracking.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventTrackingFindUniqueArgs>(args: SelectSubset<T, EventTrackingFindUniqueArgs<ExtArgs>>): Prisma__EventTrackingClient<$Result.GetResult<Prisma.$EventTrackingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one EventTracking that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EventTrackingFindUniqueOrThrowArgs} args - Arguments to find a EventTracking
     * @example
     * // Get one EventTracking
     * const eventTracking = await prisma.eventTracking.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventTrackingFindUniqueOrThrowArgs>(args: SelectSubset<T, EventTrackingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EventTrackingClient<$Result.GetResult<Prisma.$EventTrackingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EventTracking that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventTrackingFindFirstArgs} args - Arguments to find a EventTracking
     * @example
     * // Get one EventTracking
     * const eventTracking = await prisma.eventTracking.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventTrackingFindFirstArgs>(args?: SelectSubset<T, EventTrackingFindFirstArgs<ExtArgs>>): Prisma__EventTrackingClient<$Result.GetResult<Prisma.$EventTrackingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EventTracking that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventTrackingFindFirstOrThrowArgs} args - Arguments to find a EventTracking
     * @example
     * // Get one EventTracking
     * const eventTracking = await prisma.eventTracking.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventTrackingFindFirstOrThrowArgs>(args?: SelectSubset<T, EventTrackingFindFirstOrThrowArgs<ExtArgs>>): Prisma__EventTrackingClient<$Result.GetResult<Prisma.$EventTrackingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more EventTrackings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventTrackingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EventTrackings
     * const eventTrackings = await prisma.eventTracking.findMany()
     * 
     * // Get first 10 EventTrackings
     * const eventTrackings = await prisma.eventTracking.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventTrackingWithIdOnly = await prisma.eventTracking.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EventTrackingFindManyArgs>(args?: SelectSubset<T, EventTrackingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventTrackingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a EventTracking.
     * @param {EventTrackingCreateArgs} args - Arguments to create a EventTracking.
     * @example
     * // Create one EventTracking
     * const EventTracking = await prisma.eventTracking.create({
     *   data: {
     *     // ... data to create a EventTracking
     *   }
     * })
     * 
     */
    create<T extends EventTrackingCreateArgs>(args: SelectSubset<T, EventTrackingCreateArgs<ExtArgs>>): Prisma__EventTrackingClient<$Result.GetResult<Prisma.$EventTrackingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many EventTrackings.
     * @param {EventTrackingCreateManyArgs} args - Arguments to create many EventTrackings.
     * @example
     * // Create many EventTrackings
     * const eventTracking = await prisma.eventTracking.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EventTrackingCreateManyArgs>(args?: SelectSubset<T, EventTrackingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EventTrackings and returns the data saved in the database.
     * @param {EventTrackingCreateManyAndReturnArgs} args - Arguments to create many EventTrackings.
     * @example
     * // Create many EventTrackings
     * const eventTracking = await prisma.eventTracking.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EventTrackings and only return the `id`
     * const eventTrackingWithIdOnly = await prisma.eventTracking.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EventTrackingCreateManyAndReturnArgs>(args?: SelectSubset<T, EventTrackingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventTrackingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a EventTracking.
     * @param {EventTrackingDeleteArgs} args - Arguments to delete one EventTracking.
     * @example
     * // Delete one EventTracking
     * const EventTracking = await prisma.eventTracking.delete({
     *   where: {
     *     // ... filter to delete one EventTracking
     *   }
     * })
     * 
     */
    delete<T extends EventTrackingDeleteArgs>(args: SelectSubset<T, EventTrackingDeleteArgs<ExtArgs>>): Prisma__EventTrackingClient<$Result.GetResult<Prisma.$EventTrackingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one EventTracking.
     * @param {EventTrackingUpdateArgs} args - Arguments to update one EventTracking.
     * @example
     * // Update one EventTracking
     * const eventTracking = await prisma.eventTracking.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EventTrackingUpdateArgs>(args: SelectSubset<T, EventTrackingUpdateArgs<ExtArgs>>): Prisma__EventTrackingClient<$Result.GetResult<Prisma.$EventTrackingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more EventTrackings.
     * @param {EventTrackingDeleteManyArgs} args - Arguments to filter EventTrackings to delete.
     * @example
     * // Delete a few EventTrackings
     * const { count } = await prisma.eventTracking.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EventTrackingDeleteManyArgs>(args?: SelectSubset<T, EventTrackingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventTrackings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventTrackingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EventTrackings
     * const eventTracking = await prisma.eventTracking.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EventTrackingUpdateManyArgs>(args: SelectSubset<T, EventTrackingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventTrackings and returns the data updated in the database.
     * @param {EventTrackingUpdateManyAndReturnArgs} args - Arguments to update many EventTrackings.
     * @example
     * // Update many EventTrackings
     * const eventTracking = await prisma.eventTracking.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more EventTrackings and only return the `id`
     * const eventTrackingWithIdOnly = await prisma.eventTracking.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EventTrackingUpdateManyAndReturnArgs>(args: SelectSubset<T, EventTrackingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventTrackingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one EventTracking.
     * @param {EventTrackingUpsertArgs} args - Arguments to update or create a EventTracking.
     * @example
     * // Update or create a EventTracking
     * const eventTracking = await prisma.eventTracking.upsert({
     *   create: {
     *     // ... data to create a EventTracking
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EventTracking we want to update
     *   }
     * })
     */
    upsert<T extends EventTrackingUpsertArgs>(args: SelectSubset<T, EventTrackingUpsertArgs<ExtArgs>>): Prisma__EventTrackingClient<$Result.GetResult<Prisma.$EventTrackingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of EventTrackings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventTrackingCountArgs} args - Arguments to filter EventTrackings to count.
     * @example
     * // Count the number of EventTrackings
     * const count = await prisma.eventTracking.count({
     *   where: {
     *     // ... the filter for the EventTrackings we want to count
     *   }
     * })
    **/
    count<T extends EventTrackingCountArgs>(
      args?: Subset<T, EventTrackingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventTrackingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EventTracking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventTrackingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventTrackingAggregateArgs>(args: Subset<T, EventTrackingAggregateArgs>): Prisma.PrismaPromise<GetEventTrackingAggregateType<T>>

    /**
     * Group by EventTracking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventTrackingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EventTrackingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventTrackingGroupByArgs['orderBy'] }
        : { orderBy?: EventTrackingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EventTrackingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventTrackingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EventTracking model
   */
  readonly fields: EventTrackingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EventTracking.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventTrackingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EventTracking model
   */
  interface EventTrackingFieldRefs {
    readonly id: FieldRef<"EventTracking", 'Int'>
    readonly eventType: FieldRef<"EventTracking", 'String'>
    readonly blockHeight: FieldRef<"EventTracking", 'BigInt'>
    readonly transactionHash: FieldRef<"EventTracking", 'String'>
    readonly processed: FieldRef<"EventTracking", 'Boolean'>
    readonly error: FieldRef<"EventTracking", 'String'>
    readonly createdAt: FieldRef<"EventTracking", 'DateTime'>
    readonly updatedAt: FieldRef<"EventTracking", 'DateTime'>
    readonly network: FieldRef<"EventTracking", 'String'>
    readonly sequenceNumber: FieldRef<"EventTracking", 'String'>
  }
    

  // Custom InputTypes
  /**
   * EventTracking findUnique
   */
  export type EventTrackingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventTracking
     */
    select?: EventTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventTracking
     */
    omit?: EventTrackingOmit<ExtArgs> | null
    /**
     * Filter, which EventTracking to fetch.
     */
    where: EventTrackingWhereUniqueInput
  }

  /**
   * EventTracking findUniqueOrThrow
   */
  export type EventTrackingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventTracking
     */
    select?: EventTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventTracking
     */
    omit?: EventTrackingOmit<ExtArgs> | null
    /**
     * Filter, which EventTracking to fetch.
     */
    where: EventTrackingWhereUniqueInput
  }

  /**
   * EventTracking findFirst
   */
  export type EventTrackingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventTracking
     */
    select?: EventTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventTracking
     */
    omit?: EventTrackingOmit<ExtArgs> | null
    /**
     * Filter, which EventTracking to fetch.
     */
    where?: EventTrackingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventTrackings to fetch.
     */
    orderBy?: EventTrackingOrderByWithRelationInput | EventTrackingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventTrackings.
     */
    cursor?: EventTrackingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventTrackings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventTrackings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventTrackings.
     */
    distinct?: EventTrackingScalarFieldEnum | EventTrackingScalarFieldEnum[]
  }

  /**
   * EventTracking findFirstOrThrow
   */
  export type EventTrackingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventTracking
     */
    select?: EventTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventTracking
     */
    omit?: EventTrackingOmit<ExtArgs> | null
    /**
     * Filter, which EventTracking to fetch.
     */
    where?: EventTrackingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventTrackings to fetch.
     */
    orderBy?: EventTrackingOrderByWithRelationInput | EventTrackingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventTrackings.
     */
    cursor?: EventTrackingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventTrackings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventTrackings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventTrackings.
     */
    distinct?: EventTrackingScalarFieldEnum | EventTrackingScalarFieldEnum[]
  }

  /**
   * EventTracking findMany
   */
  export type EventTrackingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventTracking
     */
    select?: EventTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventTracking
     */
    omit?: EventTrackingOmit<ExtArgs> | null
    /**
     * Filter, which EventTrackings to fetch.
     */
    where?: EventTrackingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventTrackings to fetch.
     */
    orderBy?: EventTrackingOrderByWithRelationInput | EventTrackingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EventTrackings.
     */
    cursor?: EventTrackingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventTrackings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventTrackings.
     */
    skip?: number
    distinct?: EventTrackingScalarFieldEnum | EventTrackingScalarFieldEnum[]
  }

  /**
   * EventTracking create
   */
  export type EventTrackingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventTracking
     */
    select?: EventTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventTracking
     */
    omit?: EventTrackingOmit<ExtArgs> | null
    /**
     * The data needed to create a EventTracking.
     */
    data: XOR<EventTrackingCreateInput, EventTrackingUncheckedCreateInput>
  }

  /**
   * EventTracking createMany
   */
  export type EventTrackingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EventTrackings.
     */
    data: EventTrackingCreateManyInput | EventTrackingCreateManyInput[]
  }

  /**
   * EventTracking createManyAndReturn
   */
  export type EventTrackingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventTracking
     */
    select?: EventTrackingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EventTracking
     */
    omit?: EventTrackingOmit<ExtArgs> | null
    /**
     * The data used to create many EventTrackings.
     */
    data: EventTrackingCreateManyInput | EventTrackingCreateManyInput[]
  }

  /**
   * EventTracking update
   */
  export type EventTrackingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventTracking
     */
    select?: EventTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventTracking
     */
    omit?: EventTrackingOmit<ExtArgs> | null
    /**
     * The data needed to update a EventTracking.
     */
    data: XOR<EventTrackingUpdateInput, EventTrackingUncheckedUpdateInput>
    /**
     * Choose, which EventTracking to update.
     */
    where: EventTrackingWhereUniqueInput
  }

  /**
   * EventTracking updateMany
   */
  export type EventTrackingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EventTrackings.
     */
    data: XOR<EventTrackingUpdateManyMutationInput, EventTrackingUncheckedUpdateManyInput>
    /**
     * Filter which EventTrackings to update
     */
    where?: EventTrackingWhereInput
    /**
     * Limit how many EventTrackings to update.
     */
    limit?: number
  }

  /**
   * EventTracking updateManyAndReturn
   */
  export type EventTrackingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventTracking
     */
    select?: EventTrackingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EventTracking
     */
    omit?: EventTrackingOmit<ExtArgs> | null
    /**
     * The data used to update EventTrackings.
     */
    data: XOR<EventTrackingUpdateManyMutationInput, EventTrackingUncheckedUpdateManyInput>
    /**
     * Filter which EventTrackings to update
     */
    where?: EventTrackingWhereInput
    /**
     * Limit how many EventTrackings to update.
     */
    limit?: number
  }

  /**
   * EventTracking upsert
   */
  export type EventTrackingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventTracking
     */
    select?: EventTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventTracking
     */
    omit?: EventTrackingOmit<ExtArgs> | null
    /**
     * The filter to search for the EventTracking to update in case it exists.
     */
    where: EventTrackingWhereUniqueInput
    /**
     * In case the EventTracking found by the `where` argument doesn't exist, create a new EventTracking with this data.
     */
    create: XOR<EventTrackingCreateInput, EventTrackingUncheckedCreateInput>
    /**
     * In case the EventTracking was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventTrackingUpdateInput, EventTrackingUncheckedUpdateInput>
  }

  /**
   * EventTracking delete
   */
  export type EventTrackingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventTracking
     */
    select?: EventTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventTracking
     */
    omit?: EventTrackingOmit<ExtArgs> | null
    /**
     * Filter which EventTracking to delete.
     */
    where: EventTrackingWhereUniqueInput
  }

  /**
   * EventTracking deleteMany
   */
  export type EventTrackingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventTrackings to delete
     */
    where?: EventTrackingWhereInput
    /**
     * Limit how many EventTrackings to delete.
     */
    limit?: number
  }

  /**
   * EventTracking without action
   */
  export type EventTrackingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventTracking
     */
    select?: EventTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventTracking
     */
    omit?: EventTrackingOmit<ExtArgs> | null
  }


  /**
   * Model SpikeyAmmSwap
   */

  export type AggregateSpikeyAmmSwap = {
    _count: SpikeyAmmSwapCountAggregateOutputType | null
    _avg: SpikeyAmmSwapAvgAggregateOutputType | null
    _sum: SpikeyAmmSwapSumAggregateOutputType | null
    _min: SpikeyAmmSwapMinAggregateOutputType | null
    _max: SpikeyAmmSwapMaxAggregateOutputType | null
  }

  export type SpikeyAmmSwapAvgAggregateOutputType = {
    id: number | null
    eventIndex: number | null
    blockNumber: number | null
    amount0In: number | null
    amount1In: number | null
    amount0Out: number | null
    amount1Out: number | null
    pairId: number | null
  }

  export type SpikeyAmmSwapSumAggregateOutputType = {
    id: number | null
    eventIndex: number | null
    blockNumber: bigint | null
    amount0In: bigint | null
    amount1In: bigint | null
    amount0Out: bigint | null
    amount1Out: bigint | null
    pairId: number | null
  }

  export type SpikeyAmmSwapMinAggregateOutputType = {
    id: number | null
    network: string | null
    transactionHash: string | null
    eventIndex: number | null
    blockNumber: bigint | null
    blockTimestamp: Date | null
    sender: string | null
    to: string | null
    amount0In: bigint | null
    amount1In: bigint | null
    amount0Out: bigint | null
    amount1Out: bigint | null
    processedAt: Date | null
    pairId: number | null
  }

  export type SpikeyAmmSwapMaxAggregateOutputType = {
    id: number | null
    network: string | null
    transactionHash: string | null
    eventIndex: number | null
    blockNumber: bigint | null
    blockTimestamp: Date | null
    sender: string | null
    to: string | null
    amount0In: bigint | null
    amount1In: bigint | null
    amount0Out: bigint | null
    amount1Out: bigint | null
    processedAt: Date | null
    pairId: number | null
  }

  export type SpikeyAmmSwapCountAggregateOutputType = {
    id: number
    network: number
    transactionHash: number
    eventIndex: number
    blockNumber: number
    blockTimestamp: number
    sender: number
    to: number
    amount0In: number
    amount1In: number
    amount0Out: number
    amount1Out: number
    processedAt: number
    pairId: number
    _all: number
  }


  export type SpikeyAmmSwapAvgAggregateInputType = {
    id?: true
    eventIndex?: true
    blockNumber?: true
    amount0In?: true
    amount1In?: true
    amount0Out?: true
    amount1Out?: true
    pairId?: true
  }

  export type SpikeyAmmSwapSumAggregateInputType = {
    id?: true
    eventIndex?: true
    blockNumber?: true
    amount0In?: true
    amount1In?: true
    amount0Out?: true
    amount1Out?: true
    pairId?: true
  }

  export type SpikeyAmmSwapMinAggregateInputType = {
    id?: true
    network?: true
    transactionHash?: true
    eventIndex?: true
    blockNumber?: true
    blockTimestamp?: true
    sender?: true
    to?: true
    amount0In?: true
    amount1In?: true
    amount0Out?: true
    amount1Out?: true
    processedAt?: true
    pairId?: true
  }

  export type SpikeyAmmSwapMaxAggregateInputType = {
    id?: true
    network?: true
    transactionHash?: true
    eventIndex?: true
    blockNumber?: true
    blockTimestamp?: true
    sender?: true
    to?: true
    amount0In?: true
    amount1In?: true
    amount0Out?: true
    amount1Out?: true
    processedAt?: true
    pairId?: true
  }

  export type SpikeyAmmSwapCountAggregateInputType = {
    id?: true
    network?: true
    transactionHash?: true
    eventIndex?: true
    blockNumber?: true
    blockTimestamp?: true
    sender?: true
    to?: true
    amount0In?: true
    amount1In?: true
    amount0Out?: true
    amount1Out?: true
    processedAt?: true
    pairId?: true
    _all?: true
  }

  export type SpikeyAmmSwapAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SpikeyAmmSwap to aggregate.
     */
    where?: SpikeyAmmSwapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpikeyAmmSwaps to fetch.
     */
    orderBy?: SpikeyAmmSwapOrderByWithRelationInput | SpikeyAmmSwapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SpikeyAmmSwapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpikeyAmmSwaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpikeyAmmSwaps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SpikeyAmmSwaps
    **/
    _count?: true | SpikeyAmmSwapCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SpikeyAmmSwapAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SpikeyAmmSwapSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SpikeyAmmSwapMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SpikeyAmmSwapMaxAggregateInputType
  }

  export type GetSpikeyAmmSwapAggregateType<T extends SpikeyAmmSwapAggregateArgs> = {
        [P in keyof T & keyof AggregateSpikeyAmmSwap]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSpikeyAmmSwap[P]>
      : GetScalarType<T[P], AggregateSpikeyAmmSwap[P]>
  }




  export type SpikeyAmmSwapGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpikeyAmmSwapWhereInput
    orderBy?: SpikeyAmmSwapOrderByWithAggregationInput | SpikeyAmmSwapOrderByWithAggregationInput[]
    by: SpikeyAmmSwapScalarFieldEnum[] | SpikeyAmmSwapScalarFieldEnum
    having?: SpikeyAmmSwapScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SpikeyAmmSwapCountAggregateInputType | true
    _avg?: SpikeyAmmSwapAvgAggregateInputType
    _sum?: SpikeyAmmSwapSumAggregateInputType
    _min?: SpikeyAmmSwapMinAggregateInputType
    _max?: SpikeyAmmSwapMaxAggregateInputType
  }

  export type SpikeyAmmSwapGroupByOutputType = {
    id: number
    network: string
    transactionHash: string
    eventIndex: number
    blockNumber: bigint
    blockTimestamp: Date
    sender: string
    to: string
    amount0In: bigint
    amount1In: bigint
    amount0Out: bigint
    amount1Out: bigint
    processedAt: Date
    pairId: number
    _count: SpikeyAmmSwapCountAggregateOutputType | null
    _avg: SpikeyAmmSwapAvgAggregateOutputType | null
    _sum: SpikeyAmmSwapSumAggregateOutputType | null
    _min: SpikeyAmmSwapMinAggregateOutputType | null
    _max: SpikeyAmmSwapMaxAggregateOutputType | null
  }

  type GetSpikeyAmmSwapGroupByPayload<T extends SpikeyAmmSwapGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SpikeyAmmSwapGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SpikeyAmmSwapGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SpikeyAmmSwapGroupByOutputType[P]>
            : GetScalarType<T[P], SpikeyAmmSwapGroupByOutputType[P]>
        }
      >
    >


  export type SpikeyAmmSwapSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    network?: boolean
    transactionHash?: boolean
    eventIndex?: boolean
    blockNumber?: boolean
    blockTimestamp?: boolean
    sender?: boolean
    to?: boolean
    amount0In?: boolean
    amount1In?: boolean
    amount0Out?: boolean
    amount1Out?: boolean
    processedAt?: boolean
    pairId?: boolean
    pair?: boolean | PairDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["spikeyAmmSwap"]>

  export type SpikeyAmmSwapSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    network?: boolean
    transactionHash?: boolean
    eventIndex?: boolean
    blockNumber?: boolean
    blockTimestamp?: boolean
    sender?: boolean
    to?: boolean
    amount0In?: boolean
    amount1In?: boolean
    amount0Out?: boolean
    amount1Out?: boolean
    processedAt?: boolean
    pairId?: boolean
    pair?: boolean | PairDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["spikeyAmmSwap"]>

  export type SpikeyAmmSwapSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    network?: boolean
    transactionHash?: boolean
    eventIndex?: boolean
    blockNumber?: boolean
    blockTimestamp?: boolean
    sender?: boolean
    to?: boolean
    amount0In?: boolean
    amount1In?: boolean
    amount0Out?: boolean
    amount1Out?: boolean
    processedAt?: boolean
    pairId?: boolean
    pair?: boolean | PairDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["spikeyAmmSwap"]>

  export type SpikeyAmmSwapSelectScalar = {
    id?: boolean
    network?: boolean
    transactionHash?: boolean
    eventIndex?: boolean
    blockNumber?: boolean
    blockTimestamp?: boolean
    sender?: boolean
    to?: boolean
    amount0In?: boolean
    amount1In?: boolean
    amount0Out?: boolean
    amount1Out?: boolean
    processedAt?: boolean
    pairId?: boolean
  }

  export type SpikeyAmmSwapOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "network" | "transactionHash" | "eventIndex" | "blockNumber" | "blockTimestamp" | "sender" | "to" | "amount0In" | "amount1In" | "amount0Out" | "amount1Out" | "processedAt" | "pairId", ExtArgs["result"]["spikeyAmmSwap"]>
  export type SpikeyAmmSwapInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pair?: boolean | PairDefaultArgs<ExtArgs>
  }
  export type SpikeyAmmSwapIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pair?: boolean | PairDefaultArgs<ExtArgs>
  }
  export type SpikeyAmmSwapIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pair?: boolean | PairDefaultArgs<ExtArgs>
  }

  export type $SpikeyAmmSwapPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SpikeyAmmSwap"
    objects: {
      pair: Prisma.$PairPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      network: string
      transactionHash: string
      eventIndex: number
      blockNumber: bigint
      blockTimestamp: Date
      sender: string
      to: string
      amount0In: bigint
      amount1In: bigint
      amount0Out: bigint
      amount1Out: bigint
      processedAt: Date
      pairId: number
    }, ExtArgs["result"]["spikeyAmmSwap"]>
    composites: {}
  }

  type SpikeyAmmSwapGetPayload<S extends boolean | null | undefined | SpikeyAmmSwapDefaultArgs> = $Result.GetResult<Prisma.$SpikeyAmmSwapPayload, S>

  type SpikeyAmmSwapCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SpikeyAmmSwapFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SpikeyAmmSwapCountAggregateInputType | true
    }

  export interface SpikeyAmmSwapDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SpikeyAmmSwap'], meta: { name: 'SpikeyAmmSwap' } }
    /**
     * Find zero or one SpikeyAmmSwap that matches the filter.
     * @param {SpikeyAmmSwapFindUniqueArgs} args - Arguments to find a SpikeyAmmSwap
     * @example
     * // Get one SpikeyAmmSwap
     * const spikeyAmmSwap = await prisma.spikeyAmmSwap.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SpikeyAmmSwapFindUniqueArgs>(args: SelectSubset<T, SpikeyAmmSwapFindUniqueArgs<ExtArgs>>): Prisma__SpikeyAmmSwapClient<$Result.GetResult<Prisma.$SpikeyAmmSwapPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SpikeyAmmSwap that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SpikeyAmmSwapFindUniqueOrThrowArgs} args - Arguments to find a SpikeyAmmSwap
     * @example
     * // Get one SpikeyAmmSwap
     * const spikeyAmmSwap = await prisma.spikeyAmmSwap.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SpikeyAmmSwapFindUniqueOrThrowArgs>(args: SelectSubset<T, SpikeyAmmSwapFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SpikeyAmmSwapClient<$Result.GetResult<Prisma.$SpikeyAmmSwapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SpikeyAmmSwap that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpikeyAmmSwapFindFirstArgs} args - Arguments to find a SpikeyAmmSwap
     * @example
     * // Get one SpikeyAmmSwap
     * const spikeyAmmSwap = await prisma.spikeyAmmSwap.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SpikeyAmmSwapFindFirstArgs>(args?: SelectSubset<T, SpikeyAmmSwapFindFirstArgs<ExtArgs>>): Prisma__SpikeyAmmSwapClient<$Result.GetResult<Prisma.$SpikeyAmmSwapPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SpikeyAmmSwap that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpikeyAmmSwapFindFirstOrThrowArgs} args - Arguments to find a SpikeyAmmSwap
     * @example
     * // Get one SpikeyAmmSwap
     * const spikeyAmmSwap = await prisma.spikeyAmmSwap.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SpikeyAmmSwapFindFirstOrThrowArgs>(args?: SelectSubset<T, SpikeyAmmSwapFindFirstOrThrowArgs<ExtArgs>>): Prisma__SpikeyAmmSwapClient<$Result.GetResult<Prisma.$SpikeyAmmSwapPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SpikeyAmmSwaps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpikeyAmmSwapFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SpikeyAmmSwaps
     * const spikeyAmmSwaps = await prisma.spikeyAmmSwap.findMany()
     * 
     * // Get first 10 SpikeyAmmSwaps
     * const spikeyAmmSwaps = await prisma.spikeyAmmSwap.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const spikeyAmmSwapWithIdOnly = await prisma.spikeyAmmSwap.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SpikeyAmmSwapFindManyArgs>(args?: SelectSubset<T, SpikeyAmmSwapFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpikeyAmmSwapPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SpikeyAmmSwap.
     * @param {SpikeyAmmSwapCreateArgs} args - Arguments to create a SpikeyAmmSwap.
     * @example
     * // Create one SpikeyAmmSwap
     * const SpikeyAmmSwap = await prisma.spikeyAmmSwap.create({
     *   data: {
     *     // ... data to create a SpikeyAmmSwap
     *   }
     * })
     * 
     */
    create<T extends SpikeyAmmSwapCreateArgs>(args: SelectSubset<T, SpikeyAmmSwapCreateArgs<ExtArgs>>): Prisma__SpikeyAmmSwapClient<$Result.GetResult<Prisma.$SpikeyAmmSwapPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SpikeyAmmSwaps.
     * @param {SpikeyAmmSwapCreateManyArgs} args - Arguments to create many SpikeyAmmSwaps.
     * @example
     * // Create many SpikeyAmmSwaps
     * const spikeyAmmSwap = await prisma.spikeyAmmSwap.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SpikeyAmmSwapCreateManyArgs>(args?: SelectSubset<T, SpikeyAmmSwapCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SpikeyAmmSwaps and returns the data saved in the database.
     * @param {SpikeyAmmSwapCreateManyAndReturnArgs} args - Arguments to create many SpikeyAmmSwaps.
     * @example
     * // Create many SpikeyAmmSwaps
     * const spikeyAmmSwap = await prisma.spikeyAmmSwap.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SpikeyAmmSwaps and only return the `id`
     * const spikeyAmmSwapWithIdOnly = await prisma.spikeyAmmSwap.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SpikeyAmmSwapCreateManyAndReturnArgs>(args?: SelectSubset<T, SpikeyAmmSwapCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpikeyAmmSwapPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SpikeyAmmSwap.
     * @param {SpikeyAmmSwapDeleteArgs} args - Arguments to delete one SpikeyAmmSwap.
     * @example
     * // Delete one SpikeyAmmSwap
     * const SpikeyAmmSwap = await prisma.spikeyAmmSwap.delete({
     *   where: {
     *     // ... filter to delete one SpikeyAmmSwap
     *   }
     * })
     * 
     */
    delete<T extends SpikeyAmmSwapDeleteArgs>(args: SelectSubset<T, SpikeyAmmSwapDeleteArgs<ExtArgs>>): Prisma__SpikeyAmmSwapClient<$Result.GetResult<Prisma.$SpikeyAmmSwapPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SpikeyAmmSwap.
     * @param {SpikeyAmmSwapUpdateArgs} args - Arguments to update one SpikeyAmmSwap.
     * @example
     * // Update one SpikeyAmmSwap
     * const spikeyAmmSwap = await prisma.spikeyAmmSwap.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SpikeyAmmSwapUpdateArgs>(args: SelectSubset<T, SpikeyAmmSwapUpdateArgs<ExtArgs>>): Prisma__SpikeyAmmSwapClient<$Result.GetResult<Prisma.$SpikeyAmmSwapPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SpikeyAmmSwaps.
     * @param {SpikeyAmmSwapDeleteManyArgs} args - Arguments to filter SpikeyAmmSwaps to delete.
     * @example
     * // Delete a few SpikeyAmmSwaps
     * const { count } = await prisma.spikeyAmmSwap.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SpikeyAmmSwapDeleteManyArgs>(args?: SelectSubset<T, SpikeyAmmSwapDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SpikeyAmmSwaps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpikeyAmmSwapUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SpikeyAmmSwaps
     * const spikeyAmmSwap = await prisma.spikeyAmmSwap.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SpikeyAmmSwapUpdateManyArgs>(args: SelectSubset<T, SpikeyAmmSwapUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SpikeyAmmSwaps and returns the data updated in the database.
     * @param {SpikeyAmmSwapUpdateManyAndReturnArgs} args - Arguments to update many SpikeyAmmSwaps.
     * @example
     * // Update many SpikeyAmmSwaps
     * const spikeyAmmSwap = await prisma.spikeyAmmSwap.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SpikeyAmmSwaps and only return the `id`
     * const spikeyAmmSwapWithIdOnly = await prisma.spikeyAmmSwap.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SpikeyAmmSwapUpdateManyAndReturnArgs>(args: SelectSubset<T, SpikeyAmmSwapUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpikeyAmmSwapPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SpikeyAmmSwap.
     * @param {SpikeyAmmSwapUpsertArgs} args - Arguments to update or create a SpikeyAmmSwap.
     * @example
     * // Update or create a SpikeyAmmSwap
     * const spikeyAmmSwap = await prisma.spikeyAmmSwap.upsert({
     *   create: {
     *     // ... data to create a SpikeyAmmSwap
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SpikeyAmmSwap we want to update
     *   }
     * })
     */
    upsert<T extends SpikeyAmmSwapUpsertArgs>(args: SelectSubset<T, SpikeyAmmSwapUpsertArgs<ExtArgs>>): Prisma__SpikeyAmmSwapClient<$Result.GetResult<Prisma.$SpikeyAmmSwapPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SpikeyAmmSwaps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpikeyAmmSwapCountArgs} args - Arguments to filter SpikeyAmmSwaps to count.
     * @example
     * // Count the number of SpikeyAmmSwaps
     * const count = await prisma.spikeyAmmSwap.count({
     *   where: {
     *     // ... the filter for the SpikeyAmmSwaps we want to count
     *   }
     * })
    **/
    count<T extends SpikeyAmmSwapCountArgs>(
      args?: Subset<T, SpikeyAmmSwapCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SpikeyAmmSwapCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SpikeyAmmSwap.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpikeyAmmSwapAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SpikeyAmmSwapAggregateArgs>(args: Subset<T, SpikeyAmmSwapAggregateArgs>): Prisma.PrismaPromise<GetSpikeyAmmSwapAggregateType<T>>

    /**
     * Group by SpikeyAmmSwap.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpikeyAmmSwapGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SpikeyAmmSwapGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SpikeyAmmSwapGroupByArgs['orderBy'] }
        : { orderBy?: SpikeyAmmSwapGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SpikeyAmmSwapGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSpikeyAmmSwapGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SpikeyAmmSwap model
   */
  readonly fields: SpikeyAmmSwapFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SpikeyAmmSwap.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SpikeyAmmSwapClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pair<T extends PairDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PairDefaultArgs<ExtArgs>>): Prisma__PairClient<$Result.GetResult<Prisma.$PairPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SpikeyAmmSwap model
   */
  interface SpikeyAmmSwapFieldRefs {
    readonly id: FieldRef<"SpikeyAmmSwap", 'Int'>
    readonly network: FieldRef<"SpikeyAmmSwap", 'String'>
    readonly transactionHash: FieldRef<"SpikeyAmmSwap", 'String'>
    readonly eventIndex: FieldRef<"SpikeyAmmSwap", 'Int'>
    readonly blockNumber: FieldRef<"SpikeyAmmSwap", 'BigInt'>
    readonly blockTimestamp: FieldRef<"SpikeyAmmSwap", 'DateTime'>
    readonly sender: FieldRef<"SpikeyAmmSwap", 'String'>
    readonly to: FieldRef<"SpikeyAmmSwap", 'String'>
    readonly amount0In: FieldRef<"SpikeyAmmSwap", 'BigInt'>
    readonly amount1In: FieldRef<"SpikeyAmmSwap", 'BigInt'>
    readonly amount0Out: FieldRef<"SpikeyAmmSwap", 'BigInt'>
    readonly amount1Out: FieldRef<"SpikeyAmmSwap", 'BigInt'>
    readonly processedAt: FieldRef<"SpikeyAmmSwap", 'DateTime'>
    readonly pairId: FieldRef<"SpikeyAmmSwap", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * SpikeyAmmSwap findUnique
   */
  export type SpikeyAmmSwapFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpikeyAmmSwap
     */
    select?: SpikeyAmmSwapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpikeyAmmSwap
     */
    omit?: SpikeyAmmSwapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpikeyAmmSwapInclude<ExtArgs> | null
    /**
     * Filter, which SpikeyAmmSwap to fetch.
     */
    where: SpikeyAmmSwapWhereUniqueInput
  }

  /**
   * SpikeyAmmSwap findUniqueOrThrow
   */
  export type SpikeyAmmSwapFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpikeyAmmSwap
     */
    select?: SpikeyAmmSwapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpikeyAmmSwap
     */
    omit?: SpikeyAmmSwapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpikeyAmmSwapInclude<ExtArgs> | null
    /**
     * Filter, which SpikeyAmmSwap to fetch.
     */
    where: SpikeyAmmSwapWhereUniqueInput
  }

  /**
   * SpikeyAmmSwap findFirst
   */
  export type SpikeyAmmSwapFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpikeyAmmSwap
     */
    select?: SpikeyAmmSwapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpikeyAmmSwap
     */
    omit?: SpikeyAmmSwapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpikeyAmmSwapInclude<ExtArgs> | null
    /**
     * Filter, which SpikeyAmmSwap to fetch.
     */
    where?: SpikeyAmmSwapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpikeyAmmSwaps to fetch.
     */
    orderBy?: SpikeyAmmSwapOrderByWithRelationInput | SpikeyAmmSwapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SpikeyAmmSwaps.
     */
    cursor?: SpikeyAmmSwapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpikeyAmmSwaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpikeyAmmSwaps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SpikeyAmmSwaps.
     */
    distinct?: SpikeyAmmSwapScalarFieldEnum | SpikeyAmmSwapScalarFieldEnum[]
  }

  /**
   * SpikeyAmmSwap findFirstOrThrow
   */
  export type SpikeyAmmSwapFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpikeyAmmSwap
     */
    select?: SpikeyAmmSwapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpikeyAmmSwap
     */
    omit?: SpikeyAmmSwapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpikeyAmmSwapInclude<ExtArgs> | null
    /**
     * Filter, which SpikeyAmmSwap to fetch.
     */
    where?: SpikeyAmmSwapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpikeyAmmSwaps to fetch.
     */
    orderBy?: SpikeyAmmSwapOrderByWithRelationInput | SpikeyAmmSwapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SpikeyAmmSwaps.
     */
    cursor?: SpikeyAmmSwapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpikeyAmmSwaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpikeyAmmSwaps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SpikeyAmmSwaps.
     */
    distinct?: SpikeyAmmSwapScalarFieldEnum | SpikeyAmmSwapScalarFieldEnum[]
  }

  /**
   * SpikeyAmmSwap findMany
   */
  export type SpikeyAmmSwapFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpikeyAmmSwap
     */
    select?: SpikeyAmmSwapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpikeyAmmSwap
     */
    omit?: SpikeyAmmSwapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpikeyAmmSwapInclude<ExtArgs> | null
    /**
     * Filter, which SpikeyAmmSwaps to fetch.
     */
    where?: SpikeyAmmSwapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpikeyAmmSwaps to fetch.
     */
    orderBy?: SpikeyAmmSwapOrderByWithRelationInput | SpikeyAmmSwapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SpikeyAmmSwaps.
     */
    cursor?: SpikeyAmmSwapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpikeyAmmSwaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpikeyAmmSwaps.
     */
    skip?: number
    distinct?: SpikeyAmmSwapScalarFieldEnum | SpikeyAmmSwapScalarFieldEnum[]
  }

  /**
   * SpikeyAmmSwap create
   */
  export type SpikeyAmmSwapCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpikeyAmmSwap
     */
    select?: SpikeyAmmSwapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpikeyAmmSwap
     */
    omit?: SpikeyAmmSwapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpikeyAmmSwapInclude<ExtArgs> | null
    /**
     * The data needed to create a SpikeyAmmSwap.
     */
    data: XOR<SpikeyAmmSwapCreateInput, SpikeyAmmSwapUncheckedCreateInput>
  }

  /**
   * SpikeyAmmSwap createMany
   */
  export type SpikeyAmmSwapCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SpikeyAmmSwaps.
     */
    data: SpikeyAmmSwapCreateManyInput | SpikeyAmmSwapCreateManyInput[]
  }

  /**
   * SpikeyAmmSwap createManyAndReturn
   */
  export type SpikeyAmmSwapCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpikeyAmmSwap
     */
    select?: SpikeyAmmSwapSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SpikeyAmmSwap
     */
    omit?: SpikeyAmmSwapOmit<ExtArgs> | null
    /**
     * The data used to create many SpikeyAmmSwaps.
     */
    data: SpikeyAmmSwapCreateManyInput | SpikeyAmmSwapCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpikeyAmmSwapIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SpikeyAmmSwap update
   */
  export type SpikeyAmmSwapUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpikeyAmmSwap
     */
    select?: SpikeyAmmSwapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpikeyAmmSwap
     */
    omit?: SpikeyAmmSwapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpikeyAmmSwapInclude<ExtArgs> | null
    /**
     * The data needed to update a SpikeyAmmSwap.
     */
    data: XOR<SpikeyAmmSwapUpdateInput, SpikeyAmmSwapUncheckedUpdateInput>
    /**
     * Choose, which SpikeyAmmSwap to update.
     */
    where: SpikeyAmmSwapWhereUniqueInput
  }

  /**
   * SpikeyAmmSwap updateMany
   */
  export type SpikeyAmmSwapUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SpikeyAmmSwaps.
     */
    data: XOR<SpikeyAmmSwapUpdateManyMutationInput, SpikeyAmmSwapUncheckedUpdateManyInput>
    /**
     * Filter which SpikeyAmmSwaps to update
     */
    where?: SpikeyAmmSwapWhereInput
    /**
     * Limit how many SpikeyAmmSwaps to update.
     */
    limit?: number
  }

  /**
   * SpikeyAmmSwap updateManyAndReturn
   */
  export type SpikeyAmmSwapUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpikeyAmmSwap
     */
    select?: SpikeyAmmSwapSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SpikeyAmmSwap
     */
    omit?: SpikeyAmmSwapOmit<ExtArgs> | null
    /**
     * The data used to update SpikeyAmmSwaps.
     */
    data: XOR<SpikeyAmmSwapUpdateManyMutationInput, SpikeyAmmSwapUncheckedUpdateManyInput>
    /**
     * Filter which SpikeyAmmSwaps to update
     */
    where?: SpikeyAmmSwapWhereInput
    /**
     * Limit how many SpikeyAmmSwaps to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpikeyAmmSwapIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SpikeyAmmSwap upsert
   */
  export type SpikeyAmmSwapUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpikeyAmmSwap
     */
    select?: SpikeyAmmSwapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpikeyAmmSwap
     */
    omit?: SpikeyAmmSwapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpikeyAmmSwapInclude<ExtArgs> | null
    /**
     * The filter to search for the SpikeyAmmSwap to update in case it exists.
     */
    where: SpikeyAmmSwapWhereUniqueInput
    /**
     * In case the SpikeyAmmSwap found by the `where` argument doesn't exist, create a new SpikeyAmmSwap with this data.
     */
    create: XOR<SpikeyAmmSwapCreateInput, SpikeyAmmSwapUncheckedCreateInput>
    /**
     * In case the SpikeyAmmSwap was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SpikeyAmmSwapUpdateInput, SpikeyAmmSwapUncheckedUpdateInput>
  }

  /**
   * SpikeyAmmSwap delete
   */
  export type SpikeyAmmSwapDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpikeyAmmSwap
     */
    select?: SpikeyAmmSwapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpikeyAmmSwap
     */
    omit?: SpikeyAmmSwapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpikeyAmmSwapInclude<ExtArgs> | null
    /**
     * Filter which SpikeyAmmSwap to delete.
     */
    where: SpikeyAmmSwapWhereUniqueInput
  }

  /**
   * SpikeyAmmSwap deleteMany
   */
  export type SpikeyAmmSwapDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SpikeyAmmSwaps to delete
     */
    where?: SpikeyAmmSwapWhereInput
    /**
     * Limit how many SpikeyAmmSwaps to delete.
     */
    limit?: number
  }

  /**
   * SpikeyAmmSwap without action
   */
  export type SpikeyAmmSwapDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpikeyAmmSwap
     */
    select?: SpikeyAmmSwapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpikeyAmmSwap
     */
    omit?: SpikeyAmmSwapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpikeyAmmSwapInclude<ExtArgs> | null
  }


  /**
   * Model DexlynSwap
   */

  export type AggregateDexlynSwap = {
    _count: DexlynSwapCountAggregateOutputType | null
    _avg: DexlynSwapAvgAggregateOutputType | null
    _sum: DexlynSwapSumAggregateOutputType | null
    _min: DexlynSwapMinAggregateOutputType | null
    _max: DexlynSwapMaxAggregateOutputType | null
  }

  export type DexlynSwapAvgAggregateOutputType = {
    id: number | null
    blockNumber: number | null
    xIn: number | null
    xOut: number | null
    yIn: number | null
    yOut: number | null
    timestamp: number | null
    reserveX: number | null
    reserveY: number | null
    pairId: number | null
  }

  export type DexlynSwapSumAggregateOutputType = {
    id: number | null
    blockNumber: bigint | null
    xIn: bigint | null
    xOut: bigint | null
    yIn: bigint | null
    yOut: bigint | null
    timestamp: bigint | null
    reserveX: bigint | null
    reserveY: bigint | null
    pairId: number | null
  }

  export type DexlynSwapMinAggregateOutputType = {
    id: number | null
    network: string | null
    transactionHash: string | null
    sequenceNumber: string | null
    blockNumber: bigint | null
    blockTimestamp: Date | null
    curve: string | null
    xIn: bigint | null
    xOut: bigint | null
    yIn: bigint | null
    yOut: bigint | null
    timestamp: bigint | null
    reserveX: bigint | null
    reserveY: bigint | null
    processedAt: Date | null
    pairId: number | null
  }

  export type DexlynSwapMaxAggregateOutputType = {
    id: number | null
    network: string | null
    transactionHash: string | null
    sequenceNumber: string | null
    blockNumber: bigint | null
    blockTimestamp: Date | null
    curve: string | null
    xIn: bigint | null
    xOut: bigint | null
    yIn: bigint | null
    yOut: bigint | null
    timestamp: bigint | null
    reserveX: bigint | null
    reserveY: bigint | null
    processedAt: Date | null
    pairId: number | null
  }

  export type DexlynSwapCountAggregateOutputType = {
    id: number
    network: number
    transactionHash: number
    sequenceNumber: number
    blockNumber: number
    blockTimestamp: number
    curve: number
    xIn: number
    xOut: number
    yIn: number
    yOut: number
    timestamp: number
    reserveX: number
    reserveY: number
    processedAt: number
    pairId: number
    _all: number
  }


  export type DexlynSwapAvgAggregateInputType = {
    id?: true
    blockNumber?: true
    xIn?: true
    xOut?: true
    yIn?: true
    yOut?: true
    timestamp?: true
    reserveX?: true
    reserveY?: true
    pairId?: true
  }

  export type DexlynSwapSumAggregateInputType = {
    id?: true
    blockNumber?: true
    xIn?: true
    xOut?: true
    yIn?: true
    yOut?: true
    timestamp?: true
    reserveX?: true
    reserveY?: true
    pairId?: true
  }

  export type DexlynSwapMinAggregateInputType = {
    id?: true
    network?: true
    transactionHash?: true
    sequenceNumber?: true
    blockNumber?: true
    blockTimestamp?: true
    curve?: true
    xIn?: true
    xOut?: true
    yIn?: true
    yOut?: true
    timestamp?: true
    reserveX?: true
    reserveY?: true
    processedAt?: true
    pairId?: true
  }

  export type DexlynSwapMaxAggregateInputType = {
    id?: true
    network?: true
    transactionHash?: true
    sequenceNumber?: true
    blockNumber?: true
    blockTimestamp?: true
    curve?: true
    xIn?: true
    xOut?: true
    yIn?: true
    yOut?: true
    timestamp?: true
    reserveX?: true
    reserveY?: true
    processedAt?: true
    pairId?: true
  }

  export type DexlynSwapCountAggregateInputType = {
    id?: true
    network?: true
    transactionHash?: true
    sequenceNumber?: true
    blockNumber?: true
    blockTimestamp?: true
    curve?: true
    xIn?: true
    xOut?: true
    yIn?: true
    yOut?: true
    timestamp?: true
    reserveX?: true
    reserveY?: true
    processedAt?: true
    pairId?: true
    _all?: true
  }

  export type DexlynSwapAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DexlynSwap to aggregate.
     */
    where?: DexlynSwapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DexlynSwaps to fetch.
     */
    orderBy?: DexlynSwapOrderByWithRelationInput | DexlynSwapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DexlynSwapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DexlynSwaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DexlynSwaps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DexlynSwaps
    **/
    _count?: true | DexlynSwapCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DexlynSwapAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DexlynSwapSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DexlynSwapMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DexlynSwapMaxAggregateInputType
  }

  export type GetDexlynSwapAggregateType<T extends DexlynSwapAggregateArgs> = {
        [P in keyof T & keyof AggregateDexlynSwap]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDexlynSwap[P]>
      : GetScalarType<T[P], AggregateDexlynSwap[P]>
  }




  export type DexlynSwapGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DexlynSwapWhereInput
    orderBy?: DexlynSwapOrderByWithAggregationInput | DexlynSwapOrderByWithAggregationInput[]
    by: DexlynSwapScalarFieldEnum[] | DexlynSwapScalarFieldEnum
    having?: DexlynSwapScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DexlynSwapCountAggregateInputType | true
    _avg?: DexlynSwapAvgAggregateInputType
    _sum?: DexlynSwapSumAggregateInputType
    _min?: DexlynSwapMinAggregateInputType
    _max?: DexlynSwapMaxAggregateInputType
  }

  export type DexlynSwapGroupByOutputType = {
    id: number
    network: string
    transactionHash: string
    sequenceNumber: string
    blockNumber: bigint
    blockTimestamp: Date
    curve: string
    xIn: bigint
    xOut: bigint
    yIn: bigint
    yOut: bigint
    timestamp: bigint
    reserveX: bigint
    reserveY: bigint
    processedAt: Date
    pairId: number
    _count: DexlynSwapCountAggregateOutputType | null
    _avg: DexlynSwapAvgAggregateOutputType | null
    _sum: DexlynSwapSumAggregateOutputType | null
    _min: DexlynSwapMinAggregateOutputType | null
    _max: DexlynSwapMaxAggregateOutputType | null
  }

  type GetDexlynSwapGroupByPayload<T extends DexlynSwapGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DexlynSwapGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DexlynSwapGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DexlynSwapGroupByOutputType[P]>
            : GetScalarType<T[P], DexlynSwapGroupByOutputType[P]>
        }
      >
    >


  export type DexlynSwapSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    network?: boolean
    transactionHash?: boolean
    sequenceNumber?: boolean
    blockNumber?: boolean
    blockTimestamp?: boolean
    curve?: boolean
    xIn?: boolean
    xOut?: boolean
    yIn?: boolean
    yOut?: boolean
    timestamp?: boolean
    reserveX?: boolean
    reserveY?: boolean
    processedAt?: boolean
    pairId?: boolean
    pair?: boolean | PairDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dexlynSwap"]>

  export type DexlynSwapSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    network?: boolean
    transactionHash?: boolean
    sequenceNumber?: boolean
    blockNumber?: boolean
    blockTimestamp?: boolean
    curve?: boolean
    xIn?: boolean
    xOut?: boolean
    yIn?: boolean
    yOut?: boolean
    timestamp?: boolean
    reserveX?: boolean
    reserveY?: boolean
    processedAt?: boolean
    pairId?: boolean
    pair?: boolean | PairDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dexlynSwap"]>

  export type DexlynSwapSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    network?: boolean
    transactionHash?: boolean
    sequenceNumber?: boolean
    blockNumber?: boolean
    blockTimestamp?: boolean
    curve?: boolean
    xIn?: boolean
    xOut?: boolean
    yIn?: boolean
    yOut?: boolean
    timestamp?: boolean
    reserveX?: boolean
    reserveY?: boolean
    processedAt?: boolean
    pairId?: boolean
    pair?: boolean | PairDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dexlynSwap"]>

  export type DexlynSwapSelectScalar = {
    id?: boolean
    network?: boolean
    transactionHash?: boolean
    sequenceNumber?: boolean
    blockNumber?: boolean
    blockTimestamp?: boolean
    curve?: boolean
    xIn?: boolean
    xOut?: boolean
    yIn?: boolean
    yOut?: boolean
    timestamp?: boolean
    reserveX?: boolean
    reserveY?: boolean
    processedAt?: boolean
    pairId?: boolean
  }

  export type DexlynSwapOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "network" | "transactionHash" | "sequenceNumber" | "blockNumber" | "blockTimestamp" | "curve" | "xIn" | "xOut" | "yIn" | "yOut" | "timestamp" | "reserveX" | "reserveY" | "processedAt" | "pairId", ExtArgs["result"]["dexlynSwap"]>
  export type DexlynSwapInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pair?: boolean | PairDefaultArgs<ExtArgs>
  }
  export type DexlynSwapIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pair?: boolean | PairDefaultArgs<ExtArgs>
  }
  export type DexlynSwapIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pair?: boolean | PairDefaultArgs<ExtArgs>
  }

  export type $DexlynSwapPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DexlynSwap"
    objects: {
      pair: Prisma.$PairPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      network: string
      transactionHash: string
      sequenceNumber: string
      blockNumber: bigint
      blockTimestamp: Date
      curve: string
      xIn: bigint
      xOut: bigint
      yIn: bigint
      yOut: bigint
      timestamp: bigint
      reserveX: bigint
      reserveY: bigint
      processedAt: Date
      pairId: number
    }, ExtArgs["result"]["dexlynSwap"]>
    composites: {}
  }

  type DexlynSwapGetPayload<S extends boolean | null | undefined | DexlynSwapDefaultArgs> = $Result.GetResult<Prisma.$DexlynSwapPayload, S>

  type DexlynSwapCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DexlynSwapFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DexlynSwapCountAggregateInputType | true
    }

  export interface DexlynSwapDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DexlynSwap'], meta: { name: 'DexlynSwap' } }
    /**
     * Find zero or one DexlynSwap that matches the filter.
     * @param {DexlynSwapFindUniqueArgs} args - Arguments to find a DexlynSwap
     * @example
     * // Get one DexlynSwap
     * const dexlynSwap = await prisma.dexlynSwap.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DexlynSwapFindUniqueArgs>(args: SelectSubset<T, DexlynSwapFindUniqueArgs<ExtArgs>>): Prisma__DexlynSwapClient<$Result.GetResult<Prisma.$DexlynSwapPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DexlynSwap that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DexlynSwapFindUniqueOrThrowArgs} args - Arguments to find a DexlynSwap
     * @example
     * // Get one DexlynSwap
     * const dexlynSwap = await prisma.dexlynSwap.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DexlynSwapFindUniqueOrThrowArgs>(args: SelectSubset<T, DexlynSwapFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DexlynSwapClient<$Result.GetResult<Prisma.$DexlynSwapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DexlynSwap that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DexlynSwapFindFirstArgs} args - Arguments to find a DexlynSwap
     * @example
     * // Get one DexlynSwap
     * const dexlynSwap = await prisma.dexlynSwap.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DexlynSwapFindFirstArgs>(args?: SelectSubset<T, DexlynSwapFindFirstArgs<ExtArgs>>): Prisma__DexlynSwapClient<$Result.GetResult<Prisma.$DexlynSwapPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DexlynSwap that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DexlynSwapFindFirstOrThrowArgs} args - Arguments to find a DexlynSwap
     * @example
     * // Get one DexlynSwap
     * const dexlynSwap = await prisma.dexlynSwap.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DexlynSwapFindFirstOrThrowArgs>(args?: SelectSubset<T, DexlynSwapFindFirstOrThrowArgs<ExtArgs>>): Prisma__DexlynSwapClient<$Result.GetResult<Prisma.$DexlynSwapPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DexlynSwaps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DexlynSwapFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DexlynSwaps
     * const dexlynSwaps = await prisma.dexlynSwap.findMany()
     * 
     * // Get first 10 DexlynSwaps
     * const dexlynSwaps = await prisma.dexlynSwap.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dexlynSwapWithIdOnly = await prisma.dexlynSwap.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DexlynSwapFindManyArgs>(args?: SelectSubset<T, DexlynSwapFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DexlynSwapPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DexlynSwap.
     * @param {DexlynSwapCreateArgs} args - Arguments to create a DexlynSwap.
     * @example
     * // Create one DexlynSwap
     * const DexlynSwap = await prisma.dexlynSwap.create({
     *   data: {
     *     // ... data to create a DexlynSwap
     *   }
     * })
     * 
     */
    create<T extends DexlynSwapCreateArgs>(args: SelectSubset<T, DexlynSwapCreateArgs<ExtArgs>>): Prisma__DexlynSwapClient<$Result.GetResult<Prisma.$DexlynSwapPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DexlynSwaps.
     * @param {DexlynSwapCreateManyArgs} args - Arguments to create many DexlynSwaps.
     * @example
     * // Create many DexlynSwaps
     * const dexlynSwap = await prisma.dexlynSwap.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DexlynSwapCreateManyArgs>(args?: SelectSubset<T, DexlynSwapCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DexlynSwaps and returns the data saved in the database.
     * @param {DexlynSwapCreateManyAndReturnArgs} args - Arguments to create many DexlynSwaps.
     * @example
     * // Create many DexlynSwaps
     * const dexlynSwap = await prisma.dexlynSwap.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DexlynSwaps and only return the `id`
     * const dexlynSwapWithIdOnly = await prisma.dexlynSwap.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DexlynSwapCreateManyAndReturnArgs>(args?: SelectSubset<T, DexlynSwapCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DexlynSwapPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DexlynSwap.
     * @param {DexlynSwapDeleteArgs} args - Arguments to delete one DexlynSwap.
     * @example
     * // Delete one DexlynSwap
     * const DexlynSwap = await prisma.dexlynSwap.delete({
     *   where: {
     *     // ... filter to delete one DexlynSwap
     *   }
     * })
     * 
     */
    delete<T extends DexlynSwapDeleteArgs>(args: SelectSubset<T, DexlynSwapDeleteArgs<ExtArgs>>): Prisma__DexlynSwapClient<$Result.GetResult<Prisma.$DexlynSwapPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DexlynSwap.
     * @param {DexlynSwapUpdateArgs} args - Arguments to update one DexlynSwap.
     * @example
     * // Update one DexlynSwap
     * const dexlynSwap = await prisma.dexlynSwap.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DexlynSwapUpdateArgs>(args: SelectSubset<T, DexlynSwapUpdateArgs<ExtArgs>>): Prisma__DexlynSwapClient<$Result.GetResult<Prisma.$DexlynSwapPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DexlynSwaps.
     * @param {DexlynSwapDeleteManyArgs} args - Arguments to filter DexlynSwaps to delete.
     * @example
     * // Delete a few DexlynSwaps
     * const { count } = await prisma.dexlynSwap.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DexlynSwapDeleteManyArgs>(args?: SelectSubset<T, DexlynSwapDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DexlynSwaps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DexlynSwapUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DexlynSwaps
     * const dexlynSwap = await prisma.dexlynSwap.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DexlynSwapUpdateManyArgs>(args: SelectSubset<T, DexlynSwapUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DexlynSwaps and returns the data updated in the database.
     * @param {DexlynSwapUpdateManyAndReturnArgs} args - Arguments to update many DexlynSwaps.
     * @example
     * // Update many DexlynSwaps
     * const dexlynSwap = await prisma.dexlynSwap.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DexlynSwaps and only return the `id`
     * const dexlynSwapWithIdOnly = await prisma.dexlynSwap.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DexlynSwapUpdateManyAndReturnArgs>(args: SelectSubset<T, DexlynSwapUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DexlynSwapPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DexlynSwap.
     * @param {DexlynSwapUpsertArgs} args - Arguments to update or create a DexlynSwap.
     * @example
     * // Update or create a DexlynSwap
     * const dexlynSwap = await prisma.dexlynSwap.upsert({
     *   create: {
     *     // ... data to create a DexlynSwap
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DexlynSwap we want to update
     *   }
     * })
     */
    upsert<T extends DexlynSwapUpsertArgs>(args: SelectSubset<T, DexlynSwapUpsertArgs<ExtArgs>>): Prisma__DexlynSwapClient<$Result.GetResult<Prisma.$DexlynSwapPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DexlynSwaps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DexlynSwapCountArgs} args - Arguments to filter DexlynSwaps to count.
     * @example
     * // Count the number of DexlynSwaps
     * const count = await prisma.dexlynSwap.count({
     *   where: {
     *     // ... the filter for the DexlynSwaps we want to count
     *   }
     * })
    **/
    count<T extends DexlynSwapCountArgs>(
      args?: Subset<T, DexlynSwapCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DexlynSwapCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DexlynSwap.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DexlynSwapAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DexlynSwapAggregateArgs>(args: Subset<T, DexlynSwapAggregateArgs>): Prisma.PrismaPromise<GetDexlynSwapAggregateType<T>>

    /**
     * Group by DexlynSwap.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DexlynSwapGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DexlynSwapGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DexlynSwapGroupByArgs['orderBy'] }
        : { orderBy?: DexlynSwapGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DexlynSwapGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDexlynSwapGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DexlynSwap model
   */
  readonly fields: DexlynSwapFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DexlynSwap.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DexlynSwapClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pair<T extends PairDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PairDefaultArgs<ExtArgs>>): Prisma__PairClient<$Result.GetResult<Prisma.$PairPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DexlynSwap model
   */
  interface DexlynSwapFieldRefs {
    readonly id: FieldRef<"DexlynSwap", 'Int'>
    readonly network: FieldRef<"DexlynSwap", 'String'>
    readonly transactionHash: FieldRef<"DexlynSwap", 'String'>
    readonly sequenceNumber: FieldRef<"DexlynSwap", 'String'>
    readonly blockNumber: FieldRef<"DexlynSwap", 'BigInt'>
    readonly blockTimestamp: FieldRef<"DexlynSwap", 'DateTime'>
    readonly curve: FieldRef<"DexlynSwap", 'String'>
    readonly xIn: FieldRef<"DexlynSwap", 'BigInt'>
    readonly xOut: FieldRef<"DexlynSwap", 'BigInt'>
    readonly yIn: FieldRef<"DexlynSwap", 'BigInt'>
    readonly yOut: FieldRef<"DexlynSwap", 'BigInt'>
    readonly timestamp: FieldRef<"DexlynSwap", 'BigInt'>
    readonly reserveX: FieldRef<"DexlynSwap", 'BigInt'>
    readonly reserveY: FieldRef<"DexlynSwap", 'BigInt'>
    readonly processedAt: FieldRef<"DexlynSwap", 'DateTime'>
    readonly pairId: FieldRef<"DexlynSwap", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * DexlynSwap findUnique
   */
  export type DexlynSwapFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DexlynSwap
     */
    select?: DexlynSwapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DexlynSwap
     */
    omit?: DexlynSwapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DexlynSwapInclude<ExtArgs> | null
    /**
     * Filter, which DexlynSwap to fetch.
     */
    where: DexlynSwapWhereUniqueInput
  }

  /**
   * DexlynSwap findUniqueOrThrow
   */
  export type DexlynSwapFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DexlynSwap
     */
    select?: DexlynSwapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DexlynSwap
     */
    omit?: DexlynSwapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DexlynSwapInclude<ExtArgs> | null
    /**
     * Filter, which DexlynSwap to fetch.
     */
    where: DexlynSwapWhereUniqueInput
  }

  /**
   * DexlynSwap findFirst
   */
  export type DexlynSwapFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DexlynSwap
     */
    select?: DexlynSwapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DexlynSwap
     */
    omit?: DexlynSwapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DexlynSwapInclude<ExtArgs> | null
    /**
     * Filter, which DexlynSwap to fetch.
     */
    where?: DexlynSwapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DexlynSwaps to fetch.
     */
    orderBy?: DexlynSwapOrderByWithRelationInput | DexlynSwapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DexlynSwaps.
     */
    cursor?: DexlynSwapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DexlynSwaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DexlynSwaps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DexlynSwaps.
     */
    distinct?: DexlynSwapScalarFieldEnum | DexlynSwapScalarFieldEnum[]
  }

  /**
   * DexlynSwap findFirstOrThrow
   */
  export type DexlynSwapFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DexlynSwap
     */
    select?: DexlynSwapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DexlynSwap
     */
    omit?: DexlynSwapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DexlynSwapInclude<ExtArgs> | null
    /**
     * Filter, which DexlynSwap to fetch.
     */
    where?: DexlynSwapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DexlynSwaps to fetch.
     */
    orderBy?: DexlynSwapOrderByWithRelationInput | DexlynSwapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DexlynSwaps.
     */
    cursor?: DexlynSwapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DexlynSwaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DexlynSwaps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DexlynSwaps.
     */
    distinct?: DexlynSwapScalarFieldEnum | DexlynSwapScalarFieldEnum[]
  }

  /**
   * DexlynSwap findMany
   */
  export type DexlynSwapFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DexlynSwap
     */
    select?: DexlynSwapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DexlynSwap
     */
    omit?: DexlynSwapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DexlynSwapInclude<ExtArgs> | null
    /**
     * Filter, which DexlynSwaps to fetch.
     */
    where?: DexlynSwapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DexlynSwaps to fetch.
     */
    orderBy?: DexlynSwapOrderByWithRelationInput | DexlynSwapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DexlynSwaps.
     */
    cursor?: DexlynSwapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DexlynSwaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DexlynSwaps.
     */
    skip?: number
    distinct?: DexlynSwapScalarFieldEnum | DexlynSwapScalarFieldEnum[]
  }

  /**
   * DexlynSwap create
   */
  export type DexlynSwapCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DexlynSwap
     */
    select?: DexlynSwapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DexlynSwap
     */
    omit?: DexlynSwapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DexlynSwapInclude<ExtArgs> | null
    /**
     * The data needed to create a DexlynSwap.
     */
    data: XOR<DexlynSwapCreateInput, DexlynSwapUncheckedCreateInput>
  }

  /**
   * DexlynSwap createMany
   */
  export type DexlynSwapCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DexlynSwaps.
     */
    data: DexlynSwapCreateManyInput | DexlynSwapCreateManyInput[]
  }

  /**
   * DexlynSwap createManyAndReturn
   */
  export type DexlynSwapCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DexlynSwap
     */
    select?: DexlynSwapSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DexlynSwap
     */
    omit?: DexlynSwapOmit<ExtArgs> | null
    /**
     * The data used to create many DexlynSwaps.
     */
    data: DexlynSwapCreateManyInput | DexlynSwapCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DexlynSwapIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DexlynSwap update
   */
  export type DexlynSwapUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DexlynSwap
     */
    select?: DexlynSwapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DexlynSwap
     */
    omit?: DexlynSwapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DexlynSwapInclude<ExtArgs> | null
    /**
     * The data needed to update a DexlynSwap.
     */
    data: XOR<DexlynSwapUpdateInput, DexlynSwapUncheckedUpdateInput>
    /**
     * Choose, which DexlynSwap to update.
     */
    where: DexlynSwapWhereUniqueInput
  }

  /**
   * DexlynSwap updateMany
   */
  export type DexlynSwapUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DexlynSwaps.
     */
    data: XOR<DexlynSwapUpdateManyMutationInput, DexlynSwapUncheckedUpdateManyInput>
    /**
     * Filter which DexlynSwaps to update
     */
    where?: DexlynSwapWhereInput
    /**
     * Limit how many DexlynSwaps to update.
     */
    limit?: number
  }

  /**
   * DexlynSwap updateManyAndReturn
   */
  export type DexlynSwapUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DexlynSwap
     */
    select?: DexlynSwapSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DexlynSwap
     */
    omit?: DexlynSwapOmit<ExtArgs> | null
    /**
     * The data used to update DexlynSwaps.
     */
    data: XOR<DexlynSwapUpdateManyMutationInput, DexlynSwapUncheckedUpdateManyInput>
    /**
     * Filter which DexlynSwaps to update
     */
    where?: DexlynSwapWhereInput
    /**
     * Limit how many DexlynSwaps to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DexlynSwapIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DexlynSwap upsert
   */
  export type DexlynSwapUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DexlynSwap
     */
    select?: DexlynSwapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DexlynSwap
     */
    omit?: DexlynSwapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DexlynSwapInclude<ExtArgs> | null
    /**
     * The filter to search for the DexlynSwap to update in case it exists.
     */
    where: DexlynSwapWhereUniqueInput
    /**
     * In case the DexlynSwap found by the `where` argument doesn't exist, create a new DexlynSwap with this data.
     */
    create: XOR<DexlynSwapCreateInput, DexlynSwapUncheckedCreateInput>
    /**
     * In case the DexlynSwap was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DexlynSwapUpdateInput, DexlynSwapUncheckedUpdateInput>
  }

  /**
   * DexlynSwap delete
   */
  export type DexlynSwapDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DexlynSwap
     */
    select?: DexlynSwapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DexlynSwap
     */
    omit?: DexlynSwapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DexlynSwapInclude<ExtArgs> | null
    /**
     * Filter which DexlynSwap to delete.
     */
    where: DexlynSwapWhereUniqueInput
  }

  /**
   * DexlynSwap deleteMany
   */
  export type DexlynSwapDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DexlynSwaps to delete
     */
    where?: DexlynSwapWhereInput
    /**
     * Limit how many DexlynSwaps to delete.
     */
    limit?: number
  }

  /**
   * DexlynSwap without action
   */
  export type DexlynSwapDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DexlynSwap
     */
    select?: DexlynSwapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DexlynSwap
     */
    omit?: DexlynSwapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DexlynSwapInclude<ExtArgs> | null
  }


  /**
   * Model Token
   */

  export type AggregateToken = {
    _count: TokenCountAggregateOutputType | null
    _avg: TokenAvgAggregateOutputType | null
    _sum: TokenSumAggregateOutputType | null
    _min: TokenMinAggregateOutputType | null
    _max: TokenMaxAggregateOutputType | null
  }

  export type TokenAvgAggregateOutputType = {
    id: number | null
    decimals: number | null
  }

  export type TokenSumAggregateOutputType = {
    id: number | null
    decimals: number | null
  }

  export type TokenMinAggregateOutputType = {
    id: number | null
    network: string | null
    address: string | null
    wrappedAddress: string | null
    symbol: string | null
    name: string | null
    decimals: number | null
    createdAt: Date | null
  }

  export type TokenMaxAggregateOutputType = {
    id: number | null
    network: string | null
    address: string | null
    wrappedAddress: string | null
    symbol: string | null
    name: string | null
    decimals: number | null
    createdAt: Date | null
  }

  export type TokenCountAggregateOutputType = {
    id: number
    network: number
    address: number
    wrappedAddress: number
    symbol: number
    name: number
    decimals: number
    createdAt: number
    _all: number
  }


  export type TokenAvgAggregateInputType = {
    id?: true
    decimals?: true
  }

  export type TokenSumAggregateInputType = {
    id?: true
    decimals?: true
  }

  export type TokenMinAggregateInputType = {
    id?: true
    network?: true
    address?: true
    wrappedAddress?: true
    symbol?: true
    name?: true
    decimals?: true
    createdAt?: true
  }

  export type TokenMaxAggregateInputType = {
    id?: true
    network?: true
    address?: true
    wrappedAddress?: true
    symbol?: true
    name?: true
    decimals?: true
    createdAt?: true
  }

  export type TokenCountAggregateInputType = {
    id?: true
    network?: true
    address?: true
    wrappedAddress?: true
    symbol?: true
    name?: true
    decimals?: true
    createdAt?: true
    _all?: true
  }

  export type TokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Token to aggregate.
     */
    where?: TokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tokens to fetch.
     */
    orderBy?: TokenOrderByWithRelationInput | TokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tokens
    **/
    _count?: true | TokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TokenAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TokenSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TokenMaxAggregateInputType
  }

  export type GetTokenAggregateType<T extends TokenAggregateArgs> = {
        [P in keyof T & keyof AggregateToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateToken[P]>
      : GetScalarType<T[P], AggregateToken[P]>
  }




  export type TokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TokenWhereInput
    orderBy?: TokenOrderByWithAggregationInput | TokenOrderByWithAggregationInput[]
    by: TokenScalarFieldEnum[] | TokenScalarFieldEnum
    having?: TokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TokenCountAggregateInputType | true
    _avg?: TokenAvgAggregateInputType
    _sum?: TokenSumAggregateInputType
    _min?: TokenMinAggregateInputType
    _max?: TokenMaxAggregateInputType
  }

  export type TokenGroupByOutputType = {
    id: number
    network: string
    address: string
    wrappedAddress: string | null
    symbol: string
    name: string
    decimals: number
    createdAt: Date
    _count: TokenCountAggregateOutputType | null
    _avg: TokenAvgAggregateOutputType | null
    _sum: TokenSumAggregateOutputType | null
    _min: TokenMinAggregateOutputType | null
    _max: TokenMaxAggregateOutputType | null
  }

  type GetTokenGroupByPayload<T extends TokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TokenGroupByOutputType[P]>
            : GetScalarType<T[P], TokenGroupByOutputType[P]>
        }
      >
    >


  export type TokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    network?: boolean
    address?: boolean
    wrappedAddress?: boolean
    symbol?: boolean
    name?: boolean
    decimals?: boolean
    createdAt?: boolean
    pairsAsToken0?: boolean | Token$pairsAsToken0Args<ExtArgs>
    pairsAsToken1?: boolean | Token$pairsAsToken1Args<ExtArgs>
    _count?: boolean | TokenCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["token"]>

  export type TokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    network?: boolean
    address?: boolean
    wrappedAddress?: boolean
    symbol?: boolean
    name?: boolean
    decimals?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["token"]>

  export type TokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    network?: boolean
    address?: boolean
    wrappedAddress?: boolean
    symbol?: boolean
    name?: boolean
    decimals?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["token"]>

  export type TokenSelectScalar = {
    id?: boolean
    network?: boolean
    address?: boolean
    wrappedAddress?: boolean
    symbol?: boolean
    name?: boolean
    decimals?: boolean
    createdAt?: boolean
  }

  export type TokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "network" | "address" | "wrappedAddress" | "symbol" | "name" | "decimals" | "createdAt", ExtArgs["result"]["token"]>
  export type TokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pairsAsToken0?: boolean | Token$pairsAsToken0Args<ExtArgs>
    pairsAsToken1?: boolean | Token$pairsAsToken1Args<ExtArgs>
    _count?: boolean | TokenCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TokenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TokenIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Token"
    objects: {
      pairsAsToken0: Prisma.$PairPayload<ExtArgs>[]
      pairsAsToken1: Prisma.$PairPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      network: string
      address: string
      wrappedAddress: string | null
      symbol: string
      name: string
      decimals: number
      createdAt: Date
    }, ExtArgs["result"]["token"]>
    composites: {}
  }

  type TokenGetPayload<S extends boolean | null | undefined | TokenDefaultArgs> = $Result.GetResult<Prisma.$TokenPayload, S>

  type TokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TokenCountAggregateInputType | true
    }

  export interface TokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Token'], meta: { name: 'Token' } }
    /**
     * Find zero or one Token that matches the filter.
     * @param {TokenFindUniqueArgs} args - Arguments to find a Token
     * @example
     * // Get one Token
     * const token = await prisma.token.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TokenFindUniqueArgs>(args: SelectSubset<T, TokenFindUniqueArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Token that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TokenFindUniqueOrThrowArgs} args - Arguments to find a Token
     * @example
     * // Get one Token
     * const token = await prisma.token.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TokenFindUniqueOrThrowArgs>(args: SelectSubset<T, TokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Token that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenFindFirstArgs} args - Arguments to find a Token
     * @example
     * // Get one Token
     * const token = await prisma.token.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TokenFindFirstArgs>(args?: SelectSubset<T, TokenFindFirstArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Token that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenFindFirstOrThrowArgs} args - Arguments to find a Token
     * @example
     * // Get one Token
     * const token = await prisma.token.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TokenFindFirstOrThrowArgs>(args?: SelectSubset<T, TokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tokens
     * const tokens = await prisma.token.findMany()
     * 
     * // Get first 10 Tokens
     * const tokens = await prisma.token.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tokenWithIdOnly = await prisma.token.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TokenFindManyArgs>(args?: SelectSubset<T, TokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Token.
     * @param {TokenCreateArgs} args - Arguments to create a Token.
     * @example
     * // Create one Token
     * const Token = await prisma.token.create({
     *   data: {
     *     // ... data to create a Token
     *   }
     * })
     * 
     */
    create<T extends TokenCreateArgs>(args: SelectSubset<T, TokenCreateArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tokens.
     * @param {TokenCreateManyArgs} args - Arguments to create many Tokens.
     * @example
     * // Create many Tokens
     * const token = await prisma.token.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TokenCreateManyArgs>(args?: SelectSubset<T, TokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tokens and returns the data saved in the database.
     * @param {TokenCreateManyAndReturnArgs} args - Arguments to create many Tokens.
     * @example
     * // Create many Tokens
     * const token = await prisma.token.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tokens and only return the `id`
     * const tokenWithIdOnly = await prisma.token.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TokenCreateManyAndReturnArgs>(args?: SelectSubset<T, TokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Token.
     * @param {TokenDeleteArgs} args - Arguments to delete one Token.
     * @example
     * // Delete one Token
     * const Token = await prisma.token.delete({
     *   where: {
     *     // ... filter to delete one Token
     *   }
     * })
     * 
     */
    delete<T extends TokenDeleteArgs>(args: SelectSubset<T, TokenDeleteArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Token.
     * @param {TokenUpdateArgs} args - Arguments to update one Token.
     * @example
     * // Update one Token
     * const token = await prisma.token.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TokenUpdateArgs>(args: SelectSubset<T, TokenUpdateArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tokens.
     * @param {TokenDeleteManyArgs} args - Arguments to filter Tokens to delete.
     * @example
     * // Delete a few Tokens
     * const { count } = await prisma.token.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TokenDeleteManyArgs>(args?: SelectSubset<T, TokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tokens
     * const token = await prisma.token.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TokenUpdateManyArgs>(args: SelectSubset<T, TokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tokens and returns the data updated in the database.
     * @param {TokenUpdateManyAndReturnArgs} args - Arguments to update many Tokens.
     * @example
     * // Update many Tokens
     * const token = await prisma.token.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tokens and only return the `id`
     * const tokenWithIdOnly = await prisma.token.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TokenUpdateManyAndReturnArgs>(args: SelectSubset<T, TokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Token.
     * @param {TokenUpsertArgs} args - Arguments to update or create a Token.
     * @example
     * // Update or create a Token
     * const token = await prisma.token.upsert({
     *   create: {
     *     // ... data to create a Token
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Token we want to update
     *   }
     * })
     */
    upsert<T extends TokenUpsertArgs>(args: SelectSubset<T, TokenUpsertArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenCountArgs} args - Arguments to filter Tokens to count.
     * @example
     * // Count the number of Tokens
     * const count = await prisma.token.count({
     *   where: {
     *     // ... the filter for the Tokens we want to count
     *   }
     * })
    **/
    count<T extends TokenCountArgs>(
      args?: Subset<T, TokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Token.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TokenAggregateArgs>(args: Subset<T, TokenAggregateArgs>): Prisma.PrismaPromise<GetTokenAggregateType<T>>

    /**
     * Group by Token.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TokenGroupByArgs['orderBy'] }
        : { orderBy?: TokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Token model
   */
  readonly fields: TokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Token.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pairsAsToken0<T extends Token$pairsAsToken0Args<ExtArgs> = {}>(args?: Subset<T, Token$pairsAsToken0Args<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PairPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    pairsAsToken1<T extends Token$pairsAsToken1Args<ExtArgs> = {}>(args?: Subset<T, Token$pairsAsToken1Args<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PairPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Token model
   */
  interface TokenFieldRefs {
    readonly id: FieldRef<"Token", 'Int'>
    readonly network: FieldRef<"Token", 'String'>
    readonly address: FieldRef<"Token", 'String'>
    readonly wrappedAddress: FieldRef<"Token", 'String'>
    readonly symbol: FieldRef<"Token", 'String'>
    readonly name: FieldRef<"Token", 'String'>
    readonly decimals: FieldRef<"Token", 'Int'>
    readonly createdAt: FieldRef<"Token", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Token findUnique
   */
  export type TokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter, which Token to fetch.
     */
    where: TokenWhereUniqueInput
  }

  /**
   * Token findUniqueOrThrow
   */
  export type TokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter, which Token to fetch.
     */
    where: TokenWhereUniqueInput
  }

  /**
   * Token findFirst
   */
  export type TokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter, which Token to fetch.
     */
    where?: TokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tokens to fetch.
     */
    orderBy?: TokenOrderByWithRelationInput | TokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tokens.
     */
    cursor?: TokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tokens.
     */
    distinct?: TokenScalarFieldEnum | TokenScalarFieldEnum[]
  }

  /**
   * Token findFirstOrThrow
   */
  export type TokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter, which Token to fetch.
     */
    where?: TokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tokens to fetch.
     */
    orderBy?: TokenOrderByWithRelationInput | TokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tokens.
     */
    cursor?: TokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tokens.
     */
    distinct?: TokenScalarFieldEnum | TokenScalarFieldEnum[]
  }

  /**
   * Token findMany
   */
  export type TokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter, which Tokens to fetch.
     */
    where?: TokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tokens to fetch.
     */
    orderBy?: TokenOrderByWithRelationInput | TokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tokens.
     */
    cursor?: TokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tokens.
     */
    skip?: number
    distinct?: TokenScalarFieldEnum | TokenScalarFieldEnum[]
  }

  /**
   * Token create
   */
  export type TokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * The data needed to create a Token.
     */
    data: XOR<TokenCreateInput, TokenUncheckedCreateInput>
  }

  /**
   * Token createMany
   */
  export type TokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tokens.
     */
    data: TokenCreateManyInput | TokenCreateManyInput[]
  }

  /**
   * Token createManyAndReturn
   */
  export type TokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * The data used to create many Tokens.
     */
    data: TokenCreateManyInput | TokenCreateManyInput[]
  }

  /**
   * Token update
   */
  export type TokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * The data needed to update a Token.
     */
    data: XOR<TokenUpdateInput, TokenUncheckedUpdateInput>
    /**
     * Choose, which Token to update.
     */
    where: TokenWhereUniqueInput
  }

  /**
   * Token updateMany
   */
  export type TokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tokens.
     */
    data: XOR<TokenUpdateManyMutationInput, TokenUncheckedUpdateManyInput>
    /**
     * Filter which Tokens to update
     */
    where?: TokenWhereInput
    /**
     * Limit how many Tokens to update.
     */
    limit?: number
  }

  /**
   * Token updateManyAndReturn
   */
  export type TokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * The data used to update Tokens.
     */
    data: XOR<TokenUpdateManyMutationInput, TokenUncheckedUpdateManyInput>
    /**
     * Filter which Tokens to update
     */
    where?: TokenWhereInput
    /**
     * Limit how many Tokens to update.
     */
    limit?: number
  }

  /**
   * Token upsert
   */
  export type TokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * The filter to search for the Token to update in case it exists.
     */
    where: TokenWhereUniqueInput
    /**
     * In case the Token found by the `where` argument doesn't exist, create a new Token with this data.
     */
    create: XOR<TokenCreateInput, TokenUncheckedCreateInput>
    /**
     * In case the Token was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TokenUpdateInput, TokenUncheckedUpdateInput>
  }

  /**
   * Token delete
   */
  export type TokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter which Token to delete.
     */
    where: TokenWhereUniqueInput
  }

  /**
   * Token deleteMany
   */
  export type TokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tokens to delete
     */
    where?: TokenWhereInput
    /**
     * Limit how many Tokens to delete.
     */
    limit?: number
  }

  /**
   * Token.pairsAsToken0
   */
  export type Token$pairsAsToken0Args<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pair
     */
    select?: PairSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pair
     */
    omit?: PairOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PairInclude<ExtArgs> | null
    where?: PairWhereInput
    orderBy?: PairOrderByWithRelationInput | PairOrderByWithRelationInput[]
    cursor?: PairWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PairScalarFieldEnum | PairScalarFieldEnum[]
  }

  /**
   * Token.pairsAsToken1
   */
  export type Token$pairsAsToken1Args<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pair
     */
    select?: PairSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pair
     */
    omit?: PairOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PairInclude<ExtArgs> | null
    where?: PairWhereInput
    orderBy?: PairOrderByWithRelationInput | PairOrderByWithRelationInput[]
    cursor?: PairWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PairScalarFieldEnum | PairScalarFieldEnum[]
  }

  /**
   * Token without action
   */
  export type TokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
  }


  /**
   * Model Pair
   */

  export type AggregatePair = {
    _count: PairCountAggregateOutputType | null
    _avg: PairAvgAggregateOutputType | null
    _sum: PairSumAggregateOutputType | null
    _min: PairMinAggregateOutputType | null
    _max: PairMaxAggregateOutputType | null
  }

  export type PairAvgAggregateOutputType = {
    id: number | null
    token0Id: number | null
    token1Id: number | null
    spikeyAmmReserve0: number | null
    spikeyAmmReserve1: number | null
  }

  export type PairSumAggregateOutputType = {
    id: number | null
    token0Id: number | null
    token1Id: number | null
    spikeyAmmReserve0: bigint | null
    spikeyAmmReserve1: bigint | null
  }

  export type PairMinAggregateOutputType = {
    id: number | null
    network: string | null
    token0Id: number | null
    token1Id: number | null
    spikeyAmmPairAddress: string | null
    spikeyAmmReserve0: bigint | null
    spikeyAmmReserve1: bigint | null
    createdAt: Date | null
  }

  export type PairMaxAggregateOutputType = {
    id: number | null
    network: string | null
    token0Id: number | null
    token1Id: number | null
    spikeyAmmPairAddress: string | null
    spikeyAmmReserve0: bigint | null
    spikeyAmmReserve1: bigint | null
    createdAt: Date | null
  }

  export type PairCountAggregateOutputType = {
    id: number
    network: number
    token0Id: number
    token1Id: number
    spikeyAmmPairAddress: number
    spikeyAmmReserve0: number
    spikeyAmmReserve1: number
    createdAt: number
    _all: number
  }


  export type PairAvgAggregateInputType = {
    id?: true
    token0Id?: true
    token1Id?: true
    spikeyAmmReserve0?: true
    spikeyAmmReserve1?: true
  }

  export type PairSumAggregateInputType = {
    id?: true
    token0Id?: true
    token1Id?: true
    spikeyAmmReserve0?: true
    spikeyAmmReserve1?: true
  }

  export type PairMinAggregateInputType = {
    id?: true
    network?: true
    token0Id?: true
    token1Id?: true
    spikeyAmmPairAddress?: true
    spikeyAmmReserve0?: true
    spikeyAmmReserve1?: true
    createdAt?: true
  }

  export type PairMaxAggregateInputType = {
    id?: true
    network?: true
    token0Id?: true
    token1Id?: true
    spikeyAmmPairAddress?: true
    spikeyAmmReserve0?: true
    spikeyAmmReserve1?: true
    createdAt?: true
  }

  export type PairCountAggregateInputType = {
    id?: true
    network?: true
    token0Id?: true
    token1Id?: true
    spikeyAmmPairAddress?: true
    spikeyAmmReserve0?: true
    spikeyAmmReserve1?: true
    createdAt?: true
    _all?: true
  }

  export type PairAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pair to aggregate.
     */
    where?: PairWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pairs to fetch.
     */
    orderBy?: PairOrderByWithRelationInput | PairOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PairWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pairs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pairs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Pairs
    **/
    _count?: true | PairCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PairAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PairSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PairMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PairMaxAggregateInputType
  }

  export type GetPairAggregateType<T extends PairAggregateArgs> = {
        [P in keyof T & keyof AggregatePair]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePair[P]>
      : GetScalarType<T[P], AggregatePair[P]>
  }




  export type PairGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PairWhereInput
    orderBy?: PairOrderByWithAggregationInput | PairOrderByWithAggregationInput[]
    by: PairScalarFieldEnum[] | PairScalarFieldEnum
    having?: PairScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PairCountAggregateInputType | true
    _avg?: PairAvgAggregateInputType
    _sum?: PairSumAggregateInputType
    _min?: PairMinAggregateInputType
    _max?: PairMaxAggregateInputType
  }

  export type PairGroupByOutputType = {
    id: number
    network: string
    token0Id: number
    token1Id: number
    spikeyAmmPairAddress: string | null
    spikeyAmmReserve0: bigint | null
    spikeyAmmReserve1: bigint | null
    createdAt: Date
    _count: PairCountAggregateOutputType | null
    _avg: PairAvgAggregateOutputType | null
    _sum: PairSumAggregateOutputType | null
    _min: PairMinAggregateOutputType | null
    _max: PairMaxAggregateOutputType | null
  }

  type GetPairGroupByPayload<T extends PairGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PairGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PairGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PairGroupByOutputType[P]>
            : GetScalarType<T[P], PairGroupByOutputType[P]>
        }
      >
    >


  export type PairSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    network?: boolean
    token0Id?: boolean
    token1Id?: boolean
    spikeyAmmPairAddress?: boolean
    spikeyAmmReserve0?: boolean
    spikeyAmmReserve1?: boolean
    createdAt?: boolean
    token0?: boolean | TokenDefaultArgs<ExtArgs>
    token1?: boolean | TokenDefaultArgs<ExtArgs>
    spikeyAmmSwaps?: boolean | Pair$spikeyAmmSwapsArgs<ExtArgs>
    dexlynSwaps?: boolean | Pair$dexlynSwapsArgs<ExtArgs>
    ohlcData?: boolean | Pair$ohlcDataArgs<ExtArgs>
    _count?: boolean | PairCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pair"]>

  export type PairSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    network?: boolean
    token0Id?: boolean
    token1Id?: boolean
    spikeyAmmPairAddress?: boolean
    spikeyAmmReserve0?: boolean
    spikeyAmmReserve1?: boolean
    createdAt?: boolean
    token0?: boolean | TokenDefaultArgs<ExtArgs>
    token1?: boolean | TokenDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pair"]>

  export type PairSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    network?: boolean
    token0Id?: boolean
    token1Id?: boolean
    spikeyAmmPairAddress?: boolean
    spikeyAmmReserve0?: boolean
    spikeyAmmReserve1?: boolean
    createdAt?: boolean
    token0?: boolean | TokenDefaultArgs<ExtArgs>
    token1?: boolean | TokenDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pair"]>

  export type PairSelectScalar = {
    id?: boolean
    network?: boolean
    token0Id?: boolean
    token1Id?: boolean
    spikeyAmmPairAddress?: boolean
    spikeyAmmReserve0?: boolean
    spikeyAmmReserve1?: boolean
    createdAt?: boolean
  }

  export type PairOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "network" | "token0Id" | "token1Id" | "spikeyAmmPairAddress" | "spikeyAmmReserve0" | "spikeyAmmReserve1" | "createdAt", ExtArgs["result"]["pair"]>
  export type PairInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    token0?: boolean | TokenDefaultArgs<ExtArgs>
    token1?: boolean | TokenDefaultArgs<ExtArgs>
    spikeyAmmSwaps?: boolean | Pair$spikeyAmmSwapsArgs<ExtArgs>
    dexlynSwaps?: boolean | Pair$dexlynSwapsArgs<ExtArgs>
    ohlcData?: boolean | Pair$ohlcDataArgs<ExtArgs>
    _count?: boolean | PairCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PairIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    token0?: boolean | TokenDefaultArgs<ExtArgs>
    token1?: boolean | TokenDefaultArgs<ExtArgs>
  }
  export type PairIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    token0?: boolean | TokenDefaultArgs<ExtArgs>
    token1?: boolean | TokenDefaultArgs<ExtArgs>
  }

  export type $PairPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Pair"
    objects: {
      token0: Prisma.$TokenPayload<ExtArgs>
      token1: Prisma.$TokenPayload<ExtArgs>
      spikeyAmmSwaps: Prisma.$SpikeyAmmSwapPayload<ExtArgs>[]
      dexlynSwaps: Prisma.$DexlynSwapPayload<ExtArgs>[]
      ohlcData: Prisma.$OhlcDataPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      network: string
      token0Id: number
      token1Id: number
      spikeyAmmPairAddress: string | null
      spikeyAmmReserve0: bigint | null
      spikeyAmmReserve1: bigint | null
      createdAt: Date
    }, ExtArgs["result"]["pair"]>
    composites: {}
  }

  type PairGetPayload<S extends boolean | null | undefined | PairDefaultArgs> = $Result.GetResult<Prisma.$PairPayload, S>

  type PairCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PairFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PairCountAggregateInputType | true
    }

  export interface PairDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Pair'], meta: { name: 'Pair' } }
    /**
     * Find zero or one Pair that matches the filter.
     * @param {PairFindUniqueArgs} args - Arguments to find a Pair
     * @example
     * // Get one Pair
     * const pair = await prisma.pair.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PairFindUniqueArgs>(args: SelectSubset<T, PairFindUniqueArgs<ExtArgs>>): Prisma__PairClient<$Result.GetResult<Prisma.$PairPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Pair that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PairFindUniqueOrThrowArgs} args - Arguments to find a Pair
     * @example
     * // Get one Pair
     * const pair = await prisma.pair.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PairFindUniqueOrThrowArgs>(args: SelectSubset<T, PairFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PairClient<$Result.GetResult<Prisma.$PairPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pair that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PairFindFirstArgs} args - Arguments to find a Pair
     * @example
     * // Get one Pair
     * const pair = await prisma.pair.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PairFindFirstArgs>(args?: SelectSubset<T, PairFindFirstArgs<ExtArgs>>): Prisma__PairClient<$Result.GetResult<Prisma.$PairPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pair that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PairFindFirstOrThrowArgs} args - Arguments to find a Pair
     * @example
     * // Get one Pair
     * const pair = await prisma.pair.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PairFindFirstOrThrowArgs>(args?: SelectSubset<T, PairFindFirstOrThrowArgs<ExtArgs>>): Prisma__PairClient<$Result.GetResult<Prisma.$PairPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Pairs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PairFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Pairs
     * const pairs = await prisma.pair.findMany()
     * 
     * // Get first 10 Pairs
     * const pairs = await prisma.pair.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pairWithIdOnly = await prisma.pair.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PairFindManyArgs>(args?: SelectSubset<T, PairFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PairPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Pair.
     * @param {PairCreateArgs} args - Arguments to create a Pair.
     * @example
     * // Create one Pair
     * const Pair = await prisma.pair.create({
     *   data: {
     *     // ... data to create a Pair
     *   }
     * })
     * 
     */
    create<T extends PairCreateArgs>(args: SelectSubset<T, PairCreateArgs<ExtArgs>>): Prisma__PairClient<$Result.GetResult<Prisma.$PairPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Pairs.
     * @param {PairCreateManyArgs} args - Arguments to create many Pairs.
     * @example
     * // Create many Pairs
     * const pair = await prisma.pair.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PairCreateManyArgs>(args?: SelectSubset<T, PairCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Pairs and returns the data saved in the database.
     * @param {PairCreateManyAndReturnArgs} args - Arguments to create many Pairs.
     * @example
     * // Create many Pairs
     * const pair = await prisma.pair.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Pairs and only return the `id`
     * const pairWithIdOnly = await prisma.pair.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PairCreateManyAndReturnArgs>(args?: SelectSubset<T, PairCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PairPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Pair.
     * @param {PairDeleteArgs} args - Arguments to delete one Pair.
     * @example
     * // Delete one Pair
     * const Pair = await prisma.pair.delete({
     *   where: {
     *     // ... filter to delete one Pair
     *   }
     * })
     * 
     */
    delete<T extends PairDeleteArgs>(args: SelectSubset<T, PairDeleteArgs<ExtArgs>>): Prisma__PairClient<$Result.GetResult<Prisma.$PairPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Pair.
     * @param {PairUpdateArgs} args - Arguments to update one Pair.
     * @example
     * // Update one Pair
     * const pair = await prisma.pair.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PairUpdateArgs>(args: SelectSubset<T, PairUpdateArgs<ExtArgs>>): Prisma__PairClient<$Result.GetResult<Prisma.$PairPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Pairs.
     * @param {PairDeleteManyArgs} args - Arguments to filter Pairs to delete.
     * @example
     * // Delete a few Pairs
     * const { count } = await prisma.pair.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PairDeleteManyArgs>(args?: SelectSubset<T, PairDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pairs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PairUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Pairs
     * const pair = await prisma.pair.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PairUpdateManyArgs>(args: SelectSubset<T, PairUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pairs and returns the data updated in the database.
     * @param {PairUpdateManyAndReturnArgs} args - Arguments to update many Pairs.
     * @example
     * // Update many Pairs
     * const pair = await prisma.pair.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Pairs and only return the `id`
     * const pairWithIdOnly = await prisma.pair.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PairUpdateManyAndReturnArgs>(args: SelectSubset<T, PairUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PairPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Pair.
     * @param {PairUpsertArgs} args - Arguments to update or create a Pair.
     * @example
     * // Update or create a Pair
     * const pair = await prisma.pair.upsert({
     *   create: {
     *     // ... data to create a Pair
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Pair we want to update
     *   }
     * })
     */
    upsert<T extends PairUpsertArgs>(args: SelectSubset<T, PairUpsertArgs<ExtArgs>>): Prisma__PairClient<$Result.GetResult<Prisma.$PairPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Pairs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PairCountArgs} args - Arguments to filter Pairs to count.
     * @example
     * // Count the number of Pairs
     * const count = await prisma.pair.count({
     *   where: {
     *     // ... the filter for the Pairs we want to count
     *   }
     * })
    **/
    count<T extends PairCountArgs>(
      args?: Subset<T, PairCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PairCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Pair.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PairAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PairAggregateArgs>(args: Subset<T, PairAggregateArgs>): Prisma.PrismaPromise<GetPairAggregateType<T>>

    /**
     * Group by Pair.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PairGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PairGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PairGroupByArgs['orderBy'] }
        : { orderBy?: PairGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PairGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPairGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Pair model
   */
  readonly fields: PairFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Pair.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PairClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    token0<T extends TokenDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TokenDefaultArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    token1<T extends TokenDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TokenDefaultArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    spikeyAmmSwaps<T extends Pair$spikeyAmmSwapsArgs<ExtArgs> = {}>(args?: Subset<T, Pair$spikeyAmmSwapsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpikeyAmmSwapPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    dexlynSwaps<T extends Pair$dexlynSwapsArgs<ExtArgs> = {}>(args?: Subset<T, Pair$dexlynSwapsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DexlynSwapPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ohlcData<T extends Pair$ohlcDataArgs<ExtArgs> = {}>(args?: Subset<T, Pair$ohlcDataArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OhlcDataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Pair model
   */
  interface PairFieldRefs {
    readonly id: FieldRef<"Pair", 'Int'>
    readonly network: FieldRef<"Pair", 'String'>
    readonly token0Id: FieldRef<"Pair", 'Int'>
    readonly token1Id: FieldRef<"Pair", 'Int'>
    readonly spikeyAmmPairAddress: FieldRef<"Pair", 'String'>
    readonly spikeyAmmReserve0: FieldRef<"Pair", 'BigInt'>
    readonly spikeyAmmReserve1: FieldRef<"Pair", 'BigInt'>
    readonly createdAt: FieldRef<"Pair", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Pair findUnique
   */
  export type PairFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pair
     */
    select?: PairSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pair
     */
    omit?: PairOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PairInclude<ExtArgs> | null
    /**
     * Filter, which Pair to fetch.
     */
    where: PairWhereUniqueInput
  }

  /**
   * Pair findUniqueOrThrow
   */
  export type PairFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pair
     */
    select?: PairSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pair
     */
    omit?: PairOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PairInclude<ExtArgs> | null
    /**
     * Filter, which Pair to fetch.
     */
    where: PairWhereUniqueInput
  }

  /**
   * Pair findFirst
   */
  export type PairFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pair
     */
    select?: PairSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pair
     */
    omit?: PairOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PairInclude<ExtArgs> | null
    /**
     * Filter, which Pair to fetch.
     */
    where?: PairWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pairs to fetch.
     */
    orderBy?: PairOrderByWithRelationInput | PairOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pairs.
     */
    cursor?: PairWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pairs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pairs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pairs.
     */
    distinct?: PairScalarFieldEnum | PairScalarFieldEnum[]
  }

  /**
   * Pair findFirstOrThrow
   */
  export type PairFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pair
     */
    select?: PairSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pair
     */
    omit?: PairOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PairInclude<ExtArgs> | null
    /**
     * Filter, which Pair to fetch.
     */
    where?: PairWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pairs to fetch.
     */
    orderBy?: PairOrderByWithRelationInput | PairOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pairs.
     */
    cursor?: PairWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pairs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pairs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pairs.
     */
    distinct?: PairScalarFieldEnum | PairScalarFieldEnum[]
  }

  /**
   * Pair findMany
   */
  export type PairFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pair
     */
    select?: PairSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pair
     */
    omit?: PairOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PairInclude<ExtArgs> | null
    /**
     * Filter, which Pairs to fetch.
     */
    where?: PairWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pairs to fetch.
     */
    orderBy?: PairOrderByWithRelationInput | PairOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Pairs.
     */
    cursor?: PairWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pairs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pairs.
     */
    skip?: number
    distinct?: PairScalarFieldEnum | PairScalarFieldEnum[]
  }

  /**
   * Pair create
   */
  export type PairCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pair
     */
    select?: PairSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pair
     */
    omit?: PairOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PairInclude<ExtArgs> | null
    /**
     * The data needed to create a Pair.
     */
    data: XOR<PairCreateInput, PairUncheckedCreateInput>
  }

  /**
   * Pair createMany
   */
  export type PairCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Pairs.
     */
    data: PairCreateManyInput | PairCreateManyInput[]
  }

  /**
   * Pair createManyAndReturn
   */
  export type PairCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pair
     */
    select?: PairSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Pair
     */
    omit?: PairOmit<ExtArgs> | null
    /**
     * The data used to create many Pairs.
     */
    data: PairCreateManyInput | PairCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PairIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Pair update
   */
  export type PairUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pair
     */
    select?: PairSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pair
     */
    omit?: PairOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PairInclude<ExtArgs> | null
    /**
     * The data needed to update a Pair.
     */
    data: XOR<PairUpdateInput, PairUncheckedUpdateInput>
    /**
     * Choose, which Pair to update.
     */
    where: PairWhereUniqueInput
  }

  /**
   * Pair updateMany
   */
  export type PairUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Pairs.
     */
    data: XOR<PairUpdateManyMutationInput, PairUncheckedUpdateManyInput>
    /**
     * Filter which Pairs to update
     */
    where?: PairWhereInput
    /**
     * Limit how many Pairs to update.
     */
    limit?: number
  }

  /**
   * Pair updateManyAndReturn
   */
  export type PairUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pair
     */
    select?: PairSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Pair
     */
    omit?: PairOmit<ExtArgs> | null
    /**
     * The data used to update Pairs.
     */
    data: XOR<PairUpdateManyMutationInput, PairUncheckedUpdateManyInput>
    /**
     * Filter which Pairs to update
     */
    where?: PairWhereInput
    /**
     * Limit how many Pairs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PairIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Pair upsert
   */
  export type PairUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pair
     */
    select?: PairSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pair
     */
    omit?: PairOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PairInclude<ExtArgs> | null
    /**
     * The filter to search for the Pair to update in case it exists.
     */
    where: PairWhereUniqueInput
    /**
     * In case the Pair found by the `where` argument doesn't exist, create a new Pair with this data.
     */
    create: XOR<PairCreateInput, PairUncheckedCreateInput>
    /**
     * In case the Pair was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PairUpdateInput, PairUncheckedUpdateInput>
  }

  /**
   * Pair delete
   */
  export type PairDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pair
     */
    select?: PairSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pair
     */
    omit?: PairOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PairInclude<ExtArgs> | null
    /**
     * Filter which Pair to delete.
     */
    where: PairWhereUniqueInput
  }

  /**
   * Pair deleteMany
   */
  export type PairDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pairs to delete
     */
    where?: PairWhereInput
    /**
     * Limit how many Pairs to delete.
     */
    limit?: number
  }

  /**
   * Pair.spikeyAmmSwaps
   */
  export type Pair$spikeyAmmSwapsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpikeyAmmSwap
     */
    select?: SpikeyAmmSwapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpikeyAmmSwap
     */
    omit?: SpikeyAmmSwapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpikeyAmmSwapInclude<ExtArgs> | null
    where?: SpikeyAmmSwapWhereInput
    orderBy?: SpikeyAmmSwapOrderByWithRelationInput | SpikeyAmmSwapOrderByWithRelationInput[]
    cursor?: SpikeyAmmSwapWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SpikeyAmmSwapScalarFieldEnum | SpikeyAmmSwapScalarFieldEnum[]
  }

  /**
   * Pair.dexlynSwaps
   */
  export type Pair$dexlynSwapsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DexlynSwap
     */
    select?: DexlynSwapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DexlynSwap
     */
    omit?: DexlynSwapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DexlynSwapInclude<ExtArgs> | null
    where?: DexlynSwapWhereInput
    orderBy?: DexlynSwapOrderByWithRelationInput | DexlynSwapOrderByWithRelationInput[]
    cursor?: DexlynSwapWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DexlynSwapScalarFieldEnum | DexlynSwapScalarFieldEnum[]
  }

  /**
   * Pair.ohlcData
   */
  export type Pair$ohlcDataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OhlcData
     */
    select?: OhlcDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OhlcData
     */
    omit?: OhlcDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OhlcDataInclude<ExtArgs> | null
    where?: OhlcDataWhereInput
    orderBy?: OhlcDataOrderByWithRelationInput | OhlcDataOrderByWithRelationInput[]
    cursor?: OhlcDataWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OhlcDataScalarFieldEnum | OhlcDataScalarFieldEnum[]
  }

  /**
   * Pair without action
   */
  export type PairDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pair
     */
    select?: PairSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pair
     */
    omit?: PairOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PairInclude<ExtArgs> | null
  }


  /**
   * Model OhlcData
   */

  export type AggregateOhlcData = {
    _count: OhlcDataCountAggregateOutputType | null
    _avg: OhlcDataAvgAggregateOutputType | null
    _sum: OhlcDataSumAggregateOutputType | null
    _min: OhlcDataMinAggregateOutputType | null
    _max: OhlcDataMaxAggregateOutputType | null
  }

  export type OhlcDataAvgAggregateOutputType = {
    id: number | null
    open: Decimal | null
    high: Decimal | null
    low: Decimal | null
    close: Decimal | null
    volume: Decimal | null
    tradeCount: number | null
    pairId: number | null
  }

  export type OhlcDataSumAggregateOutputType = {
    id: number | null
    open: Decimal | null
    high: Decimal | null
    low: Decimal | null
    close: Decimal | null
    volume: Decimal | null
    tradeCount: number | null
    pairId: number | null
  }

  export type OhlcDataMinAggregateOutputType = {
    id: number | null
    network: string | null
    ammSource: string | null
    timeframe: string | null
    timestamp: Date | null
    open: Decimal | null
    high: Decimal | null
    low: Decimal | null
    close: Decimal | null
    volume: Decimal | null
    tradeCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
    pairId: number | null
  }

  export type OhlcDataMaxAggregateOutputType = {
    id: number | null
    network: string | null
    ammSource: string | null
    timeframe: string | null
    timestamp: Date | null
    open: Decimal | null
    high: Decimal | null
    low: Decimal | null
    close: Decimal | null
    volume: Decimal | null
    tradeCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
    pairId: number | null
  }

  export type OhlcDataCountAggregateOutputType = {
    id: number
    network: number
    ammSource: number
    timeframe: number
    timestamp: number
    open: number
    high: number
    low: number
    close: number
    volume: number
    tradeCount: number
    createdAt: number
    updatedAt: number
    pairId: number
    _all: number
  }


  export type OhlcDataAvgAggregateInputType = {
    id?: true
    open?: true
    high?: true
    low?: true
    close?: true
    volume?: true
    tradeCount?: true
    pairId?: true
  }

  export type OhlcDataSumAggregateInputType = {
    id?: true
    open?: true
    high?: true
    low?: true
    close?: true
    volume?: true
    tradeCount?: true
    pairId?: true
  }

  export type OhlcDataMinAggregateInputType = {
    id?: true
    network?: true
    ammSource?: true
    timeframe?: true
    timestamp?: true
    open?: true
    high?: true
    low?: true
    close?: true
    volume?: true
    tradeCount?: true
    createdAt?: true
    updatedAt?: true
    pairId?: true
  }

  export type OhlcDataMaxAggregateInputType = {
    id?: true
    network?: true
    ammSource?: true
    timeframe?: true
    timestamp?: true
    open?: true
    high?: true
    low?: true
    close?: true
    volume?: true
    tradeCount?: true
    createdAt?: true
    updatedAt?: true
    pairId?: true
  }

  export type OhlcDataCountAggregateInputType = {
    id?: true
    network?: true
    ammSource?: true
    timeframe?: true
    timestamp?: true
    open?: true
    high?: true
    low?: true
    close?: true
    volume?: true
    tradeCount?: true
    createdAt?: true
    updatedAt?: true
    pairId?: true
    _all?: true
  }

  export type OhlcDataAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OhlcData to aggregate.
     */
    where?: OhlcDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OhlcData to fetch.
     */
    orderBy?: OhlcDataOrderByWithRelationInput | OhlcDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OhlcDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OhlcData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OhlcData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OhlcData
    **/
    _count?: true | OhlcDataCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OhlcDataAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OhlcDataSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OhlcDataMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OhlcDataMaxAggregateInputType
  }

  export type GetOhlcDataAggregateType<T extends OhlcDataAggregateArgs> = {
        [P in keyof T & keyof AggregateOhlcData]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOhlcData[P]>
      : GetScalarType<T[P], AggregateOhlcData[P]>
  }




  export type OhlcDataGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OhlcDataWhereInput
    orderBy?: OhlcDataOrderByWithAggregationInput | OhlcDataOrderByWithAggregationInput[]
    by: OhlcDataScalarFieldEnum[] | OhlcDataScalarFieldEnum
    having?: OhlcDataScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OhlcDataCountAggregateInputType | true
    _avg?: OhlcDataAvgAggregateInputType
    _sum?: OhlcDataSumAggregateInputType
    _min?: OhlcDataMinAggregateInputType
    _max?: OhlcDataMaxAggregateInputType
  }

  export type OhlcDataGroupByOutputType = {
    id: number
    network: string
    ammSource: string
    timeframe: string
    timestamp: Date
    open: Decimal
    high: Decimal
    low: Decimal
    close: Decimal
    volume: Decimal
    tradeCount: number
    createdAt: Date
    updatedAt: Date
    pairId: number
    _count: OhlcDataCountAggregateOutputType | null
    _avg: OhlcDataAvgAggregateOutputType | null
    _sum: OhlcDataSumAggregateOutputType | null
    _min: OhlcDataMinAggregateOutputType | null
    _max: OhlcDataMaxAggregateOutputType | null
  }

  type GetOhlcDataGroupByPayload<T extends OhlcDataGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OhlcDataGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OhlcDataGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OhlcDataGroupByOutputType[P]>
            : GetScalarType<T[P], OhlcDataGroupByOutputType[P]>
        }
      >
    >


  export type OhlcDataSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    network?: boolean
    ammSource?: boolean
    timeframe?: boolean
    timestamp?: boolean
    open?: boolean
    high?: boolean
    low?: boolean
    close?: boolean
    volume?: boolean
    tradeCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    pairId?: boolean
    pair?: boolean | PairDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ohlcData"]>

  export type OhlcDataSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    network?: boolean
    ammSource?: boolean
    timeframe?: boolean
    timestamp?: boolean
    open?: boolean
    high?: boolean
    low?: boolean
    close?: boolean
    volume?: boolean
    tradeCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    pairId?: boolean
    pair?: boolean | PairDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ohlcData"]>

  export type OhlcDataSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    network?: boolean
    ammSource?: boolean
    timeframe?: boolean
    timestamp?: boolean
    open?: boolean
    high?: boolean
    low?: boolean
    close?: boolean
    volume?: boolean
    tradeCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    pairId?: boolean
    pair?: boolean | PairDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ohlcData"]>

  export type OhlcDataSelectScalar = {
    id?: boolean
    network?: boolean
    ammSource?: boolean
    timeframe?: boolean
    timestamp?: boolean
    open?: boolean
    high?: boolean
    low?: boolean
    close?: boolean
    volume?: boolean
    tradeCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    pairId?: boolean
  }

  export type OhlcDataOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "network" | "ammSource" | "timeframe" | "timestamp" | "open" | "high" | "low" | "close" | "volume" | "tradeCount" | "createdAt" | "updatedAt" | "pairId", ExtArgs["result"]["ohlcData"]>
  export type OhlcDataInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pair?: boolean | PairDefaultArgs<ExtArgs>
  }
  export type OhlcDataIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pair?: boolean | PairDefaultArgs<ExtArgs>
  }
  export type OhlcDataIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pair?: boolean | PairDefaultArgs<ExtArgs>
  }

  export type $OhlcDataPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OhlcData"
    objects: {
      pair: Prisma.$PairPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      network: string
      ammSource: string
      timeframe: string
      timestamp: Date
      open: Prisma.Decimal
      high: Prisma.Decimal
      low: Prisma.Decimal
      close: Prisma.Decimal
      volume: Prisma.Decimal
      tradeCount: number
      createdAt: Date
      updatedAt: Date
      pairId: number
    }, ExtArgs["result"]["ohlcData"]>
    composites: {}
  }

  type OhlcDataGetPayload<S extends boolean | null | undefined | OhlcDataDefaultArgs> = $Result.GetResult<Prisma.$OhlcDataPayload, S>

  type OhlcDataCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OhlcDataFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OhlcDataCountAggregateInputType | true
    }

  export interface OhlcDataDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OhlcData'], meta: { name: 'OhlcData' } }
    /**
     * Find zero or one OhlcData that matches the filter.
     * @param {OhlcDataFindUniqueArgs} args - Arguments to find a OhlcData
     * @example
     * // Get one OhlcData
     * const ohlcData = await prisma.ohlcData.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OhlcDataFindUniqueArgs>(args: SelectSubset<T, OhlcDataFindUniqueArgs<ExtArgs>>): Prisma__OhlcDataClient<$Result.GetResult<Prisma.$OhlcDataPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OhlcData that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OhlcDataFindUniqueOrThrowArgs} args - Arguments to find a OhlcData
     * @example
     * // Get one OhlcData
     * const ohlcData = await prisma.ohlcData.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OhlcDataFindUniqueOrThrowArgs>(args: SelectSubset<T, OhlcDataFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OhlcDataClient<$Result.GetResult<Prisma.$OhlcDataPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OhlcData that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OhlcDataFindFirstArgs} args - Arguments to find a OhlcData
     * @example
     * // Get one OhlcData
     * const ohlcData = await prisma.ohlcData.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OhlcDataFindFirstArgs>(args?: SelectSubset<T, OhlcDataFindFirstArgs<ExtArgs>>): Prisma__OhlcDataClient<$Result.GetResult<Prisma.$OhlcDataPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OhlcData that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OhlcDataFindFirstOrThrowArgs} args - Arguments to find a OhlcData
     * @example
     * // Get one OhlcData
     * const ohlcData = await prisma.ohlcData.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OhlcDataFindFirstOrThrowArgs>(args?: SelectSubset<T, OhlcDataFindFirstOrThrowArgs<ExtArgs>>): Prisma__OhlcDataClient<$Result.GetResult<Prisma.$OhlcDataPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OhlcData that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OhlcDataFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OhlcData
     * const ohlcData = await prisma.ohlcData.findMany()
     * 
     * // Get first 10 OhlcData
     * const ohlcData = await prisma.ohlcData.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ohlcDataWithIdOnly = await prisma.ohlcData.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OhlcDataFindManyArgs>(args?: SelectSubset<T, OhlcDataFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OhlcDataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OhlcData.
     * @param {OhlcDataCreateArgs} args - Arguments to create a OhlcData.
     * @example
     * // Create one OhlcData
     * const OhlcData = await prisma.ohlcData.create({
     *   data: {
     *     // ... data to create a OhlcData
     *   }
     * })
     * 
     */
    create<T extends OhlcDataCreateArgs>(args: SelectSubset<T, OhlcDataCreateArgs<ExtArgs>>): Prisma__OhlcDataClient<$Result.GetResult<Prisma.$OhlcDataPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OhlcData.
     * @param {OhlcDataCreateManyArgs} args - Arguments to create many OhlcData.
     * @example
     * // Create many OhlcData
     * const ohlcData = await prisma.ohlcData.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OhlcDataCreateManyArgs>(args?: SelectSubset<T, OhlcDataCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OhlcData and returns the data saved in the database.
     * @param {OhlcDataCreateManyAndReturnArgs} args - Arguments to create many OhlcData.
     * @example
     * // Create many OhlcData
     * const ohlcData = await prisma.ohlcData.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OhlcData and only return the `id`
     * const ohlcDataWithIdOnly = await prisma.ohlcData.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OhlcDataCreateManyAndReturnArgs>(args?: SelectSubset<T, OhlcDataCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OhlcDataPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OhlcData.
     * @param {OhlcDataDeleteArgs} args - Arguments to delete one OhlcData.
     * @example
     * // Delete one OhlcData
     * const OhlcData = await prisma.ohlcData.delete({
     *   where: {
     *     // ... filter to delete one OhlcData
     *   }
     * })
     * 
     */
    delete<T extends OhlcDataDeleteArgs>(args: SelectSubset<T, OhlcDataDeleteArgs<ExtArgs>>): Prisma__OhlcDataClient<$Result.GetResult<Prisma.$OhlcDataPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OhlcData.
     * @param {OhlcDataUpdateArgs} args - Arguments to update one OhlcData.
     * @example
     * // Update one OhlcData
     * const ohlcData = await prisma.ohlcData.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OhlcDataUpdateArgs>(args: SelectSubset<T, OhlcDataUpdateArgs<ExtArgs>>): Prisma__OhlcDataClient<$Result.GetResult<Prisma.$OhlcDataPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OhlcData.
     * @param {OhlcDataDeleteManyArgs} args - Arguments to filter OhlcData to delete.
     * @example
     * // Delete a few OhlcData
     * const { count } = await prisma.ohlcData.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OhlcDataDeleteManyArgs>(args?: SelectSubset<T, OhlcDataDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OhlcData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OhlcDataUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OhlcData
     * const ohlcData = await prisma.ohlcData.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OhlcDataUpdateManyArgs>(args: SelectSubset<T, OhlcDataUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OhlcData and returns the data updated in the database.
     * @param {OhlcDataUpdateManyAndReturnArgs} args - Arguments to update many OhlcData.
     * @example
     * // Update many OhlcData
     * const ohlcData = await prisma.ohlcData.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OhlcData and only return the `id`
     * const ohlcDataWithIdOnly = await prisma.ohlcData.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OhlcDataUpdateManyAndReturnArgs>(args: SelectSubset<T, OhlcDataUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OhlcDataPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OhlcData.
     * @param {OhlcDataUpsertArgs} args - Arguments to update or create a OhlcData.
     * @example
     * // Update or create a OhlcData
     * const ohlcData = await prisma.ohlcData.upsert({
     *   create: {
     *     // ... data to create a OhlcData
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OhlcData we want to update
     *   }
     * })
     */
    upsert<T extends OhlcDataUpsertArgs>(args: SelectSubset<T, OhlcDataUpsertArgs<ExtArgs>>): Prisma__OhlcDataClient<$Result.GetResult<Prisma.$OhlcDataPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OhlcData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OhlcDataCountArgs} args - Arguments to filter OhlcData to count.
     * @example
     * // Count the number of OhlcData
     * const count = await prisma.ohlcData.count({
     *   where: {
     *     // ... the filter for the OhlcData we want to count
     *   }
     * })
    **/
    count<T extends OhlcDataCountArgs>(
      args?: Subset<T, OhlcDataCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OhlcDataCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OhlcData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OhlcDataAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OhlcDataAggregateArgs>(args: Subset<T, OhlcDataAggregateArgs>): Prisma.PrismaPromise<GetOhlcDataAggregateType<T>>

    /**
     * Group by OhlcData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OhlcDataGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OhlcDataGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OhlcDataGroupByArgs['orderBy'] }
        : { orderBy?: OhlcDataGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OhlcDataGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOhlcDataGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OhlcData model
   */
  readonly fields: OhlcDataFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OhlcData.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OhlcDataClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pair<T extends PairDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PairDefaultArgs<ExtArgs>>): Prisma__PairClient<$Result.GetResult<Prisma.$PairPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OhlcData model
   */
  interface OhlcDataFieldRefs {
    readonly id: FieldRef<"OhlcData", 'Int'>
    readonly network: FieldRef<"OhlcData", 'String'>
    readonly ammSource: FieldRef<"OhlcData", 'String'>
    readonly timeframe: FieldRef<"OhlcData", 'String'>
    readonly timestamp: FieldRef<"OhlcData", 'DateTime'>
    readonly open: FieldRef<"OhlcData", 'Decimal'>
    readonly high: FieldRef<"OhlcData", 'Decimal'>
    readonly low: FieldRef<"OhlcData", 'Decimal'>
    readonly close: FieldRef<"OhlcData", 'Decimal'>
    readonly volume: FieldRef<"OhlcData", 'Decimal'>
    readonly tradeCount: FieldRef<"OhlcData", 'Int'>
    readonly createdAt: FieldRef<"OhlcData", 'DateTime'>
    readonly updatedAt: FieldRef<"OhlcData", 'DateTime'>
    readonly pairId: FieldRef<"OhlcData", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * OhlcData findUnique
   */
  export type OhlcDataFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OhlcData
     */
    select?: OhlcDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OhlcData
     */
    omit?: OhlcDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OhlcDataInclude<ExtArgs> | null
    /**
     * Filter, which OhlcData to fetch.
     */
    where: OhlcDataWhereUniqueInput
  }

  /**
   * OhlcData findUniqueOrThrow
   */
  export type OhlcDataFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OhlcData
     */
    select?: OhlcDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OhlcData
     */
    omit?: OhlcDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OhlcDataInclude<ExtArgs> | null
    /**
     * Filter, which OhlcData to fetch.
     */
    where: OhlcDataWhereUniqueInput
  }

  /**
   * OhlcData findFirst
   */
  export type OhlcDataFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OhlcData
     */
    select?: OhlcDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OhlcData
     */
    omit?: OhlcDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OhlcDataInclude<ExtArgs> | null
    /**
     * Filter, which OhlcData to fetch.
     */
    where?: OhlcDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OhlcData to fetch.
     */
    orderBy?: OhlcDataOrderByWithRelationInput | OhlcDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OhlcData.
     */
    cursor?: OhlcDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OhlcData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OhlcData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OhlcData.
     */
    distinct?: OhlcDataScalarFieldEnum | OhlcDataScalarFieldEnum[]
  }

  /**
   * OhlcData findFirstOrThrow
   */
  export type OhlcDataFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OhlcData
     */
    select?: OhlcDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OhlcData
     */
    omit?: OhlcDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OhlcDataInclude<ExtArgs> | null
    /**
     * Filter, which OhlcData to fetch.
     */
    where?: OhlcDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OhlcData to fetch.
     */
    orderBy?: OhlcDataOrderByWithRelationInput | OhlcDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OhlcData.
     */
    cursor?: OhlcDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OhlcData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OhlcData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OhlcData.
     */
    distinct?: OhlcDataScalarFieldEnum | OhlcDataScalarFieldEnum[]
  }

  /**
   * OhlcData findMany
   */
  export type OhlcDataFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OhlcData
     */
    select?: OhlcDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OhlcData
     */
    omit?: OhlcDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OhlcDataInclude<ExtArgs> | null
    /**
     * Filter, which OhlcData to fetch.
     */
    where?: OhlcDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OhlcData to fetch.
     */
    orderBy?: OhlcDataOrderByWithRelationInput | OhlcDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OhlcData.
     */
    cursor?: OhlcDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OhlcData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OhlcData.
     */
    skip?: number
    distinct?: OhlcDataScalarFieldEnum | OhlcDataScalarFieldEnum[]
  }

  /**
   * OhlcData create
   */
  export type OhlcDataCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OhlcData
     */
    select?: OhlcDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OhlcData
     */
    omit?: OhlcDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OhlcDataInclude<ExtArgs> | null
    /**
     * The data needed to create a OhlcData.
     */
    data: XOR<OhlcDataCreateInput, OhlcDataUncheckedCreateInput>
  }

  /**
   * OhlcData createMany
   */
  export type OhlcDataCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OhlcData.
     */
    data: OhlcDataCreateManyInput | OhlcDataCreateManyInput[]
  }

  /**
   * OhlcData createManyAndReturn
   */
  export type OhlcDataCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OhlcData
     */
    select?: OhlcDataSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OhlcData
     */
    omit?: OhlcDataOmit<ExtArgs> | null
    /**
     * The data used to create many OhlcData.
     */
    data: OhlcDataCreateManyInput | OhlcDataCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OhlcDataIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OhlcData update
   */
  export type OhlcDataUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OhlcData
     */
    select?: OhlcDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OhlcData
     */
    omit?: OhlcDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OhlcDataInclude<ExtArgs> | null
    /**
     * The data needed to update a OhlcData.
     */
    data: XOR<OhlcDataUpdateInput, OhlcDataUncheckedUpdateInput>
    /**
     * Choose, which OhlcData to update.
     */
    where: OhlcDataWhereUniqueInput
  }

  /**
   * OhlcData updateMany
   */
  export type OhlcDataUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OhlcData.
     */
    data: XOR<OhlcDataUpdateManyMutationInput, OhlcDataUncheckedUpdateManyInput>
    /**
     * Filter which OhlcData to update
     */
    where?: OhlcDataWhereInput
    /**
     * Limit how many OhlcData to update.
     */
    limit?: number
  }

  /**
   * OhlcData updateManyAndReturn
   */
  export type OhlcDataUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OhlcData
     */
    select?: OhlcDataSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OhlcData
     */
    omit?: OhlcDataOmit<ExtArgs> | null
    /**
     * The data used to update OhlcData.
     */
    data: XOR<OhlcDataUpdateManyMutationInput, OhlcDataUncheckedUpdateManyInput>
    /**
     * Filter which OhlcData to update
     */
    where?: OhlcDataWhereInput
    /**
     * Limit how many OhlcData to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OhlcDataIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * OhlcData upsert
   */
  export type OhlcDataUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OhlcData
     */
    select?: OhlcDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OhlcData
     */
    omit?: OhlcDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OhlcDataInclude<ExtArgs> | null
    /**
     * The filter to search for the OhlcData to update in case it exists.
     */
    where: OhlcDataWhereUniqueInput
    /**
     * In case the OhlcData found by the `where` argument doesn't exist, create a new OhlcData with this data.
     */
    create: XOR<OhlcDataCreateInput, OhlcDataUncheckedCreateInput>
    /**
     * In case the OhlcData was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OhlcDataUpdateInput, OhlcDataUncheckedUpdateInput>
  }

  /**
   * OhlcData delete
   */
  export type OhlcDataDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OhlcData
     */
    select?: OhlcDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OhlcData
     */
    omit?: OhlcDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OhlcDataInclude<ExtArgs> | null
    /**
     * Filter which OhlcData to delete.
     */
    where: OhlcDataWhereUniqueInput
  }

  /**
   * OhlcData deleteMany
   */
  export type OhlcDataDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OhlcData to delete
     */
    where?: OhlcDataWhereInput
    /**
     * Limit how many OhlcData to delete.
     */
    limit?: number
  }

  /**
   * OhlcData without action
   */
  export type OhlcDataDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OhlcData
     */
    select?: OhlcDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OhlcData
     */
    omit?: OhlcDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OhlcDataInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const EventTrackingScalarFieldEnum: {
    id: 'id',
    eventType: 'eventType',
    blockHeight: 'blockHeight',
    transactionHash: 'transactionHash',
    processed: 'processed',
    error: 'error',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    network: 'network',
    sequenceNumber: 'sequenceNumber'
  };

  export type EventTrackingScalarFieldEnum = (typeof EventTrackingScalarFieldEnum)[keyof typeof EventTrackingScalarFieldEnum]


  export const SpikeyAmmSwapScalarFieldEnum: {
    id: 'id',
    network: 'network',
    transactionHash: 'transactionHash',
    eventIndex: 'eventIndex',
    blockNumber: 'blockNumber',
    blockTimestamp: 'blockTimestamp',
    sender: 'sender',
    to: 'to',
    amount0In: 'amount0In',
    amount1In: 'amount1In',
    amount0Out: 'amount0Out',
    amount1Out: 'amount1Out',
    processedAt: 'processedAt',
    pairId: 'pairId'
  };

  export type SpikeyAmmSwapScalarFieldEnum = (typeof SpikeyAmmSwapScalarFieldEnum)[keyof typeof SpikeyAmmSwapScalarFieldEnum]


  export const DexlynSwapScalarFieldEnum: {
    id: 'id',
    network: 'network',
    transactionHash: 'transactionHash',
    sequenceNumber: 'sequenceNumber',
    blockNumber: 'blockNumber',
    blockTimestamp: 'blockTimestamp',
    curve: 'curve',
    xIn: 'xIn',
    xOut: 'xOut',
    yIn: 'yIn',
    yOut: 'yOut',
    timestamp: 'timestamp',
    reserveX: 'reserveX',
    reserveY: 'reserveY',
    processedAt: 'processedAt',
    pairId: 'pairId'
  };

  export type DexlynSwapScalarFieldEnum = (typeof DexlynSwapScalarFieldEnum)[keyof typeof DexlynSwapScalarFieldEnum]


  export const TokenScalarFieldEnum: {
    id: 'id',
    network: 'network',
    address: 'address',
    wrappedAddress: 'wrappedAddress',
    symbol: 'symbol',
    name: 'name',
    decimals: 'decimals',
    createdAt: 'createdAt'
  };

  export type TokenScalarFieldEnum = (typeof TokenScalarFieldEnum)[keyof typeof TokenScalarFieldEnum]


  export const PairScalarFieldEnum: {
    id: 'id',
    network: 'network',
    token0Id: 'token0Id',
    token1Id: 'token1Id',
    spikeyAmmPairAddress: 'spikeyAmmPairAddress',
    spikeyAmmReserve0: 'spikeyAmmReserve0',
    spikeyAmmReserve1: 'spikeyAmmReserve1',
    createdAt: 'createdAt'
  };

  export type PairScalarFieldEnum = (typeof PairScalarFieldEnum)[keyof typeof PairScalarFieldEnum]


  export const OhlcDataScalarFieldEnum: {
    id: 'id',
    network: 'network',
    ammSource: 'ammSource',
    timeframe: 'timeframe',
    timestamp: 'timestamp',
    open: 'open',
    high: 'high',
    low: 'low',
    close: 'close',
    volume: 'volume',
    tradeCount: 'tradeCount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    pairId: 'pairId'
  };

  export type OhlcDataScalarFieldEnum = (typeof OhlcDataScalarFieldEnum)[keyof typeof OhlcDataScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type EventTrackingWhereInput = {
    AND?: EventTrackingWhereInput | EventTrackingWhereInput[]
    OR?: EventTrackingWhereInput[]
    NOT?: EventTrackingWhereInput | EventTrackingWhereInput[]
    id?: IntFilter<"EventTracking"> | number
    eventType?: StringFilter<"EventTracking"> | string
    blockHeight?: BigIntFilter<"EventTracking"> | bigint | number
    transactionHash?: StringFilter<"EventTracking"> | string
    processed?: BoolFilter<"EventTracking"> | boolean
    error?: StringNullableFilter<"EventTracking"> | string | null
    createdAt?: DateTimeFilter<"EventTracking"> | Date | string
    updatedAt?: DateTimeFilter<"EventTracking"> | Date | string
    network?: StringFilter<"EventTracking"> | string
    sequenceNumber?: StringNullableFilter<"EventTracking"> | string | null
  }

  export type EventTrackingOrderByWithRelationInput = {
    id?: SortOrder
    eventType?: SortOrder
    blockHeight?: SortOrder
    transactionHash?: SortOrder
    processed?: SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    network?: SortOrder
    sequenceNumber?: SortOrderInput | SortOrder
  }

  export type EventTrackingWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    network_transactionHash_sequenceNumber_eventType?: EventTrackingNetworkTransactionHashSequenceNumberEventTypeCompoundUniqueInput
    AND?: EventTrackingWhereInput | EventTrackingWhereInput[]
    OR?: EventTrackingWhereInput[]
    NOT?: EventTrackingWhereInput | EventTrackingWhereInput[]
    eventType?: StringFilter<"EventTracking"> | string
    blockHeight?: BigIntFilter<"EventTracking"> | bigint | number
    transactionHash?: StringFilter<"EventTracking"> | string
    processed?: BoolFilter<"EventTracking"> | boolean
    error?: StringNullableFilter<"EventTracking"> | string | null
    createdAt?: DateTimeFilter<"EventTracking"> | Date | string
    updatedAt?: DateTimeFilter<"EventTracking"> | Date | string
    network?: StringFilter<"EventTracking"> | string
    sequenceNumber?: StringNullableFilter<"EventTracking"> | string | null
  }, "id" | "network_transactionHash_sequenceNumber_eventType">

  export type EventTrackingOrderByWithAggregationInput = {
    id?: SortOrder
    eventType?: SortOrder
    blockHeight?: SortOrder
    transactionHash?: SortOrder
    processed?: SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    network?: SortOrder
    sequenceNumber?: SortOrderInput | SortOrder
    _count?: EventTrackingCountOrderByAggregateInput
    _avg?: EventTrackingAvgOrderByAggregateInput
    _max?: EventTrackingMaxOrderByAggregateInput
    _min?: EventTrackingMinOrderByAggregateInput
    _sum?: EventTrackingSumOrderByAggregateInput
  }

  export type EventTrackingScalarWhereWithAggregatesInput = {
    AND?: EventTrackingScalarWhereWithAggregatesInput | EventTrackingScalarWhereWithAggregatesInput[]
    OR?: EventTrackingScalarWhereWithAggregatesInput[]
    NOT?: EventTrackingScalarWhereWithAggregatesInput | EventTrackingScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"EventTracking"> | number
    eventType?: StringWithAggregatesFilter<"EventTracking"> | string
    blockHeight?: BigIntWithAggregatesFilter<"EventTracking"> | bigint | number
    transactionHash?: StringWithAggregatesFilter<"EventTracking"> | string
    processed?: BoolWithAggregatesFilter<"EventTracking"> | boolean
    error?: StringNullableWithAggregatesFilter<"EventTracking"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"EventTracking"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"EventTracking"> | Date | string
    network?: StringWithAggregatesFilter<"EventTracking"> | string
    sequenceNumber?: StringNullableWithAggregatesFilter<"EventTracking"> | string | null
  }

  export type SpikeyAmmSwapWhereInput = {
    AND?: SpikeyAmmSwapWhereInput | SpikeyAmmSwapWhereInput[]
    OR?: SpikeyAmmSwapWhereInput[]
    NOT?: SpikeyAmmSwapWhereInput | SpikeyAmmSwapWhereInput[]
    id?: IntFilter<"SpikeyAmmSwap"> | number
    network?: StringFilter<"SpikeyAmmSwap"> | string
    transactionHash?: StringFilter<"SpikeyAmmSwap"> | string
    eventIndex?: IntFilter<"SpikeyAmmSwap"> | number
    blockNumber?: BigIntFilter<"SpikeyAmmSwap"> | bigint | number
    blockTimestamp?: DateTimeFilter<"SpikeyAmmSwap"> | Date | string
    sender?: StringFilter<"SpikeyAmmSwap"> | string
    to?: StringFilter<"SpikeyAmmSwap"> | string
    amount0In?: BigIntFilter<"SpikeyAmmSwap"> | bigint | number
    amount1In?: BigIntFilter<"SpikeyAmmSwap"> | bigint | number
    amount0Out?: BigIntFilter<"SpikeyAmmSwap"> | bigint | number
    amount1Out?: BigIntFilter<"SpikeyAmmSwap"> | bigint | number
    processedAt?: DateTimeFilter<"SpikeyAmmSwap"> | Date | string
    pairId?: IntFilter<"SpikeyAmmSwap"> | number
    pair?: XOR<PairScalarRelationFilter, PairWhereInput>
  }

  export type SpikeyAmmSwapOrderByWithRelationInput = {
    id?: SortOrder
    network?: SortOrder
    transactionHash?: SortOrder
    eventIndex?: SortOrder
    blockNumber?: SortOrder
    blockTimestamp?: SortOrder
    sender?: SortOrder
    to?: SortOrder
    amount0In?: SortOrder
    amount1In?: SortOrder
    amount0Out?: SortOrder
    amount1Out?: SortOrder
    processedAt?: SortOrder
    pairId?: SortOrder
    pair?: PairOrderByWithRelationInput
  }

  export type SpikeyAmmSwapWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    network_transactionHash_eventIndex?: SpikeyAmmSwapNetworkTransactionHashEventIndexCompoundUniqueInput
    AND?: SpikeyAmmSwapWhereInput | SpikeyAmmSwapWhereInput[]
    OR?: SpikeyAmmSwapWhereInput[]
    NOT?: SpikeyAmmSwapWhereInput | SpikeyAmmSwapWhereInput[]
    network?: StringFilter<"SpikeyAmmSwap"> | string
    transactionHash?: StringFilter<"SpikeyAmmSwap"> | string
    eventIndex?: IntFilter<"SpikeyAmmSwap"> | number
    blockNumber?: BigIntFilter<"SpikeyAmmSwap"> | bigint | number
    blockTimestamp?: DateTimeFilter<"SpikeyAmmSwap"> | Date | string
    sender?: StringFilter<"SpikeyAmmSwap"> | string
    to?: StringFilter<"SpikeyAmmSwap"> | string
    amount0In?: BigIntFilter<"SpikeyAmmSwap"> | bigint | number
    amount1In?: BigIntFilter<"SpikeyAmmSwap"> | bigint | number
    amount0Out?: BigIntFilter<"SpikeyAmmSwap"> | bigint | number
    amount1Out?: BigIntFilter<"SpikeyAmmSwap"> | bigint | number
    processedAt?: DateTimeFilter<"SpikeyAmmSwap"> | Date | string
    pairId?: IntFilter<"SpikeyAmmSwap"> | number
    pair?: XOR<PairScalarRelationFilter, PairWhereInput>
  }, "id" | "network_transactionHash_eventIndex">

  export type SpikeyAmmSwapOrderByWithAggregationInput = {
    id?: SortOrder
    network?: SortOrder
    transactionHash?: SortOrder
    eventIndex?: SortOrder
    blockNumber?: SortOrder
    blockTimestamp?: SortOrder
    sender?: SortOrder
    to?: SortOrder
    amount0In?: SortOrder
    amount1In?: SortOrder
    amount0Out?: SortOrder
    amount1Out?: SortOrder
    processedAt?: SortOrder
    pairId?: SortOrder
    _count?: SpikeyAmmSwapCountOrderByAggregateInput
    _avg?: SpikeyAmmSwapAvgOrderByAggregateInput
    _max?: SpikeyAmmSwapMaxOrderByAggregateInput
    _min?: SpikeyAmmSwapMinOrderByAggregateInput
    _sum?: SpikeyAmmSwapSumOrderByAggregateInput
  }

  export type SpikeyAmmSwapScalarWhereWithAggregatesInput = {
    AND?: SpikeyAmmSwapScalarWhereWithAggregatesInput | SpikeyAmmSwapScalarWhereWithAggregatesInput[]
    OR?: SpikeyAmmSwapScalarWhereWithAggregatesInput[]
    NOT?: SpikeyAmmSwapScalarWhereWithAggregatesInput | SpikeyAmmSwapScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"SpikeyAmmSwap"> | number
    network?: StringWithAggregatesFilter<"SpikeyAmmSwap"> | string
    transactionHash?: StringWithAggregatesFilter<"SpikeyAmmSwap"> | string
    eventIndex?: IntWithAggregatesFilter<"SpikeyAmmSwap"> | number
    blockNumber?: BigIntWithAggregatesFilter<"SpikeyAmmSwap"> | bigint | number
    blockTimestamp?: DateTimeWithAggregatesFilter<"SpikeyAmmSwap"> | Date | string
    sender?: StringWithAggregatesFilter<"SpikeyAmmSwap"> | string
    to?: StringWithAggregatesFilter<"SpikeyAmmSwap"> | string
    amount0In?: BigIntWithAggregatesFilter<"SpikeyAmmSwap"> | bigint | number
    amount1In?: BigIntWithAggregatesFilter<"SpikeyAmmSwap"> | bigint | number
    amount0Out?: BigIntWithAggregatesFilter<"SpikeyAmmSwap"> | bigint | number
    amount1Out?: BigIntWithAggregatesFilter<"SpikeyAmmSwap"> | bigint | number
    processedAt?: DateTimeWithAggregatesFilter<"SpikeyAmmSwap"> | Date | string
    pairId?: IntWithAggregatesFilter<"SpikeyAmmSwap"> | number
  }

  export type DexlynSwapWhereInput = {
    AND?: DexlynSwapWhereInput | DexlynSwapWhereInput[]
    OR?: DexlynSwapWhereInput[]
    NOT?: DexlynSwapWhereInput | DexlynSwapWhereInput[]
    id?: IntFilter<"DexlynSwap"> | number
    network?: StringFilter<"DexlynSwap"> | string
    transactionHash?: StringFilter<"DexlynSwap"> | string
    sequenceNumber?: StringFilter<"DexlynSwap"> | string
    blockNumber?: BigIntFilter<"DexlynSwap"> | bigint | number
    blockTimestamp?: DateTimeFilter<"DexlynSwap"> | Date | string
    curve?: StringFilter<"DexlynSwap"> | string
    xIn?: BigIntFilter<"DexlynSwap"> | bigint | number
    xOut?: BigIntFilter<"DexlynSwap"> | bigint | number
    yIn?: BigIntFilter<"DexlynSwap"> | bigint | number
    yOut?: BigIntFilter<"DexlynSwap"> | bigint | number
    timestamp?: BigIntFilter<"DexlynSwap"> | bigint | number
    reserveX?: BigIntFilter<"DexlynSwap"> | bigint | number
    reserveY?: BigIntFilter<"DexlynSwap"> | bigint | number
    processedAt?: DateTimeFilter<"DexlynSwap"> | Date | string
    pairId?: IntFilter<"DexlynSwap"> | number
    pair?: XOR<PairScalarRelationFilter, PairWhereInput>
  }

  export type DexlynSwapOrderByWithRelationInput = {
    id?: SortOrder
    network?: SortOrder
    transactionHash?: SortOrder
    sequenceNumber?: SortOrder
    blockNumber?: SortOrder
    blockTimestamp?: SortOrder
    curve?: SortOrder
    xIn?: SortOrder
    xOut?: SortOrder
    yIn?: SortOrder
    yOut?: SortOrder
    timestamp?: SortOrder
    reserveX?: SortOrder
    reserveY?: SortOrder
    processedAt?: SortOrder
    pairId?: SortOrder
    pair?: PairOrderByWithRelationInput
  }

  export type DexlynSwapWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    network_transactionHash_sequenceNumber?: DexlynSwapNetworkTransactionHashSequenceNumberCompoundUniqueInput
    AND?: DexlynSwapWhereInput | DexlynSwapWhereInput[]
    OR?: DexlynSwapWhereInput[]
    NOT?: DexlynSwapWhereInput | DexlynSwapWhereInput[]
    network?: StringFilter<"DexlynSwap"> | string
    transactionHash?: StringFilter<"DexlynSwap"> | string
    sequenceNumber?: StringFilter<"DexlynSwap"> | string
    blockNumber?: BigIntFilter<"DexlynSwap"> | bigint | number
    blockTimestamp?: DateTimeFilter<"DexlynSwap"> | Date | string
    curve?: StringFilter<"DexlynSwap"> | string
    xIn?: BigIntFilter<"DexlynSwap"> | bigint | number
    xOut?: BigIntFilter<"DexlynSwap"> | bigint | number
    yIn?: BigIntFilter<"DexlynSwap"> | bigint | number
    yOut?: BigIntFilter<"DexlynSwap"> | bigint | number
    timestamp?: BigIntFilter<"DexlynSwap"> | bigint | number
    reserveX?: BigIntFilter<"DexlynSwap"> | bigint | number
    reserveY?: BigIntFilter<"DexlynSwap"> | bigint | number
    processedAt?: DateTimeFilter<"DexlynSwap"> | Date | string
    pairId?: IntFilter<"DexlynSwap"> | number
    pair?: XOR<PairScalarRelationFilter, PairWhereInput>
  }, "id" | "network_transactionHash_sequenceNumber">

  export type DexlynSwapOrderByWithAggregationInput = {
    id?: SortOrder
    network?: SortOrder
    transactionHash?: SortOrder
    sequenceNumber?: SortOrder
    blockNumber?: SortOrder
    blockTimestamp?: SortOrder
    curve?: SortOrder
    xIn?: SortOrder
    xOut?: SortOrder
    yIn?: SortOrder
    yOut?: SortOrder
    timestamp?: SortOrder
    reserveX?: SortOrder
    reserveY?: SortOrder
    processedAt?: SortOrder
    pairId?: SortOrder
    _count?: DexlynSwapCountOrderByAggregateInput
    _avg?: DexlynSwapAvgOrderByAggregateInput
    _max?: DexlynSwapMaxOrderByAggregateInput
    _min?: DexlynSwapMinOrderByAggregateInput
    _sum?: DexlynSwapSumOrderByAggregateInput
  }

  export type DexlynSwapScalarWhereWithAggregatesInput = {
    AND?: DexlynSwapScalarWhereWithAggregatesInput | DexlynSwapScalarWhereWithAggregatesInput[]
    OR?: DexlynSwapScalarWhereWithAggregatesInput[]
    NOT?: DexlynSwapScalarWhereWithAggregatesInput | DexlynSwapScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"DexlynSwap"> | number
    network?: StringWithAggregatesFilter<"DexlynSwap"> | string
    transactionHash?: StringWithAggregatesFilter<"DexlynSwap"> | string
    sequenceNumber?: StringWithAggregatesFilter<"DexlynSwap"> | string
    blockNumber?: BigIntWithAggregatesFilter<"DexlynSwap"> | bigint | number
    blockTimestamp?: DateTimeWithAggregatesFilter<"DexlynSwap"> | Date | string
    curve?: StringWithAggregatesFilter<"DexlynSwap"> | string
    xIn?: BigIntWithAggregatesFilter<"DexlynSwap"> | bigint | number
    xOut?: BigIntWithAggregatesFilter<"DexlynSwap"> | bigint | number
    yIn?: BigIntWithAggregatesFilter<"DexlynSwap"> | bigint | number
    yOut?: BigIntWithAggregatesFilter<"DexlynSwap"> | bigint | number
    timestamp?: BigIntWithAggregatesFilter<"DexlynSwap"> | bigint | number
    reserveX?: BigIntWithAggregatesFilter<"DexlynSwap"> | bigint | number
    reserveY?: BigIntWithAggregatesFilter<"DexlynSwap"> | bigint | number
    processedAt?: DateTimeWithAggregatesFilter<"DexlynSwap"> | Date | string
    pairId?: IntWithAggregatesFilter<"DexlynSwap"> | number
  }

  export type TokenWhereInput = {
    AND?: TokenWhereInput | TokenWhereInput[]
    OR?: TokenWhereInput[]
    NOT?: TokenWhereInput | TokenWhereInput[]
    id?: IntFilter<"Token"> | number
    network?: StringFilter<"Token"> | string
    address?: StringFilter<"Token"> | string
    wrappedAddress?: StringNullableFilter<"Token"> | string | null
    symbol?: StringFilter<"Token"> | string
    name?: StringFilter<"Token"> | string
    decimals?: IntFilter<"Token"> | number
    createdAt?: DateTimeFilter<"Token"> | Date | string
    pairsAsToken0?: PairListRelationFilter
    pairsAsToken1?: PairListRelationFilter
  }

  export type TokenOrderByWithRelationInput = {
    id?: SortOrder
    network?: SortOrder
    address?: SortOrder
    wrappedAddress?: SortOrderInput | SortOrder
    symbol?: SortOrder
    name?: SortOrder
    decimals?: SortOrder
    createdAt?: SortOrder
    pairsAsToken0?: PairOrderByRelationAggregateInput
    pairsAsToken1?: PairOrderByRelationAggregateInput
  }

  export type TokenWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    wrappedAddress?: string
    network_address?: TokenNetworkAddressCompoundUniqueInput
    AND?: TokenWhereInput | TokenWhereInput[]
    OR?: TokenWhereInput[]
    NOT?: TokenWhereInput | TokenWhereInput[]
    network?: StringFilter<"Token"> | string
    address?: StringFilter<"Token"> | string
    symbol?: StringFilter<"Token"> | string
    name?: StringFilter<"Token"> | string
    decimals?: IntFilter<"Token"> | number
    createdAt?: DateTimeFilter<"Token"> | Date | string
    pairsAsToken0?: PairListRelationFilter
    pairsAsToken1?: PairListRelationFilter
  }, "id" | "wrappedAddress" | "network_address">

  export type TokenOrderByWithAggregationInput = {
    id?: SortOrder
    network?: SortOrder
    address?: SortOrder
    wrappedAddress?: SortOrderInput | SortOrder
    symbol?: SortOrder
    name?: SortOrder
    decimals?: SortOrder
    createdAt?: SortOrder
    _count?: TokenCountOrderByAggregateInput
    _avg?: TokenAvgOrderByAggregateInput
    _max?: TokenMaxOrderByAggregateInput
    _min?: TokenMinOrderByAggregateInput
    _sum?: TokenSumOrderByAggregateInput
  }

  export type TokenScalarWhereWithAggregatesInput = {
    AND?: TokenScalarWhereWithAggregatesInput | TokenScalarWhereWithAggregatesInput[]
    OR?: TokenScalarWhereWithAggregatesInput[]
    NOT?: TokenScalarWhereWithAggregatesInput | TokenScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Token"> | number
    network?: StringWithAggregatesFilter<"Token"> | string
    address?: StringWithAggregatesFilter<"Token"> | string
    wrappedAddress?: StringNullableWithAggregatesFilter<"Token"> | string | null
    symbol?: StringWithAggregatesFilter<"Token"> | string
    name?: StringWithAggregatesFilter<"Token"> | string
    decimals?: IntWithAggregatesFilter<"Token"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Token"> | Date | string
  }

  export type PairWhereInput = {
    AND?: PairWhereInput | PairWhereInput[]
    OR?: PairWhereInput[]
    NOT?: PairWhereInput | PairWhereInput[]
    id?: IntFilter<"Pair"> | number
    network?: StringFilter<"Pair"> | string
    token0Id?: IntFilter<"Pair"> | number
    token1Id?: IntFilter<"Pair"> | number
    spikeyAmmPairAddress?: StringNullableFilter<"Pair"> | string | null
    spikeyAmmReserve0?: BigIntNullableFilter<"Pair"> | bigint | number | null
    spikeyAmmReserve1?: BigIntNullableFilter<"Pair"> | bigint | number | null
    createdAt?: DateTimeFilter<"Pair"> | Date | string
    token0?: XOR<TokenScalarRelationFilter, TokenWhereInput>
    token1?: XOR<TokenScalarRelationFilter, TokenWhereInput>
    spikeyAmmSwaps?: SpikeyAmmSwapListRelationFilter
    dexlynSwaps?: DexlynSwapListRelationFilter
    ohlcData?: OhlcDataListRelationFilter
  }

  export type PairOrderByWithRelationInput = {
    id?: SortOrder
    network?: SortOrder
    token0Id?: SortOrder
    token1Id?: SortOrder
    spikeyAmmPairAddress?: SortOrderInput | SortOrder
    spikeyAmmReserve0?: SortOrderInput | SortOrder
    spikeyAmmReserve1?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    token0?: TokenOrderByWithRelationInput
    token1?: TokenOrderByWithRelationInput
    spikeyAmmSwaps?: SpikeyAmmSwapOrderByRelationAggregateInput
    dexlynSwaps?: DexlynSwapOrderByRelationAggregateInput
    ohlcData?: OhlcDataOrderByRelationAggregateInput
  }

  export type PairWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    network_token0Id_token1Id?: PairNetworkToken0IdToken1IdCompoundUniqueInput
    network_spikeyAmmPairAddress?: PairNetworkSpikeyAmmPairAddressCompoundUniqueInput
    AND?: PairWhereInput | PairWhereInput[]
    OR?: PairWhereInput[]
    NOT?: PairWhereInput | PairWhereInput[]
    network?: StringFilter<"Pair"> | string
    token0Id?: IntFilter<"Pair"> | number
    token1Id?: IntFilter<"Pair"> | number
    spikeyAmmPairAddress?: StringNullableFilter<"Pair"> | string | null
    spikeyAmmReserve0?: BigIntNullableFilter<"Pair"> | bigint | number | null
    spikeyAmmReserve1?: BigIntNullableFilter<"Pair"> | bigint | number | null
    createdAt?: DateTimeFilter<"Pair"> | Date | string
    token0?: XOR<TokenScalarRelationFilter, TokenWhereInput>
    token1?: XOR<TokenScalarRelationFilter, TokenWhereInput>
    spikeyAmmSwaps?: SpikeyAmmSwapListRelationFilter
    dexlynSwaps?: DexlynSwapListRelationFilter
    ohlcData?: OhlcDataListRelationFilter
  }, "id" | "network_token0Id_token1Id" | "network_spikeyAmmPairAddress">

  export type PairOrderByWithAggregationInput = {
    id?: SortOrder
    network?: SortOrder
    token0Id?: SortOrder
    token1Id?: SortOrder
    spikeyAmmPairAddress?: SortOrderInput | SortOrder
    spikeyAmmReserve0?: SortOrderInput | SortOrder
    spikeyAmmReserve1?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: PairCountOrderByAggregateInput
    _avg?: PairAvgOrderByAggregateInput
    _max?: PairMaxOrderByAggregateInput
    _min?: PairMinOrderByAggregateInput
    _sum?: PairSumOrderByAggregateInput
  }

  export type PairScalarWhereWithAggregatesInput = {
    AND?: PairScalarWhereWithAggregatesInput | PairScalarWhereWithAggregatesInput[]
    OR?: PairScalarWhereWithAggregatesInput[]
    NOT?: PairScalarWhereWithAggregatesInput | PairScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Pair"> | number
    network?: StringWithAggregatesFilter<"Pair"> | string
    token0Id?: IntWithAggregatesFilter<"Pair"> | number
    token1Id?: IntWithAggregatesFilter<"Pair"> | number
    spikeyAmmPairAddress?: StringNullableWithAggregatesFilter<"Pair"> | string | null
    spikeyAmmReserve0?: BigIntNullableWithAggregatesFilter<"Pair"> | bigint | number | null
    spikeyAmmReserve1?: BigIntNullableWithAggregatesFilter<"Pair"> | bigint | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Pair"> | Date | string
  }

  export type OhlcDataWhereInput = {
    AND?: OhlcDataWhereInput | OhlcDataWhereInput[]
    OR?: OhlcDataWhereInput[]
    NOT?: OhlcDataWhereInput | OhlcDataWhereInput[]
    id?: IntFilter<"OhlcData"> | number
    network?: StringFilter<"OhlcData"> | string
    ammSource?: StringFilter<"OhlcData"> | string
    timeframe?: StringFilter<"OhlcData"> | string
    timestamp?: DateTimeFilter<"OhlcData"> | Date | string
    open?: DecimalFilter<"OhlcData"> | Decimal | DecimalJsLike | number | string
    high?: DecimalFilter<"OhlcData"> | Decimal | DecimalJsLike | number | string
    low?: DecimalFilter<"OhlcData"> | Decimal | DecimalJsLike | number | string
    close?: DecimalFilter<"OhlcData"> | Decimal | DecimalJsLike | number | string
    volume?: DecimalFilter<"OhlcData"> | Decimal | DecimalJsLike | number | string
    tradeCount?: IntFilter<"OhlcData"> | number
    createdAt?: DateTimeFilter<"OhlcData"> | Date | string
    updatedAt?: DateTimeFilter<"OhlcData"> | Date | string
    pairId?: IntFilter<"OhlcData"> | number
    pair?: XOR<PairScalarRelationFilter, PairWhereInput>
  }

  export type OhlcDataOrderByWithRelationInput = {
    id?: SortOrder
    network?: SortOrder
    ammSource?: SortOrder
    timeframe?: SortOrder
    timestamp?: SortOrder
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
    tradeCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    pairId?: SortOrder
    pair?: PairOrderByWithRelationInput
  }

  export type OhlcDataWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    network_ammSource_pairId_timeframe_timestamp?: OhlcDataNetworkAmmSourcePairIdTimeframeTimestampCompoundUniqueInput
    AND?: OhlcDataWhereInput | OhlcDataWhereInput[]
    OR?: OhlcDataWhereInput[]
    NOT?: OhlcDataWhereInput | OhlcDataWhereInput[]
    network?: StringFilter<"OhlcData"> | string
    ammSource?: StringFilter<"OhlcData"> | string
    timeframe?: StringFilter<"OhlcData"> | string
    timestamp?: DateTimeFilter<"OhlcData"> | Date | string
    open?: DecimalFilter<"OhlcData"> | Decimal | DecimalJsLike | number | string
    high?: DecimalFilter<"OhlcData"> | Decimal | DecimalJsLike | number | string
    low?: DecimalFilter<"OhlcData"> | Decimal | DecimalJsLike | number | string
    close?: DecimalFilter<"OhlcData"> | Decimal | DecimalJsLike | number | string
    volume?: DecimalFilter<"OhlcData"> | Decimal | DecimalJsLike | number | string
    tradeCount?: IntFilter<"OhlcData"> | number
    createdAt?: DateTimeFilter<"OhlcData"> | Date | string
    updatedAt?: DateTimeFilter<"OhlcData"> | Date | string
    pairId?: IntFilter<"OhlcData"> | number
    pair?: XOR<PairScalarRelationFilter, PairWhereInput>
  }, "id" | "network_ammSource_pairId_timeframe_timestamp">

  export type OhlcDataOrderByWithAggregationInput = {
    id?: SortOrder
    network?: SortOrder
    ammSource?: SortOrder
    timeframe?: SortOrder
    timestamp?: SortOrder
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
    tradeCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    pairId?: SortOrder
    _count?: OhlcDataCountOrderByAggregateInput
    _avg?: OhlcDataAvgOrderByAggregateInput
    _max?: OhlcDataMaxOrderByAggregateInput
    _min?: OhlcDataMinOrderByAggregateInput
    _sum?: OhlcDataSumOrderByAggregateInput
  }

  export type OhlcDataScalarWhereWithAggregatesInput = {
    AND?: OhlcDataScalarWhereWithAggregatesInput | OhlcDataScalarWhereWithAggregatesInput[]
    OR?: OhlcDataScalarWhereWithAggregatesInput[]
    NOT?: OhlcDataScalarWhereWithAggregatesInput | OhlcDataScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"OhlcData"> | number
    network?: StringWithAggregatesFilter<"OhlcData"> | string
    ammSource?: StringWithAggregatesFilter<"OhlcData"> | string
    timeframe?: StringWithAggregatesFilter<"OhlcData"> | string
    timestamp?: DateTimeWithAggregatesFilter<"OhlcData"> | Date | string
    open?: DecimalWithAggregatesFilter<"OhlcData"> | Decimal | DecimalJsLike | number | string
    high?: DecimalWithAggregatesFilter<"OhlcData"> | Decimal | DecimalJsLike | number | string
    low?: DecimalWithAggregatesFilter<"OhlcData"> | Decimal | DecimalJsLike | number | string
    close?: DecimalWithAggregatesFilter<"OhlcData"> | Decimal | DecimalJsLike | number | string
    volume?: DecimalWithAggregatesFilter<"OhlcData"> | Decimal | DecimalJsLike | number | string
    tradeCount?: IntWithAggregatesFilter<"OhlcData"> | number
    createdAt?: DateTimeWithAggregatesFilter<"OhlcData"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"OhlcData"> | Date | string
    pairId?: IntWithAggregatesFilter<"OhlcData"> | number
  }

  export type EventTrackingCreateInput = {
    eventType: string
    blockHeight: bigint | number
    transactionHash: string
    processed?: boolean
    error?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    network: string
    sequenceNumber?: string | null
  }

  export type EventTrackingUncheckedCreateInput = {
    id?: number
    eventType: string
    blockHeight: bigint | number
    transactionHash: string
    processed?: boolean
    error?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    network: string
    sequenceNumber?: string | null
  }

  export type EventTrackingUpdateInput = {
    eventType?: StringFieldUpdateOperationsInput | string
    blockHeight?: BigIntFieldUpdateOperationsInput | bigint | number
    transactionHash?: StringFieldUpdateOperationsInput | string
    processed?: BoolFieldUpdateOperationsInput | boolean
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    network?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EventTrackingUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    eventType?: StringFieldUpdateOperationsInput | string
    blockHeight?: BigIntFieldUpdateOperationsInput | bigint | number
    transactionHash?: StringFieldUpdateOperationsInput | string
    processed?: BoolFieldUpdateOperationsInput | boolean
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    network?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EventTrackingCreateManyInput = {
    id?: number
    eventType: string
    blockHeight: bigint | number
    transactionHash: string
    processed?: boolean
    error?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    network: string
    sequenceNumber?: string | null
  }

  export type EventTrackingUpdateManyMutationInput = {
    eventType?: StringFieldUpdateOperationsInput | string
    blockHeight?: BigIntFieldUpdateOperationsInput | bigint | number
    transactionHash?: StringFieldUpdateOperationsInput | string
    processed?: BoolFieldUpdateOperationsInput | boolean
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    network?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EventTrackingUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    eventType?: StringFieldUpdateOperationsInput | string
    blockHeight?: BigIntFieldUpdateOperationsInput | bigint | number
    transactionHash?: StringFieldUpdateOperationsInput | string
    processed?: BoolFieldUpdateOperationsInput | boolean
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    network?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SpikeyAmmSwapCreateInput = {
    network: string
    transactionHash: string
    eventIndex: number
    blockNumber: bigint | number
    blockTimestamp: Date | string
    sender: string
    to: string
    amount0In: bigint | number
    amount1In: bigint | number
    amount0Out: bigint | number
    amount1Out: bigint | number
    processedAt?: Date | string
    pair: PairCreateNestedOneWithoutSpikeyAmmSwapsInput
  }

  export type SpikeyAmmSwapUncheckedCreateInput = {
    id?: number
    network: string
    transactionHash: string
    eventIndex: number
    blockNumber: bigint | number
    blockTimestamp: Date | string
    sender: string
    to: string
    amount0In: bigint | number
    amount1In: bigint | number
    amount0Out: bigint | number
    amount1Out: bigint | number
    processedAt?: Date | string
    pairId: number
  }

  export type SpikeyAmmSwapUpdateInput = {
    network?: StringFieldUpdateOperationsInput | string
    transactionHash?: StringFieldUpdateOperationsInput | string
    eventIndex?: IntFieldUpdateOperationsInput | number
    blockNumber?: BigIntFieldUpdateOperationsInput | bigint | number
    blockTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    sender?: StringFieldUpdateOperationsInput | string
    to?: StringFieldUpdateOperationsInput | string
    amount0In?: BigIntFieldUpdateOperationsInput | bigint | number
    amount1In?: BigIntFieldUpdateOperationsInput | bigint | number
    amount0Out?: BigIntFieldUpdateOperationsInput | bigint | number
    amount1Out?: BigIntFieldUpdateOperationsInput | bigint | number
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pair?: PairUpdateOneRequiredWithoutSpikeyAmmSwapsNestedInput
  }

  export type SpikeyAmmSwapUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    network?: StringFieldUpdateOperationsInput | string
    transactionHash?: StringFieldUpdateOperationsInput | string
    eventIndex?: IntFieldUpdateOperationsInput | number
    blockNumber?: BigIntFieldUpdateOperationsInput | bigint | number
    blockTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    sender?: StringFieldUpdateOperationsInput | string
    to?: StringFieldUpdateOperationsInput | string
    amount0In?: BigIntFieldUpdateOperationsInput | bigint | number
    amount1In?: BigIntFieldUpdateOperationsInput | bigint | number
    amount0Out?: BigIntFieldUpdateOperationsInput | bigint | number
    amount1Out?: BigIntFieldUpdateOperationsInput | bigint | number
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pairId?: IntFieldUpdateOperationsInput | number
  }

  export type SpikeyAmmSwapCreateManyInput = {
    id?: number
    network: string
    transactionHash: string
    eventIndex: number
    blockNumber: bigint | number
    blockTimestamp: Date | string
    sender: string
    to: string
    amount0In: bigint | number
    amount1In: bigint | number
    amount0Out: bigint | number
    amount1Out: bigint | number
    processedAt?: Date | string
    pairId: number
  }

  export type SpikeyAmmSwapUpdateManyMutationInput = {
    network?: StringFieldUpdateOperationsInput | string
    transactionHash?: StringFieldUpdateOperationsInput | string
    eventIndex?: IntFieldUpdateOperationsInput | number
    blockNumber?: BigIntFieldUpdateOperationsInput | bigint | number
    blockTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    sender?: StringFieldUpdateOperationsInput | string
    to?: StringFieldUpdateOperationsInput | string
    amount0In?: BigIntFieldUpdateOperationsInput | bigint | number
    amount1In?: BigIntFieldUpdateOperationsInput | bigint | number
    amount0Out?: BigIntFieldUpdateOperationsInput | bigint | number
    amount1Out?: BigIntFieldUpdateOperationsInput | bigint | number
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SpikeyAmmSwapUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    network?: StringFieldUpdateOperationsInput | string
    transactionHash?: StringFieldUpdateOperationsInput | string
    eventIndex?: IntFieldUpdateOperationsInput | number
    blockNumber?: BigIntFieldUpdateOperationsInput | bigint | number
    blockTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    sender?: StringFieldUpdateOperationsInput | string
    to?: StringFieldUpdateOperationsInput | string
    amount0In?: BigIntFieldUpdateOperationsInput | bigint | number
    amount1In?: BigIntFieldUpdateOperationsInput | bigint | number
    amount0Out?: BigIntFieldUpdateOperationsInput | bigint | number
    amount1Out?: BigIntFieldUpdateOperationsInput | bigint | number
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pairId?: IntFieldUpdateOperationsInput | number
  }

  export type DexlynSwapCreateInput = {
    network: string
    transactionHash: string
    sequenceNumber: string
    blockNumber: bigint | number
    blockTimestamp: Date | string
    curve: string
    xIn: bigint | number
    xOut: bigint | number
    yIn: bigint | number
    yOut: bigint | number
    timestamp: bigint | number
    reserveX: bigint | number
    reserveY: bigint | number
    processedAt?: Date | string
    pair: PairCreateNestedOneWithoutDexlynSwapsInput
  }

  export type DexlynSwapUncheckedCreateInput = {
    id?: number
    network: string
    transactionHash: string
    sequenceNumber: string
    blockNumber: bigint | number
    blockTimestamp: Date | string
    curve: string
    xIn: bigint | number
    xOut: bigint | number
    yIn: bigint | number
    yOut: bigint | number
    timestamp: bigint | number
    reserveX: bigint | number
    reserveY: bigint | number
    processedAt?: Date | string
    pairId: number
  }

  export type DexlynSwapUpdateInput = {
    network?: StringFieldUpdateOperationsInput | string
    transactionHash?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: StringFieldUpdateOperationsInput | string
    blockNumber?: BigIntFieldUpdateOperationsInput | bigint | number
    blockTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    curve?: StringFieldUpdateOperationsInput | string
    xIn?: BigIntFieldUpdateOperationsInput | bigint | number
    xOut?: BigIntFieldUpdateOperationsInput | bigint | number
    yIn?: BigIntFieldUpdateOperationsInput | bigint | number
    yOut?: BigIntFieldUpdateOperationsInput | bigint | number
    timestamp?: BigIntFieldUpdateOperationsInput | bigint | number
    reserveX?: BigIntFieldUpdateOperationsInput | bigint | number
    reserveY?: BigIntFieldUpdateOperationsInput | bigint | number
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pair?: PairUpdateOneRequiredWithoutDexlynSwapsNestedInput
  }

  export type DexlynSwapUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    network?: StringFieldUpdateOperationsInput | string
    transactionHash?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: StringFieldUpdateOperationsInput | string
    blockNumber?: BigIntFieldUpdateOperationsInput | bigint | number
    blockTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    curve?: StringFieldUpdateOperationsInput | string
    xIn?: BigIntFieldUpdateOperationsInput | bigint | number
    xOut?: BigIntFieldUpdateOperationsInput | bigint | number
    yIn?: BigIntFieldUpdateOperationsInput | bigint | number
    yOut?: BigIntFieldUpdateOperationsInput | bigint | number
    timestamp?: BigIntFieldUpdateOperationsInput | bigint | number
    reserveX?: BigIntFieldUpdateOperationsInput | bigint | number
    reserveY?: BigIntFieldUpdateOperationsInput | bigint | number
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pairId?: IntFieldUpdateOperationsInput | number
  }

  export type DexlynSwapCreateManyInput = {
    id?: number
    network: string
    transactionHash: string
    sequenceNumber: string
    blockNumber: bigint | number
    blockTimestamp: Date | string
    curve: string
    xIn: bigint | number
    xOut: bigint | number
    yIn: bigint | number
    yOut: bigint | number
    timestamp: bigint | number
    reserveX: bigint | number
    reserveY: bigint | number
    processedAt?: Date | string
    pairId: number
  }

  export type DexlynSwapUpdateManyMutationInput = {
    network?: StringFieldUpdateOperationsInput | string
    transactionHash?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: StringFieldUpdateOperationsInput | string
    blockNumber?: BigIntFieldUpdateOperationsInput | bigint | number
    blockTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    curve?: StringFieldUpdateOperationsInput | string
    xIn?: BigIntFieldUpdateOperationsInput | bigint | number
    xOut?: BigIntFieldUpdateOperationsInput | bigint | number
    yIn?: BigIntFieldUpdateOperationsInput | bigint | number
    yOut?: BigIntFieldUpdateOperationsInput | bigint | number
    timestamp?: BigIntFieldUpdateOperationsInput | bigint | number
    reserveX?: BigIntFieldUpdateOperationsInput | bigint | number
    reserveY?: BigIntFieldUpdateOperationsInput | bigint | number
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DexlynSwapUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    network?: StringFieldUpdateOperationsInput | string
    transactionHash?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: StringFieldUpdateOperationsInput | string
    blockNumber?: BigIntFieldUpdateOperationsInput | bigint | number
    blockTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    curve?: StringFieldUpdateOperationsInput | string
    xIn?: BigIntFieldUpdateOperationsInput | bigint | number
    xOut?: BigIntFieldUpdateOperationsInput | bigint | number
    yIn?: BigIntFieldUpdateOperationsInput | bigint | number
    yOut?: BigIntFieldUpdateOperationsInput | bigint | number
    timestamp?: BigIntFieldUpdateOperationsInput | bigint | number
    reserveX?: BigIntFieldUpdateOperationsInput | bigint | number
    reserveY?: BigIntFieldUpdateOperationsInput | bigint | number
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pairId?: IntFieldUpdateOperationsInput | number
  }

  export type TokenCreateInput = {
    network: string
    address: string
    wrappedAddress?: string | null
    symbol: string
    name: string
    decimals: number
    createdAt?: Date | string
    pairsAsToken0?: PairCreateNestedManyWithoutToken0Input
    pairsAsToken1?: PairCreateNestedManyWithoutToken1Input
  }

  export type TokenUncheckedCreateInput = {
    id?: number
    network: string
    address: string
    wrappedAddress?: string | null
    symbol: string
    name: string
    decimals: number
    createdAt?: Date | string
    pairsAsToken0?: PairUncheckedCreateNestedManyWithoutToken0Input
    pairsAsToken1?: PairUncheckedCreateNestedManyWithoutToken1Input
  }

  export type TokenUpdateInput = {
    network?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    wrappedAddress?: NullableStringFieldUpdateOperationsInput | string | null
    symbol?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    decimals?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pairsAsToken0?: PairUpdateManyWithoutToken0NestedInput
    pairsAsToken1?: PairUpdateManyWithoutToken1NestedInput
  }

  export type TokenUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    network?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    wrappedAddress?: NullableStringFieldUpdateOperationsInput | string | null
    symbol?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    decimals?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pairsAsToken0?: PairUncheckedUpdateManyWithoutToken0NestedInput
    pairsAsToken1?: PairUncheckedUpdateManyWithoutToken1NestedInput
  }

  export type TokenCreateManyInput = {
    id?: number
    network: string
    address: string
    wrappedAddress?: string | null
    symbol: string
    name: string
    decimals: number
    createdAt?: Date | string
  }

  export type TokenUpdateManyMutationInput = {
    network?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    wrappedAddress?: NullableStringFieldUpdateOperationsInput | string | null
    symbol?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    decimals?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    network?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    wrappedAddress?: NullableStringFieldUpdateOperationsInput | string | null
    symbol?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    decimals?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PairCreateInput = {
    network: string
    spikeyAmmPairAddress?: string | null
    spikeyAmmReserve0?: bigint | number | null
    spikeyAmmReserve1?: bigint | number | null
    createdAt?: Date | string
    token0: TokenCreateNestedOneWithoutPairsAsToken0Input
    token1: TokenCreateNestedOneWithoutPairsAsToken1Input
    spikeyAmmSwaps?: SpikeyAmmSwapCreateNestedManyWithoutPairInput
    dexlynSwaps?: DexlynSwapCreateNestedManyWithoutPairInput
    ohlcData?: OhlcDataCreateNestedManyWithoutPairInput
  }

  export type PairUncheckedCreateInput = {
    id?: number
    network: string
    token0Id: number
    token1Id: number
    spikeyAmmPairAddress?: string | null
    spikeyAmmReserve0?: bigint | number | null
    spikeyAmmReserve1?: bigint | number | null
    createdAt?: Date | string
    spikeyAmmSwaps?: SpikeyAmmSwapUncheckedCreateNestedManyWithoutPairInput
    dexlynSwaps?: DexlynSwapUncheckedCreateNestedManyWithoutPairInput
    ohlcData?: OhlcDataUncheckedCreateNestedManyWithoutPairInput
  }

  export type PairUpdateInput = {
    network?: StringFieldUpdateOperationsInput | string
    spikeyAmmPairAddress?: NullableStringFieldUpdateOperationsInput | string | null
    spikeyAmmReserve0?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    spikeyAmmReserve1?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token0?: TokenUpdateOneRequiredWithoutPairsAsToken0NestedInput
    token1?: TokenUpdateOneRequiredWithoutPairsAsToken1NestedInput
    spikeyAmmSwaps?: SpikeyAmmSwapUpdateManyWithoutPairNestedInput
    dexlynSwaps?: DexlynSwapUpdateManyWithoutPairNestedInput
    ohlcData?: OhlcDataUpdateManyWithoutPairNestedInput
  }

  export type PairUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    network?: StringFieldUpdateOperationsInput | string
    token0Id?: IntFieldUpdateOperationsInput | number
    token1Id?: IntFieldUpdateOperationsInput | number
    spikeyAmmPairAddress?: NullableStringFieldUpdateOperationsInput | string | null
    spikeyAmmReserve0?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    spikeyAmmReserve1?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    spikeyAmmSwaps?: SpikeyAmmSwapUncheckedUpdateManyWithoutPairNestedInput
    dexlynSwaps?: DexlynSwapUncheckedUpdateManyWithoutPairNestedInput
    ohlcData?: OhlcDataUncheckedUpdateManyWithoutPairNestedInput
  }

  export type PairCreateManyInput = {
    id?: number
    network: string
    token0Id: number
    token1Id: number
    spikeyAmmPairAddress?: string | null
    spikeyAmmReserve0?: bigint | number | null
    spikeyAmmReserve1?: bigint | number | null
    createdAt?: Date | string
  }

  export type PairUpdateManyMutationInput = {
    network?: StringFieldUpdateOperationsInput | string
    spikeyAmmPairAddress?: NullableStringFieldUpdateOperationsInput | string | null
    spikeyAmmReserve0?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    spikeyAmmReserve1?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PairUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    network?: StringFieldUpdateOperationsInput | string
    token0Id?: IntFieldUpdateOperationsInput | number
    token1Id?: IntFieldUpdateOperationsInput | number
    spikeyAmmPairAddress?: NullableStringFieldUpdateOperationsInput | string | null
    spikeyAmmReserve0?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    spikeyAmmReserve1?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OhlcDataCreateInput = {
    network: string
    ammSource: string
    timeframe: string
    timestamp: Date | string
    open: Decimal | DecimalJsLike | number | string
    high: Decimal | DecimalJsLike | number | string
    low: Decimal | DecimalJsLike | number | string
    close: Decimal | DecimalJsLike | number | string
    volume: Decimal | DecimalJsLike | number | string
    tradeCount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    pair: PairCreateNestedOneWithoutOhlcDataInput
  }

  export type OhlcDataUncheckedCreateInput = {
    id?: number
    network: string
    ammSource: string
    timeframe: string
    timestamp: Date | string
    open: Decimal | DecimalJsLike | number | string
    high: Decimal | DecimalJsLike | number | string
    low: Decimal | DecimalJsLike | number | string
    close: Decimal | DecimalJsLike | number | string
    volume: Decimal | DecimalJsLike | number | string
    tradeCount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    pairId: number
  }

  export type OhlcDataUpdateInput = {
    network?: StringFieldUpdateOperationsInput | string
    ammSource?: StringFieldUpdateOperationsInput | string
    timeframe?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    open?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    high?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    low?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    close?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volume?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tradeCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pair?: PairUpdateOneRequiredWithoutOhlcDataNestedInput
  }

  export type OhlcDataUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    network?: StringFieldUpdateOperationsInput | string
    ammSource?: StringFieldUpdateOperationsInput | string
    timeframe?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    open?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    high?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    low?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    close?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volume?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tradeCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pairId?: IntFieldUpdateOperationsInput | number
  }

  export type OhlcDataCreateManyInput = {
    id?: number
    network: string
    ammSource: string
    timeframe: string
    timestamp: Date | string
    open: Decimal | DecimalJsLike | number | string
    high: Decimal | DecimalJsLike | number | string
    low: Decimal | DecimalJsLike | number | string
    close: Decimal | DecimalJsLike | number | string
    volume: Decimal | DecimalJsLike | number | string
    tradeCount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    pairId: number
  }

  export type OhlcDataUpdateManyMutationInput = {
    network?: StringFieldUpdateOperationsInput | string
    ammSource?: StringFieldUpdateOperationsInput | string
    timeframe?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    open?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    high?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    low?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    close?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volume?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tradeCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OhlcDataUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    network?: StringFieldUpdateOperationsInput | string
    ammSource?: StringFieldUpdateOperationsInput | string
    timeframe?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    open?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    high?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    low?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    close?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volume?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tradeCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pairId?: IntFieldUpdateOperationsInput | number
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type EventTrackingNetworkTransactionHashSequenceNumberEventTypeCompoundUniqueInput = {
    network: string
    transactionHash: string
    sequenceNumber: string
    eventType: string
  }

  export type EventTrackingCountOrderByAggregateInput = {
    id?: SortOrder
    eventType?: SortOrder
    blockHeight?: SortOrder
    transactionHash?: SortOrder
    processed?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    network?: SortOrder
    sequenceNumber?: SortOrder
  }

  export type EventTrackingAvgOrderByAggregateInput = {
    id?: SortOrder
    blockHeight?: SortOrder
  }

  export type EventTrackingMaxOrderByAggregateInput = {
    id?: SortOrder
    eventType?: SortOrder
    blockHeight?: SortOrder
    transactionHash?: SortOrder
    processed?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    network?: SortOrder
    sequenceNumber?: SortOrder
  }

  export type EventTrackingMinOrderByAggregateInput = {
    id?: SortOrder
    eventType?: SortOrder
    blockHeight?: SortOrder
    transactionHash?: SortOrder
    processed?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    network?: SortOrder
    sequenceNumber?: SortOrder
  }

  export type EventTrackingSumOrderByAggregateInput = {
    id?: SortOrder
    blockHeight?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type PairScalarRelationFilter = {
    is?: PairWhereInput
    isNot?: PairWhereInput
  }

  export type SpikeyAmmSwapNetworkTransactionHashEventIndexCompoundUniqueInput = {
    network: string
    transactionHash: string
    eventIndex: number
  }

  export type SpikeyAmmSwapCountOrderByAggregateInput = {
    id?: SortOrder
    network?: SortOrder
    transactionHash?: SortOrder
    eventIndex?: SortOrder
    blockNumber?: SortOrder
    blockTimestamp?: SortOrder
    sender?: SortOrder
    to?: SortOrder
    amount0In?: SortOrder
    amount1In?: SortOrder
    amount0Out?: SortOrder
    amount1Out?: SortOrder
    processedAt?: SortOrder
    pairId?: SortOrder
  }

  export type SpikeyAmmSwapAvgOrderByAggregateInput = {
    id?: SortOrder
    eventIndex?: SortOrder
    blockNumber?: SortOrder
    amount0In?: SortOrder
    amount1In?: SortOrder
    amount0Out?: SortOrder
    amount1Out?: SortOrder
    pairId?: SortOrder
  }

  export type SpikeyAmmSwapMaxOrderByAggregateInput = {
    id?: SortOrder
    network?: SortOrder
    transactionHash?: SortOrder
    eventIndex?: SortOrder
    blockNumber?: SortOrder
    blockTimestamp?: SortOrder
    sender?: SortOrder
    to?: SortOrder
    amount0In?: SortOrder
    amount1In?: SortOrder
    amount0Out?: SortOrder
    amount1Out?: SortOrder
    processedAt?: SortOrder
    pairId?: SortOrder
  }

  export type SpikeyAmmSwapMinOrderByAggregateInput = {
    id?: SortOrder
    network?: SortOrder
    transactionHash?: SortOrder
    eventIndex?: SortOrder
    blockNumber?: SortOrder
    blockTimestamp?: SortOrder
    sender?: SortOrder
    to?: SortOrder
    amount0In?: SortOrder
    amount1In?: SortOrder
    amount0Out?: SortOrder
    amount1Out?: SortOrder
    processedAt?: SortOrder
    pairId?: SortOrder
  }

  export type SpikeyAmmSwapSumOrderByAggregateInput = {
    id?: SortOrder
    eventIndex?: SortOrder
    blockNumber?: SortOrder
    amount0In?: SortOrder
    amount1In?: SortOrder
    amount0Out?: SortOrder
    amount1Out?: SortOrder
    pairId?: SortOrder
  }

  export type DexlynSwapNetworkTransactionHashSequenceNumberCompoundUniqueInput = {
    network: string
    transactionHash: string
    sequenceNumber: string
  }

  export type DexlynSwapCountOrderByAggregateInput = {
    id?: SortOrder
    network?: SortOrder
    transactionHash?: SortOrder
    sequenceNumber?: SortOrder
    blockNumber?: SortOrder
    blockTimestamp?: SortOrder
    curve?: SortOrder
    xIn?: SortOrder
    xOut?: SortOrder
    yIn?: SortOrder
    yOut?: SortOrder
    timestamp?: SortOrder
    reserveX?: SortOrder
    reserveY?: SortOrder
    processedAt?: SortOrder
    pairId?: SortOrder
  }

  export type DexlynSwapAvgOrderByAggregateInput = {
    id?: SortOrder
    blockNumber?: SortOrder
    xIn?: SortOrder
    xOut?: SortOrder
    yIn?: SortOrder
    yOut?: SortOrder
    timestamp?: SortOrder
    reserveX?: SortOrder
    reserveY?: SortOrder
    pairId?: SortOrder
  }

  export type DexlynSwapMaxOrderByAggregateInput = {
    id?: SortOrder
    network?: SortOrder
    transactionHash?: SortOrder
    sequenceNumber?: SortOrder
    blockNumber?: SortOrder
    blockTimestamp?: SortOrder
    curve?: SortOrder
    xIn?: SortOrder
    xOut?: SortOrder
    yIn?: SortOrder
    yOut?: SortOrder
    timestamp?: SortOrder
    reserveX?: SortOrder
    reserveY?: SortOrder
    processedAt?: SortOrder
    pairId?: SortOrder
  }

  export type DexlynSwapMinOrderByAggregateInput = {
    id?: SortOrder
    network?: SortOrder
    transactionHash?: SortOrder
    sequenceNumber?: SortOrder
    blockNumber?: SortOrder
    blockTimestamp?: SortOrder
    curve?: SortOrder
    xIn?: SortOrder
    xOut?: SortOrder
    yIn?: SortOrder
    yOut?: SortOrder
    timestamp?: SortOrder
    reserveX?: SortOrder
    reserveY?: SortOrder
    processedAt?: SortOrder
    pairId?: SortOrder
  }

  export type DexlynSwapSumOrderByAggregateInput = {
    id?: SortOrder
    blockNumber?: SortOrder
    xIn?: SortOrder
    xOut?: SortOrder
    yIn?: SortOrder
    yOut?: SortOrder
    timestamp?: SortOrder
    reserveX?: SortOrder
    reserveY?: SortOrder
    pairId?: SortOrder
  }

  export type PairListRelationFilter = {
    every?: PairWhereInput
    some?: PairWhereInput
    none?: PairWhereInput
  }

  export type PairOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TokenNetworkAddressCompoundUniqueInput = {
    network: string
    address: string
  }

  export type TokenCountOrderByAggregateInput = {
    id?: SortOrder
    network?: SortOrder
    address?: SortOrder
    wrappedAddress?: SortOrder
    symbol?: SortOrder
    name?: SortOrder
    decimals?: SortOrder
    createdAt?: SortOrder
  }

  export type TokenAvgOrderByAggregateInput = {
    id?: SortOrder
    decimals?: SortOrder
  }

  export type TokenMaxOrderByAggregateInput = {
    id?: SortOrder
    network?: SortOrder
    address?: SortOrder
    wrappedAddress?: SortOrder
    symbol?: SortOrder
    name?: SortOrder
    decimals?: SortOrder
    createdAt?: SortOrder
  }

  export type TokenMinOrderByAggregateInput = {
    id?: SortOrder
    network?: SortOrder
    address?: SortOrder
    wrappedAddress?: SortOrder
    symbol?: SortOrder
    name?: SortOrder
    decimals?: SortOrder
    createdAt?: SortOrder
  }

  export type TokenSumOrderByAggregateInput = {
    id?: SortOrder
    decimals?: SortOrder
  }

  export type BigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | null
    notIn?: bigint[] | number[] | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type TokenScalarRelationFilter = {
    is?: TokenWhereInput
    isNot?: TokenWhereInput
  }

  export type SpikeyAmmSwapListRelationFilter = {
    every?: SpikeyAmmSwapWhereInput
    some?: SpikeyAmmSwapWhereInput
    none?: SpikeyAmmSwapWhereInput
  }

  export type DexlynSwapListRelationFilter = {
    every?: DexlynSwapWhereInput
    some?: DexlynSwapWhereInput
    none?: DexlynSwapWhereInput
  }

  export type OhlcDataListRelationFilter = {
    every?: OhlcDataWhereInput
    some?: OhlcDataWhereInput
    none?: OhlcDataWhereInput
  }

  export type SpikeyAmmSwapOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DexlynSwapOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OhlcDataOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PairNetworkToken0IdToken1IdCompoundUniqueInput = {
    network: string
    token0Id: number
    token1Id: number
  }

  export type PairNetworkSpikeyAmmPairAddressCompoundUniqueInput = {
    network: string
    spikeyAmmPairAddress: string
  }

  export type PairCountOrderByAggregateInput = {
    id?: SortOrder
    network?: SortOrder
    token0Id?: SortOrder
    token1Id?: SortOrder
    spikeyAmmPairAddress?: SortOrder
    spikeyAmmReserve0?: SortOrder
    spikeyAmmReserve1?: SortOrder
    createdAt?: SortOrder
  }

  export type PairAvgOrderByAggregateInput = {
    id?: SortOrder
    token0Id?: SortOrder
    token1Id?: SortOrder
    spikeyAmmReserve0?: SortOrder
    spikeyAmmReserve1?: SortOrder
  }

  export type PairMaxOrderByAggregateInput = {
    id?: SortOrder
    network?: SortOrder
    token0Id?: SortOrder
    token1Id?: SortOrder
    spikeyAmmPairAddress?: SortOrder
    spikeyAmmReserve0?: SortOrder
    spikeyAmmReserve1?: SortOrder
    createdAt?: SortOrder
  }

  export type PairMinOrderByAggregateInput = {
    id?: SortOrder
    network?: SortOrder
    token0Id?: SortOrder
    token1Id?: SortOrder
    spikeyAmmPairAddress?: SortOrder
    spikeyAmmReserve0?: SortOrder
    spikeyAmmReserve1?: SortOrder
    createdAt?: SortOrder
  }

  export type PairSumOrderByAggregateInput = {
    id?: SortOrder
    token0Id?: SortOrder
    token1Id?: SortOrder
    spikeyAmmReserve0?: SortOrder
    spikeyAmmReserve1?: SortOrder
  }

  export type BigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | null
    notIn?: bigint[] | number[] | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type OhlcDataNetworkAmmSourcePairIdTimeframeTimestampCompoundUniqueInput = {
    network: string
    ammSource: string
    pairId: number
    timeframe: string
    timestamp: Date | string
  }

  export type OhlcDataCountOrderByAggregateInput = {
    id?: SortOrder
    network?: SortOrder
    ammSource?: SortOrder
    timeframe?: SortOrder
    timestamp?: SortOrder
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
    tradeCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    pairId?: SortOrder
  }

  export type OhlcDataAvgOrderByAggregateInput = {
    id?: SortOrder
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
    tradeCount?: SortOrder
    pairId?: SortOrder
  }

  export type OhlcDataMaxOrderByAggregateInput = {
    id?: SortOrder
    network?: SortOrder
    ammSource?: SortOrder
    timeframe?: SortOrder
    timestamp?: SortOrder
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
    tradeCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    pairId?: SortOrder
  }

  export type OhlcDataMinOrderByAggregateInput = {
    id?: SortOrder
    network?: SortOrder
    ammSource?: SortOrder
    timeframe?: SortOrder
    timestamp?: SortOrder
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
    tradeCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    pairId?: SortOrder
  }

  export type OhlcDataSumOrderByAggregateInput = {
    id?: SortOrder
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
    tradeCount?: SortOrder
    pairId?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PairCreateNestedOneWithoutSpikeyAmmSwapsInput = {
    create?: XOR<PairCreateWithoutSpikeyAmmSwapsInput, PairUncheckedCreateWithoutSpikeyAmmSwapsInput>
    connectOrCreate?: PairCreateOrConnectWithoutSpikeyAmmSwapsInput
    connect?: PairWhereUniqueInput
  }

  export type PairUpdateOneRequiredWithoutSpikeyAmmSwapsNestedInput = {
    create?: XOR<PairCreateWithoutSpikeyAmmSwapsInput, PairUncheckedCreateWithoutSpikeyAmmSwapsInput>
    connectOrCreate?: PairCreateOrConnectWithoutSpikeyAmmSwapsInput
    upsert?: PairUpsertWithoutSpikeyAmmSwapsInput
    connect?: PairWhereUniqueInput
    update?: XOR<XOR<PairUpdateToOneWithWhereWithoutSpikeyAmmSwapsInput, PairUpdateWithoutSpikeyAmmSwapsInput>, PairUncheckedUpdateWithoutSpikeyAmmSwapsInput>
  }

  export type PairCreateNestedOneWithoutDexlynSwapsInput = {
    create?: XOR<PairCreateWithoutDexlynSwapsInput, PairUncheckedCreateWithoutDexlynSwapsInput>
    connectOrCreate?: PairCreateOrConnectWithoutDexlynSwapsInput
    connect?: PairWhereUniqueInput
  }

  export type PairUpdateOneRequiredWithoutDexlynSwapsNestedInput = {
    create?: XOR<PairCreateWithoutDexlynSwapsInput, PairUncheckedCreateWithoutDexlynSwapsInput>
    connectOrCreate?: PairCreateOrConnectWithoutDexlynSwapsInput
    upsert?: PairUpsertWithoutDexlynSwapsInput
    connect?: PairWhereUniqueInput
    update?: XOR<XOR<PairUpdateToOneWithWhereWithoutDexlynSwapsInput, PairUpdateWithoutDexlynSwapsInput>, PairUncheckedUpdateWithoutDexlynSwapsInput>
  }

  export type PairCreateNestedManyWithoutToken0Input = {
    create?: XOR<PairCreateWithoutToken0Input, PairUncheckedCreateWithoutToken0Input> | PairCreateWithoutToken0Input[] | PairUncheckedCreateWithoutToken0Input[]
    connectOrCreate?: PairCreateOrConnectWithoutToken0Input | PairCreateOrConnectWithoutToken0Input[]
    createMany?: PairCreateManyToken0InputEnvelope
    connect?: PairWhereUniqueInput | PairWhereUniqueInput[]
  }

  export type PairCreateNestedManyWithoutToken1Input = {
    create?: XOR<PairCreateWithoutToken1Input, PairUncheckedCreateWithoutToken1Input> | PairCreateWithoutToken1Input[] | PairUncheckedCreateWithoutToken1Input[]
    connectOrCreate?: PairCreateOrConnectWithoutToken1Input | PairCreateOrConnectWithoutToken1Input[]
    createMany?: PairCreateManyToken1InputEnvelope
    connect?: PairWhereUniqueInput | PairWhereUniqueInput[]
  }

  export type PairUncheckedCreateNestedManyWithoutToken0Input = {
    create?: XOR<PairCreateWithoutToken0Input, PairUncheckedCreateWithoutToken0Input> | PairCreateWithoutToken0Input[] | PairUncheckedCreateWithoutToken0Input[]
    connectOrCreate?: PairCreateOrConnectWithoutToken0Input | PairCreateOrConnectWithoutToken0Input[]
    createMany?: PairCreateManyToken0InputEnvelope
    connect?: PairWhereUniqueInput | PairWhereUniqueInput[]
  }

  export type PairUncheckedCreateNestedManyWithoutToken1Input = {
    create?: XOR<PairCreateWithoutToken1Input, PairUncheckedCreateWithoutToken1Input> | PairCreateWithoutToken1Input[] | PairUncheckedCreateWithoutToken1Input[]
    connectOrCreate?: PairCreateOrConnectWithoutToken1Input | PairCreateOrConnectWithoutToken1Input[]
    createMany?: PairCreateManyToken1InputEnvelope
    connect?: PairWhereUniqueInput | PairWhereUniqueInput[]
  }

  export type PairUpdateManyWithoutToken0NestedInput = {
    create?: XOR<PairCreateWithoutToken0Input, PairUncheckedCreateWithoutToken0Input> | PairCreateWithoutToken0Input[] | PairUncheckedCreateWithoutToken0Input[]
    connectOrCreate?: PairCreateOrConnectWithoutToken0Input | PairCreateOrConnectWithoutToken0Input[]
    upsert?: PairUpsertWithWhereUniqueWithoutToken0Input | PairUpsertWithWhereUniqueWithoutToken0Input[]
    createMany?: PairCreateManyToken0InputEnvelope
    set?: PairWhereUniqueInput | PairWhereUniqueInput[]
    disconnect?: PairWhereUniqueInput | PairWhereUniqueInput[]
    delete?: PairWhereUniqueInput | PairWhereUniqueInput[]
    connect?: PairWhereUniqueInput | PairWhereUniqueInput[]
    update?: PairUpdateWithWhereUniqueWithoutToken0Input | PairUpdateWithWhereUniqueWithoutToken0Input[]
    updateMany?: PairUpdateManyWithWhereWithoutToken0Input | PairUpdateManyWithWhereWithoutToken0Input[]
    deleteMany?: PairScalarWhereInput | PairScalarWhereInput[]
  }

  export type PairUpdateManyWithoutToken1NestedInput = {
    create?: XOR<PairCreateWithoutToken1Input, PairUncheckedCreateWithoutToken1Input> | PairCreateWithoutToken1Input[] | PairUncheckedCreateWithoutToken1Input[]
    connectOrCreate?: PairCreateOrConnectWithoutToken1Input | PairCreateOrConnectWithoutToken1Input[]
    upsert?: PairUpsertWithWhereUniqueWithoutToken1Input | PairUpsertWithWhereUniqueWithoutToken1Input[]
    createMany?: PairCreateManyToken1InputEnvelope
    set?: PairWhereUniqueInput | PairWhereUniqueInput[]
    disconnect?: PairWhereUniqueInput | PairWhereUniqueInput[]
    delete?: PairWhereUniqueInput | PairWhereUniqueInput[]
    connect?: PairWhereUniqueInput | PairWhereUniqueInput[]
    update?: PairUpdateWithWhereUniqueWithoutToken1Input | PairUpdateWithWhereUniqueWithoutToken1Input[]
    updateMany?: PairUpdateManyWithWhereWithoutToken1Input | PairUpdateManyWithWhereWithoutToken1Input[]
    deleteMany?: PairScalarWhereInput | PairScalarWhereInput[]
  }

  export type PairUncheckedUpdateManyWithoutToken0NestedInput = {
    create?: XOR<PairCreateWithoutToken0Input, PairUncheckedCreateWithoutToken0Input> | PairCreateWithoutToken0Input[] | PairUncheckedCreateWithoutToken0Input[]
    connectOrCreate?: PairCreateOrConnectWithoutToken0Input | PairCreateOrConnectWithoutToken0Input[]
    upsert?: PairUpsertWithWhereUniqueWithoutToken0Input | PairUpsertWithWhereUniqueWithoutToken0Input[]
    createMany?: PairCreateManyToken0InputEnvelope
    set?: PairWhereUniqueInput | PairWhereUniqueInput[]
    disconnect?: PairWhereUniqueInput | PairWhereUniqueInput[]
    delete?: PairWhereUniqueInput | PairWhereUniqueInput[]
    connect?: PairWhereUniqueInput | PairWhereUniqueInput[]
    update?: PairUpdateWithWhereUniqueWithoutToken0Input | PairUpdateWithWhereUniqueWithoutToken0Input[]
    updateMany?: PairUpdateManyWithWhereWithoutToken0Input | PairUpdateManyWithWhereWithoutToken0Input[]
    deleteMany?: PairScalarWhereInput | PairScalarWhereInput[]
  }

  export type PairUncheckedUpdateManyWithoutToken1NestedInput = {
    create?: XOR<PairCreateWithoutToken1Input, PairUncheckedCreateWithoutToken1Input> | PairCreateWithoutToken1Input[] | PairUncheckedCreateWithoutToken1Input[]
    connectOrCreate?: PairCreateOrConnectWithoutToken1Input | PairCreateOrConnectWithoutToken1Input[]
    upsert?: PairUpsertWithWhereUniqueWithoutToken1Input | PairUpsertWithWhereUniqueWithoutToken1Input[]
    createMany?: PairCreateManyToken1InputEnvelope
    set?: PairWhereUniqueInput | PairWhereUniqueInput[]
    disconnect?: PairWhereUniqueInput | PairWhereUniqueInput[]
    delete?: PairWhereUniqueInput | PairWhereUniqueInput[]
    connect?: PairWhereUniqueInput | PairWhereUniqueInput[]
    update?: PairUpdateWithWhereUniqueWithoutToken1Input | PairUpdateWithWhereUniqueWithoutToken1Input[]
    updateMany?: PairUpdateManyWithWhereWithoutToken1Input | PairUpdateManyWithWhereWithoutToken1Input[]
    deleteMany?: PairScalarWhereInput | PairScalarWhereInput[]
  }

  export type TokenCreateNestedOneWithoutPairsAsToken0Input = {
    create?: XOR<TokenCreateWithoutPairsAsToken0Input, TokenUncheckedCreateWithoutPairsAsToken0Input>
    connectOrCreate?: TokenCreateOrConnectWithoutPairsAsToken0Input
    connect?: TokenWhereUniqueInput
  }

  export type TokenCreateNestedOneWithoutPairsAsToken1Input = {
    create?: XOR<TokenCreateWithoutPairsAsToken1Input, TokenUncheckedCreateWithoutPairsAsToken1Input>
    connectOrCreate?: TokenCreateOrConnectWithoutPairsAsToken1Input
    connect?: TokenWhereUniqueInput
  }

  export type SpikeyAmmSwapCreateNestedManyWithoutPairInput = {
    create?: XOR<SpikeyAmmSwapCreateWithoutPairInput, SpikeyAmmSwapUncheckedCreateWithoutPairInput> | SpikeyAmmSwapCreateWithoutPairInput[] | SpikeyAmmSwapUncheckedCreateWithoutPairInput[]
    connectOrCreate?: SpikeyAmmSwapCreateOrConnectWithoutPairInput | SpikeyAmmSwapCreateOrConnectWithoutPairInput[]
    createMany?: SpikeyAmmSwapCreateManyPairInputEnvelope
    connect?: SpikeyAmmSwapWhereUniqueInput | SpikeyAmmSwapWhereUniqueInput[]
  }

  export type DexlynSwapCreateNestedManyWithoutPairInput = {
    create?: XOR<DexlynSwapCreateWithoutPairInput, DexlynSwapUncheckedCreateWithoutPairInput> | DexlynSwapCreateWithoutPairInput[] | DexlynSwapUncheckedCreateWithoutPairInput[]
    connectOrCreate?: DexlynSwapCreateOrConnectWithoutPairInput | DexlynSwapCreateOrConnectWithoutPairInput[]
    createMany?: DexlynSwapCreateManyPairInputEnvelope
    connect?: DexlynSwapWhereUniqueInput | DexlynSwapWhereUniqueInput[]
  }

  export type OhlcDataCreateNestedManyWithoutPairInput = {
    create?: XOR<OhlcDataCreateWithoutPairInput, OhlcDataUncheckedCreateWithoutPairInput> | OhlcDataCreateWithoutPairInput[] | OhlcDataUncheckedCreateWithoutPairInput[]
    connectOrCreate?: OhlcDataCreateOrConnectWithoutPairInput | OhlcDataCreateOrConnectWithoutPairInput[]
    createMany?: OhlcDataCreateManyPairInputEnvelope
    connect?: OhlcDataWhereUniqueInput | OhlcDataWhereUniqueInput[]
  }

  export type SpikeyAmmSwapUncheckedCreateNestedManyWithoutPairInput = {
    create?: XOR<SpikeyAmmSwapCreateWithoutPairInput, SpikeyAmmSwapUncheckedCreateWithoutPairInput> | SpikeyAmmSwapCreateWithoutPairInput[] | SpikeyAmmSwapUncheckedCreateWithoutPairInput[]
    connectOrCreate?: SpikeyAmmSwapCreateOrConnectWithoutPairInput | SpikeyAmmSwapCreateOrConnectWithoutPairInput[]
    createMany?: SpikeyAmmSwapCreateManyPairInputEnvelope
    connect?: SpikeyAmmSwapWhereUniqueInput | SpikeyAmmSwapWhereUniqueInput[]
  }

  export type DexlynSwapUncheckedCreateNestedManyWithoutPairInput = {
    create?: XOR<DexlynSwapCreateWithoutPairInput, DexlynSwapUncheckedCreateWithoutPairInput> | DexlynSwapCreateWithoutPairInput[] | DexlynSwapUncheckedCreateWithoutPairInput[]
    connectOrCreate?: DexlynSwapCreateOrConnectWithoutPairInput | DexlynSwapCreateOrConnectWithoutPairInput[]
    createMany?: DexlynSwapCreateManyPairInputEnvelope
    connect?: DexlynSwapWhereUniqueInput | DexlynSwapWhereUniqueInput[]
  }

  export type OhlcDataUncheckedCreateNestedManyWithoutPairInput = {
    create?: XOR<OhlcDataCreateWithoutPairInput, OhlcDataUncheckedCreateWithoutPairInput> | OhlcDataCreateWithoutPairInput[] | OhlcDataUncheckedCreateWithoutPairInput[]
    connectOrCreate?: OhlcDataCreateOrConnectWithoutPairInput | OhlcDataCreateOrConnectWithoutPairInput[]
    createMany?: OhlcDataCreateManyPairInputEnvelope
    connect?: OhlcDataWhereUniqueInput | OhlcDataWhereUniqueInput[]
  }

  export type NullableBigIntFieldUpdateOperationsInput = {
    set?: bigint | number | null
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type TokenUpdateOneRequiredWithoutPairsAsToken0NestedInput = {
    create?: XOR<TokenCreateWithoutPairsAsToken0Input, TokenUncheckedCreateWithoutPairsAsToken0Input>
    connectOrCreate?: TokenCreateOrConnectWithoutPairsAsToken0Input
    upsert?: TokenUpsertWithoutPairsAsToken0Input
    connect?: TokenWhereUniqueInput
    update?: XOR<XOR<TokenUpdateToOneWithWhereWithoutPairsAsToken0Input, TokenUpdateWithoutPairsAsToken0Input>, TokenUncheckedUpdateWithoutPairsAsToken0Input>
  }

  export type TokenUpdateOneRequiredWithoutPairsAsToken1NestedInput = {
    create?: XOR<TokenCreateWithoutPairsAsToken1Input, TokenUncheckedCreateWithoutPairsAsToken1Input>
    connectOrCreate?: TokenCreateOrConnectWithoutPairsAsToken1Input
    upsert?: TokenUpsertWithoutPairsAsToken1Input
    connect?: TokenWhereUniqueInput
    update?: XOR<XOR<TokenUpdateToOneWithWhereWithoutPairsAsToken1Input, TokenUpdateWithoutPairsAsToken1Input>, TokenUncheckedUpdateWithoutPairsAsToken1Input>
  }

  export type SpikeyAmmSwapUpdateManyWithoutPairNestedInput = {
    create?: XOR<SpikeyAmmSwapCreateWithoutPairInput, SpikeyAmmSwapUncheckedCreateWithoutPairInput> | SpikeyAmmSwapCreateWithoutPairInput[] | SpikeyAmmSwapUncheckedCreateWithoutPairInput[]
    connectOrCreate?: SpikeyAmmSwapCreateOrConnectWithoutPairInput | SpikeyAmmSwapCreateOrConnectWithoutPairInput[]
    upsert?: SpikeyAmmSwapUpsertWithWhereUniqueWithoutPairInput | SpikeyAmmSwapUpsertWithWhereUniqueWithoutPairInput[]
    createMany?: SpikeyAmmSwapCreateManyPairInputEnvelope
    set?: SpikeyAmmSwapWhereUniqueInput | SpikeyAmmSwapWhereUniqueInput[]
    disconnect?: SpikeyAmmSwapWhereUniqueInput | SpikeyAmmSwapWhereUniqueInput[]
    delete?: SpikeyAmmSwapWhereUniqueInput | SpikeyAmmSwapWhereUniqueInput[]
    connect?: SpikeyAmmSwapWhereUniqueInput | SpikeyAmmSwapWhereUniqueInput[]
    update?: SpikeyAmmSwapUpdateWithWhereUniqueWithoutPairInput | SpikeyAmmSwapUpdateWithWhereUniqueWithoutPairInput[]
    updateMany?: SpikeyAmmSwapUpdateManyWithWhereWithoutPairInput | SpikeyAmmSwapUpdateManyWithWhereWithoutPairInput[]
    deleteMany?: SpikeyAmmSwapScalarWhereInput | SpikeyAmmSwapScalarWhereInput[]
  }

  export type DexlynSwapUpdateManyWithoutPairNestedInput = {
    create?: XOR<DexlynSwapCreateWithoutPairInput, DexlynSwapUncheckedCreateWithoutPairInput> | DexlynSwapCreateWithoutPairInput[] | DexlynSwapUncheckedCreateWithoutPairInput[]
    connectOrCreate?: DexlynSwapCreateOrConnectWithoutPairInput | DexlynSwapCreateOrConnectWithoutPairInput[]
    upsert?: DexlynSwapUpsertWithWhereUniqueWithoutPairInput | DexlynSwapUpsertWithWhereUniqueWithoutPairInput[]
    createMany?: DexlynSwapCreateManyPairInputEnvelope
    set?: DexlynSwapWhereUniqueInput | DexlynSwapWhereUniqueInput[]
    disconnect?: DexlynSwapWhereUniqueInput | DexlynSwapWhereUniqueInput[]
    delete?: DexlynSwapWhereUniqueInput | DexlynSwapWhereUniqueInput[]
    connect?: DexlynSwapWhereUniqueInput | DexlynSwapWhereUniqueInput[]
    update?: DexlynSwapUpdateWithWhereUniqueWithoutPairInput | DexlynSwapUpdateWithWhereUniqueWithoutPairInput[]
    updateMany?: DexlynSwapUpdateManyWithWhereWithoutPairInput | DexlynSwapUpdateManyWithWhereWithoutPairInput[]
    deleteMany?: DexlynSwapScalarWhereInput | DexlynSwapScalarWhereInput[]
  }

  export type OhlcDataUpdateManyWithoutPairNestedInput = {
    create?: XOR<OhlcDataCreateWithoutPairInput, OhlcDataUncheckedCreateWithoutPairInput> | OhlcDataCreateWithoutPairInput[] | OhlcDataUncheckedCreateWithoutPairInput[]
    connectOrCreate?: OhlcDataCreateOrConnectWithoutPairInput | OhlcDataCreateOrConnectWithoutPairInput[]
    upsert?: OhlcDataUpsertWithWhereUniqueWithoutPairInput | OhlcDataUpsertWithWhereUniqueWithoutPairInput[]
    createMany?: OhlcDataCreateManyPairInputEnvelope
    set?: OhlcDataWhereUniqueInput | OhlcDataWhereUniqueInput[]
    disconnect?: OhlcDataWhereUniqueInput | OhlcDataWhereUniqueInput[]
    delete?: OhlcDataWhereUniqueInput | OhlcDataWhereUniqueInput[]
    connect?: OhlcDataWhereUniqueInput | OhlcDataWhereUniqueInput[]
    update?: OhlcDataUpdateWithWhereUniqueWithoutPairInput | OhlcDataUpdateWithWhereUniqueWithoutPairInput[]
    updateMany?: OhlcDataUpdateManyWithWhereWithoutPairInput | OhlcDataUpdateManyWithWhereWithoutPairInput[]
    deleteMany?: OhlcDataScalarWhereInput | OhlcDataScalarWhereInput[]
  }

  export type SpikeyAmmSwapUncheckedUpdateManyWithoutPairNestedInput = {
    create?: XOR<SpikeyAmmSwapCreateWithoutPairInput, SpikeyAmmSwapUncheckedCreateWithoutPairInput> | SpikeyAmmSwapCreateWithoutPairInput[] | SpikeyAmmSwapUncheckedCreateWithoutPairInput[]
    connectOrCreate?: SpikeyAmmSwapCreateOrConnectWithoutPairInput | SpikeyAmmSwapCreateOrConnectWithoutPairInput[]
    upsert?: SpikeyAmmSwapUpsertWithWhereUniqueWithoutPairInput | SpikeyAmmSwapUpsertWithWhereUniqueWithoutPairInput[]
    createMany?: SpikeyAmmSwapCreateManyPairInputEnvelope
    set?: SpikeyAmmSwapWhereUniqueInput | SpikeyAmmSwapWhereUniqueInput[]
    disconnect?: SpikeyAmmSwapWhereUniqueInput | SpikeyAmmSwapWhereUniqueInput[]
    delete?: SpikeyAmmSwapWhereUniqueInput | SpikeyAmmSwapWhereUniqueInput[]
    connect?: SpikeyAmmSwapWhereUniqueInput | SpikeyAmmSwapWhereUniqueInput[]
    update?: SpikeyAmmSwapUpdateWithWhereUniqueWithoutPairInput | SpikeyAmmSwapUpdateWithWhereUniqueWithoutPairInput[]
    updateMany?: SpikeyAmmSwapUpdateManyWithWhereWithoutPairInput | SpikeyAmmSwapUpdateManyWithWhereWithoutPairInput[]
    deleteMany?: SpikeyAmmSwapScalarWhereInput | SpikeyAmmSwapScalarWhereInput[]
  }

  export type DexlynSwapUncheckedUpdateManyWithoutPairNestedInput = {
    create?: XOR<DexlynSwapCreateWithoutPairInput, DexlynSwapUncheckedCreateWithoutPairInput> | DexlynSwapCreateWithoutPairInput[] | DexlynSwapUncheckedCreateWithoutPairInput[]
    connectOrCreate?: DexlynSwapCreateOrConnectWithoutPairInput | DexlynSwapCreateOrConnectWithoutPairInput[]
    upsert?: DexlynSwapUpsertWithWhereUniqueWithoutPairInput | DexlynSwapUpsertWithWhereUniqueWithoutPairInput[]
    createMany?: DexlynSwapCreateManyPairInputEnvelope
    set?: DexlynSwapWhereUniqueInput | DexlynSwapWhereUniqueInput[]
    disconnect?: DexlynSwapWhereUniqueInput | DexlynSwapWhereUniqueInput[]
    delete?: DexlynSwapWhereUniqueInput | DexlynSwapWhereUniqueInput[]
    connect?: DexlynSwapWhereUniqueInput | DexlynSwapWhereUniqueInput[]
    update?: DexlynSwapUpdateWithWhereUniqueWithoutPairInput | DexlynSwapUpdateWithWhereUniqueWithoutPairInput[]
    updateMany?: DexlynSwapUpdateManyWithWhereWithoutPairInput | DexlynSwapUpdateManyWithWhereWithoutPairInput[]
    deleteMany?: DexlynSwapScalarWhereInput | DexlynSwapScalarWhereInput[]
  }

  export type OhlcDataUncheckedUpdateManyWithoutPairNestedInput = {
    create?: XOR<OhlcDataCreateWithoutPairInput, OhlcDataUncheckedCreateWithoutPairInput> | OhlcDataCreateWithoutPairInput[] | OhlcDataUncheckedCreateWithoutPairInput[]
    connectOrCreate?: OhlcDataCreateOrConnectWithoutPairInput | OhlcDataCreateOrConnectWithoutPairInput[]
    upsert?: OhlcDataUpsertWithWhereUniqueWithoutPairInput | OhlcDataUpsertWithWhereUniqueWithoutPairInput[]
    createMany?: OhlcDataCreateManyPairInputEnvelope
    set?: OhlcDataWhereUniqueInput | OhlcDataWhereUniqueInput[]
    disconnect?: OhlcDataWhereUniqueInput | OhlcDataWhereUniqueInput[]
    delete?: OhlcDataWhereUniqueInput | OhlcDataWhereUniqueInput[]
    connect?: OhlcDataWhereUniqueInput | OhlcDataWhereUniqueInput[]
    update?: OhlcDataUpdateWithWhereUniqueWithoutPairInput | OhlcDataUpdateWithWhereUniqueWithoutPairInput[]
    updateMany?: OhlcDataUpdateManyWithWhereWithoutPairInput | OhlcDataUpdateManyWithWhereWithoutPairInput[]
    deleteMany?: OhlcDataScalarWhereInput | OhlcDataScalarWhereInput[]
  }

  export type PairCreateNestedOneWithoutOhlcDataInput = {
    create?: XOR<PairCreateWithoutOhlcDataInput, PairUncheckedCreateWithoutOhlcDataInput>
    connectOrCreate?: PairCreateOrConnectWithoutOhlcDataInput
    connect?: PairWhereUniqueInput
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type PairUpdateOneRequiredWithoutOhlcDataNestedInput = {
    create?: XOR<PairCreateWithoutOhlcDataInput, PairUncheckedCreateWithoutOhlcDataInput>
    connectOrCreate?: PairCreateOrConnectWithoutOhlcDataInput
    upsert?: PairUpsertWithoutOhlcDataInput
    connect?: PairWhereUniqueInput
    update?: XOR<XOR<PairUpdateToOneWithWhereWithoutOhlcDataInput, PairUpdateWithoutOhlcDataInput>, PairUncheckedUpdateWithoutOhlcDataInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | null
    notIn?: bigint[] | number[] | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type NestedBigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | null
    notIn?: bigint[] | number[] | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type PairCreateWithoutSpikeyAmmSwapsInput = {
    network: string
    spikeyAmmPairAddress?: string | null
    spikeyAmmReserve0?: bigint | number | null
    spikeyAmmReserve1?: bigint | number | null
    createdAt?: Date | string
    token0: TokenCreateNestedOneWithoutPairsAsToken0Input
    token1: TokenCreateNestedOneWithoutPairsAsToken1Input
    dexlynSwaps?: DexlynSwapCreateNestedManyWithoutPairInput
    ohlcData?: OhlcDataCreateNestedManyWithoutPairInput
  }

  export type PairUncheckedCreateWithoutSpikeyAmmSwapsInput = {
    id?: number
    network: string
    token0Id: number
    token1Id: number
    spikeyAmmPairAddress?: string | null
    spikeyAmmReserve0?: bigint | number | null
    spikeyAmmReserve1?: bigint | number | null
    createdAt?: Date | string
    dexlynSwaps?: DexlynSwapUncheckedCreateNestedManyWithoutPairInput
    ohlcData?: OhlcDataUncheckedCreateNestedManyWithoutPairInput
  }

  export type PairCreateOrConnectWithoutSpikeyAmmSwapsInput = {
    where: PairWhereUniqueInput
    create: XOR<PairCreateWithoutSpikeyAmmSwapsInput, PairUncheckedCreateWithoutSpikeyAmmSwapsInput>
  }

  export type PairUpsertWithoutSpikeyAmmSwapsInput = {
    update: XOR<PairUpdateWithoutSpikeyAmmSwapsInput, PairUncheckedUpdateWithoutSpikeyAmmSwapsInput>
    create: XOR<PairCreateWithoutSpikeyAmmSwapsInput, PairUncheckedCreateWithoutSpikeyAmmSwapsInput>
    where?: PairWhereInput
  }

  export type PairUpdateToOneWithWhereWithoutSpikeyAmmSwapsInput = {
    where?: PairWhereInput
    data: XOR<PairUpdateWithoutSpikeyAmmSwapsInput, PairUncheckedUpdateWithoutSpikeyAmmSwapsInput>
  }

  export type PairUpdateWithoutSpikeyAmmSwapsInput = {
    network?: StringFieldUpdateOperationsInput | string
    spikeyAmmPairAddress?: NullableStringFieldUpdateOperationsInput | string | null
    spikeyAmmReserve0?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    spikeyAmmReserve1?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token0?: TokenUpdateOneRequiredWithoutPairsAsToken0NestedInput
    token1?: TokenUpdateOneRequiredWithoutPairsAsToken1NestedInput
    dexlynSwaps?: DexlynSwapUpdateManyWithoutPairNestedInput
    ohlcData?: OhlcDataUpdateManyWithoutPairNestedInput
  }

  export type PairUncheckedUpdateWithoutSpikeyAmmSwapsInput = {
    id?: IntFieldUpdateOperationsInput | number
    network?: StringFieldUpdateOperationsInput | string
    token0Id?: IntFieldUpdateOperationsInput | number
    token1Id?: IntFieldUpdateOperationsInput | number
    spikeyAmmPairAddress?: NullableStringFieldUpdateOperationsInput | string | null
    spikeyAmmReserve0?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    spikeyAmmReserve1?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dexlynSwaps?: DexlynSwapUncheckedUpdateManyWithoutPairNestedInput
    ohlcData?: OhlcDataUncheckedUpdateManyWithoutPairNestedInput
  }

  export type PairCreateWithoutDexlynSwapsInput = {
    network: string
    spikeyAmmPairAddress?: string | null
    spikeyAmmReserve0?: bigint | number | null
    spikeyAmmReserve1?: bigint | number | null
    createdAt?: Date | string
    token0: TokenCreateNestedOneWithoutPairsAsToken0Input
    token1: TokenCreateNestedOneWithoutPairsAsToken1Input
    spikeyAmmSwaps?: SpikeyAmmSwapCreateNestedManyWithoutPairInput
    ohlcData?: OhlcDataCreateNestedManyWithoutPairInput
  }

  export type PairUncheckedCreateWithoutDexlynSwapsInput = {
    id?: number
    network: string
    token0Id: number
    token1Id: number
    spikeyAmmPairAddress?: string | null
    spikeyAmmReserve0?: bigint | number | null
    spikeyAmmReserve1?: bigint | number | null
    createdAt?: Date | string
    spikeyAmmSwaps?: SpikeyAmmSwapUncheckedCreateNestedManyWithoutPairInput
    ohlcData?: OhlcDataUncheckedCreateNestedManyWithoutPairInput
  }

  export type PairCreateOrConnectWithoutDexlynSwapsInput = {
    where: PairWhereUniqueInput
    create: XOR<PairCreateWithoutDexlynSwapsInput, PairUncheckedCreateWithoutDexlynSwapsInput>
  }

  export type PairUpsertWithoutDexlynSwapsInput = {
    update: XOR<PairUpdateWithoutDexlynSwapsInput, PairUncheckedUpdateWithoutDexlynSwapsInput>
    create: XOR<PairCreateWithoutDexlynSwapsInput, PairUncheckedCreateWithoutDexlynSwapsInput>
    where?: PairWhereInput
  }

  export type PairUpdateToOneWithWhereWithoutDexlynSwapsInput = {
    where?: PairWhereInput
    data: XOR<PairUpdateWithoutDexlynSwapsInput, PairUncheckedUpdateWithoutDexlynSwapsInput>
  }

  export type PairUpdateWithoutDexlynSwapsInput = {
    network?: StringFieldUpdateOperationsInput | string
    spikeyAmmPairAddress?: NullableStringFieldUpdateOperationsInput | string | null
    spikeyAmmReserve0?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    spikeyAmmReserve1?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token0?: TokenUpdateOneRequiredWithoutPairsAsToken0NestedInput
    token1?: TokenUpdateOneRequiredWithoutPairsAsToken1NestedInput
    spikeyAmmSwaps?: SpikeyAmmSwapUpdateManyWithoutPairNestedInput
    ohlcData?: OhlcDataUpdateManyWithoutPairNestedInput
  }

  export type PairUncheckedUpdateWithoutDexlynSwapsInput = {
    id?: IntFieldUpdateOperationsInput | number
    network?: StringFieldUpdateOperationsInput | string
    token0Id?: IntFieldUpdateOperationsInput | number
    token1Id?: IntFieldUpdateOperationsInput | number
    spikeyAmmPairAddress?: NullableStringFieldUpdateOperationsInput | string | null
    spikeyAmmReserve0?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    spikeyAmmReserve1?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    spikeyAmmSwaps?: SpikeyAmmSwapUncheckedUpdateManyWithoutPairNestedInput
    ohlcData?: OhlcDataUncheckedUpdateManyWithoutPairNestedInput
  }

  export type PairCreateWithoutToken0Input = {
    network: string
    spikeyAmmPairAddress?: string | null
    spikeyAmmReserve0?: bigint | number | null
    spikeyAmmReserve1?: bigint | number | null
    createdAt?: Date | string
    token1: TokenCreateNestedOneWithoutPairsAsToken1Input
    spikeyAmmSwaps?: SpikeyAmmSwapCreateNestedManyWithoutPairInput
    dexlynSwaps?: DexlynSwapCreateNestedManyWithoutPairInput
    ohlcData?: OhlcDataCreateNestedManyWithoutPairInput
  }

  export type PairUncheckedCreateWithoutToken0Input = {
    id?: number
    network: string
    token1Id: number
    spikeyAmmPairAddress?: string | null
    spikeyAmmReserve0?: bigint | number | null
    spikeyAmmReserve1?: bigint | number | null
    createdAt?: Date | string
    spikeyAmmSwaps?: SpikeyAmmSwapUncheckedCreateNestedManyWithoutPairInput
    dexlynSwaps?: DexlynSwapUncheckedCreateNestedManyWithoutPairInput
    ohlcData?: OhlcDataUncheckedCreateNestedManyWithoutPairInput
  }

  export type PairCreateOrConnectWithoutToken0Input = {
    where: PairWhereUniqueInput
    create: XOR<PairCreateWithoutToken0Input, PairUncheckedCreateWithoutToken0Input>
  }

  export type PairCreateManyToken0InputEnvelope = {
    data: PairCreateManyToken0Input | PairCreateManyToken0Input[]
  }

  export type PairCreateWithoutToken1Input = {
    network: string
    spikeyAmmPairAddress?: string | null
    spikeyAmmReserve0?: bigint | number | null
    spikeyAmmReserve1?: bigint | number | null
    createdAt?: Date | string
    token0: TokenCreateNestedOneWithoutPairsAsToken0Input
    spikeyAmmSwaps?: SpikeyAmmSwapCreateNestedManyWithoutPairInput
    dexlynSwaps?: DexlynSwapCreateNestedManyWithoutPairInput
    ohlcData?: OhlcDataCreateNestedManyWithoutPairInput
  }

  export type PairUncheckedCreateWithoutToken1Input = {
    id?: number
    network: string
    token0Id: number
    spikeyAmmPairAddress?: string | null
    spikeyAmmReserve0?: bigint | number | null
    spikeyAmmReserve1?: bigint | number | null
    createdAt?: Date | string
    spikeyAmmSwaps?: SpikeyAmmSwapUncheckedCreateNestedManyWithoutPairInput
    dexlynSwaps?: DexlynSwapUncheckedCreateNestedManyWithoutPairInput
    ohlcData?: OhlcDataUncheckedCreateNestedManyWithoutPairInput
  }

  export type PairCreateOrConnectWithoutToken1Input = {
    where: PairWhereUniqueInput
    create: XOR<PairCreateWithoutToken1Input, PairUncheckedCreateWithoutToken1Input>
  }

  export type PairCreateManyToken1InputEnvelope = {
    data: PairCreateManyToken1Input | PairCreateManyToken1Input[]
  }

  export type PairUpsertWithWhereUniqueWithoutToken0Input = {
    where: PairWhereUniqueInput
    update: XOR<PairUpdateWithoutToken0Input, PairUncheckedUpdateWithoutToken0Input>
    create: XOR<PairCreateWithoutToken0Input, PairUncheckedCreateWithoutToken0Input>
  }

  export type PairUpdateWithWhereUniqueWithoutToken0Input = {
    where: PairWhereUniqueInput
    data: XOR<PairUpdateWithoutToken0Input, PairUncheckedUpdateWithoutToken0Input>
  }

  export type PairUpdateManyWithWhereWithoutToken0Input = {
    where: PairScalarWhereInput
    data: XOR<PairUpdateManyMutationInput, PairUncheckedUpdateManyWithoutToken0Input>
  }

  export type PairScalarWhereInput = {
    AND?: PairScalarWhereInput | PairScalarWhereInput[]
    OR?: PairScalarWhereInput[]
    NOT?: PairScalarWhereInput | PairScalarWhereInput[]
    id?: IntFilter<"Pair"> | number
    network?: StringFilter<"Pair"> | string
    token0Id?: IntFilter<"Pair"> | number
    token1Id?: IntFilter<"Pair"> | number
    spikeyAmmPairAddress?: StringNullableFilter<"Pair"> | string | null
    spikeyAmmReserve0?: BigIntNullableFilter<"Pair"> | bigint | number | null
    spikeyAmmReserve1?: BigIntNullableFilter<"Pair"> | bigint | number | null
    createdAt?: DateTimeFilter<"Pair"> | Date | string
  }

  export type PairUpsertWithWhereUniqueWithoutToken1Input = {
    where: PairWhereUniqueInput
    update: XOR<PairUpdateWithoutToken1Input, PairUncheckedUpdateWithoutToken1Input>
    create: XOR<PairCreateWithoutToken1Input, PairUncheckedCreateWithoutToken1Input>
  }

  export type PairUpdateWithWhereUniqueWithoutToken1Input = {
    where: PairWhereUniqueInput
    data: XOR<PairUpdateWithoutToken1Input, PairUncheckedUpdateWithoutToken1Input>
  }

  export type PairUpdateManyWithWhereWithoutToken1Input = {
    where: PairScalarWhereInput
    data: XOR<PairUpdateManyMutationInput, PairUncheckedUpdateManyWithoutToken1Input>
  }

  export type TokenCreateWithoutPairsAsToken0Input = {
    network: string
    address: string
    wrappedAddress?: string | null
    symbol: string
    name: string
    decimals: number
    createdAt?: Date | string
    pairsAsToken1?: PairCreateNestedManyWithoutToken1Input
  }

  export type TokenUncheckedCreateWithoutPairsAsToken0Input = {
    id?: number
    network: string
    address: string
    wrappedAddress?: string | null
    symbol: string
    name: string
    decimals: number
    createdAt?: Date | string
    pairsAsToken1?: PairUncheckedCreateNestedManyWithoutToken1Input
  }

  export type TokenCreateOrConnectWithoutPairsAsToken0Input = {
    where: TokenWhereUniqueInput
    create: XOR<TokenCreateWithoutPairsAsToken0Input, TokenUncheckedCreateWithoutPairsAsToken0Input>
  }

  export type TokenCreateWithoutPairsAsToken1Input = {
    network: string
    address: string
    wrappedAddress?: string | null
    symbol: string
    name: string
    decimals: number
    createdAt?: Date | string
    pairsAsToken0?: PairCreateNestedManyWithoutToken0Input
  }

  export type TokenUncheckedCreateWithoutPairsAsToken1Input = {
    id?: number
    network: string
    address: string
    wrappedAddress?: string | null
    symbol: string
    name: string
    decimals: number
    createdAt?: Date | string
    pairsAsToken0?: PairUncheckedCreateNestedManyWithoutToken0Input
  }

  export type TokenCreateOrConnectWithoutPairsAsToken1Input = {
    where: TokenWhereUniqueInput
    create: XOR<TokenCreateWithoutPairsAsToken1Input, TokenUncheckedCreateWithoutPairsAsToken1Input>
  }

  export type SpikeyAmmSwapCreateWithoutPairInput = {
    network: string
    transactionHash: string
    eventIndex: number
    blockNumber: bigint | number
    blockTimestamp: Date | string
    sender: string
    to: string
    amount0In: bigint | number
    amount1In: bigint | number
    amount0Out: bigint | number
    amount1Out: bigint | number
    processedAt?: Date | string
  }

  export type SpikeyAmmSwapUncheckedCreateWithoutPairInput = {
    id?: number
    network: string
    transactionHash: string
    eventIndex: number
    blockNumber: bigint | number
    blockTimestamp: Date | string
    sender: string
    to: string
    amount0In: bigint | number
    amount1In: bigint | number
    amount0Out: bigint | number
    amount1Out: bigint | number
    processedAt?: Date | string
  }

  export type SpikeyAmmSwapCreateOrConnectWithoutPairInput = {
    where: SpikeyAmmSwapWhereUniqueInput
    create: XOR<SpikeyAmmSwapCreateWithoutPairInput, SpikeyAmmSwapUncheckedCreateWithoutPairInput>
  }

  export type SpikeyAmmSwapCreateManyPairInputEnvelope = {
    data: SpikeyAmmSwapCreateManyPairInput | SpikeyAmmSwapCreateManyPairInput[]
  }

  export type DexlynSwapCreateWithoutPairInput = {
    network: string
    transactionHash: string
    sequenceNumber: string
    blockNumber: bigint | number
    blockTimestamp: Date | string
    curve: string
    xIn: bigint | number
    xOut: bigint | number
    yIn: bigint | number
    yOut: bigint | number
    timestamp: bigint | number
    reserveX: bigint | number
    reserveY: bigint | number
    processedAt?: Date | string
  }

  export type DexlynSwapUncheckedCreateWithoutPairInput = {
    id?: number
    network: string
    transactionHash: string
    sequenceNumber: string
    blockNumber: bigint | number
    blockTimestamp: Date | string
    curve: string
    xIn: bigint | number
    xOut: bigint | number
    yIn: bigint | number
    yOut: bigint | number
    timestamp: bigint | number
    reserveX: bigint | number
    reserveY: bigint | number
    processedAt?: Date | string
  }

  export type DexlynSwapCreateOrConnectWithoutPairInput = {
    where: DexlynSwapWhereUniqueInput
    create: XOR<DexlynSwapCreateWithoutPairInput, DexlynSwapUncheckedCreateWithoutPairInput>
  }

  export type DexlynSwapCreateManyPairInputEnvelope = {
    data: DexlynSwapCreateManyPairInput | DexlynSwapCreateManyPairInput[]
  }

  export type OhlcDataCreateWithoutPairInput = {
    network: string
    ammSource: string
    timeframe: string
    timestamp: Date | string
    open: Decimal | DecimalJsLike | number | string
    high: Decimal | DecimalJsLike | number | string
    low: Decimal | DecimalJsLike | number | string
    close: Decimal | DecimalJsLike | number | string
    volume: Decimal | DecimalJsLike | number | string
    tradeCount: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OhlcDataUncheckedCreateWithoutPairInput = {
    id?: number
    network: string
    ammSource: string
    timeframe: string
    timestamp: Date | string
    open: Decimal | DecimalJsLike | number | string
    high: Decimal | DecimalJsLike | number | string
    low: Decimal | DecimalJsLike | number | string
    close: Decimal | DecimalJsLike | number | string
    volume: Decimal | DecimalJsLike | number | string
    tradeCount: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OhlcDataCreateOrConnectWithoutPairInput = {
    where: OhlcDataWhereUniqueInput
    create: XOR<OhlcDataCreateWithoutPairInput, OhlcDataUncheckedCreateWithoutPairInput>
  }

  export type OhlcDataCreateManyPairInputEnvelope = {
    data: OhlcDataCreateManyPairInput | OhlcDataCreateManyPairInput[]
  }

  export type TokenUpsertWithoutPairsAsToken0Input = {
    update: XOR<TokenUpdateWithoutPairsAsToken0Input, TokenUncheckedUpdateWithoutPairsAsToken0Input>
    create: XOR<TokenCreateWithoutPairsAsToken0Input, TokenUncheckedCreateWithoutPairsAsToken0Input>
    where?: TokenWhereInput
  }

  export type TokenUpdateToOneWithWhereWithoutPairsAsToken0Input = {
    where?: TokenWhereInput
    data: XOR<TokenUpdateWithoutPairsAsToken0Input, TokenUncheckedUpdateWithoutPairsAsToken0Input>
  }

  export type TokenUpdateWithoutPairsAsToken0Input = {
    network?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    wrappedAddress?: NullableStringFieldUpdateOperationsInput | string | null
    symbol?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    decimals?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pairsAsToken1?: PairUpdateManyWithoutToken1NestedInput
  }

  export type TokenUncheckedUpdateWithoutPairsAsToken0Input = {
    id?: IntFieldUpdateOperationsInput | number
    network?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    wrappedAddress?: NullableStringFieldUpdateOperationsInput | string | null
    symbol?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    decimals?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pairsAsToken1?: PairUncheckedUpdateManyWithoutToken1NestedInput
  }

  export type TokenUpsertWithoutPairsAsToken1Input = {
    update: XOR<TokenUpdateWithoutPairsAsToken1Input, TokenUncheckedUpdateWithoutPairsAsToken1Input>
    create: XOR<TokenCreateWithoutPairsAsToken1Input, TokenUncheckedCreateWithoutPairsAsToken1Input>
    where?: TokenWhereInput
  }

  export type TokenUpdateToOneWithWhereWithoutPairsAsToken1Input = {
    where?: TokenWhereInput
    data: XOR<TokenUpdateWithoutPairsAsToken1Input, TokenUncheckedUpdateWithoutPairsAsToken1Input>
  }

  export type TokenUpdateWithoutPairsAsToken1Input = {
    network?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    wrappedAddress?: NullableStringFieldUpdateOperationsInput | string | null
    symbol?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    decimals?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pairsAsToken0?: PairUpdateManyWithoutToken0NestedInput
  }

  export type TokenUncheckedUpdateWithoutPairsAsToken1Input = {
    id?: IntFieldUpdateOperationsInput | number
    network?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    wrappedAddress?: NullableStringFieldUpdateOperationsInput | string | null
    symbol?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    decimals?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pairsAsToken0?: PairUncheckedUpdateManyWithoutToken0NestedInput
  }

  export type SpikeyAmmSwapUpsertWithWhereUniqueWithoutPairInput = {
    where: SpikeyAmmSwapWhereUniqueInput
    update: XOR<SpikeyAmmSwapUpdateWithoutPairInput, SpikeyAmmSwapUncheckedUpdateWithoutPairInput>
    create: XOR<SpikeyAmmSwapCreateWithoutPairInput, SpikeyAmmSwapUncheckedCreateWithoutPairInput>
  }

  export type SpikeyAmmSwapUpdateWithWhereUniqueWithoutPairInput = {
    where: SpikeyAmmSwapWhereUniqueInput
    data: XOR<SpikeyAmmSwapUpdateWithoutPairInput, SpikeyAmmSwapUncheckedUpdateWithoutPairInput>
  }

  export type SpikeyAmmSwapUpdateManyWithWhereWithoutPairInput = {
    where: SpikeyAmmSwapScalarWhereInput
    data: XOR<SpikeyAmmSwapUpdateManyMutationInput, SpikeyAmmSwapUncheckedUpdateManyWithoutPairInput>
  }

  export type SpikeyAmmSwapScalarWhereInput = {
    AND?: SpikeyAmmSwapScalarWhereInput | SpikeyAmmSwapScalarWhereInput[]
    OR?: SpikeyAmmSwapScalarWhereInput[]
    NOT?: SpikeyAmmSwapScalarWhereInput | SpikeyAmmSwapScalarWhereInput[]
    id?: IntFilter<"SpikeyAmmSwap"> | number
    network?: StringFilter<"SpikeyAmmSwap"> | string
    transactionHash?: StringFilter<"SpikeyAmmSwap"> | string
    eventIndex?: IntFilter<"SpikeyAmmSwap"> | number
    blockNumber?: BigIntFilter<"SpikeyAmmSwap"> | bigint | number
    blockTimestamp?: DateTimeFilter<"SpikeyAmmSwap"> | Date | string
    sender?: StringFilter<"SpikeyAmmSwap"> | string
    to?: StringFilter<"SpikeyAmmSwap"> | string
    amount0In?: BigIntFilter<"SpikeyAmmSwap"> | bigint | number
    amount1In?: BigIntFilter<"SpikeyAmmSwap"> | bigint | number
    amount0Out?: BigIntFilter<"SpikeyAmmSwap"> | bigint | number
    amount1Out?: BigIntFilter<"SpikeyAmmSwap"> | bigint | number
    processedAt?: DateTimeFilter<"SpikeyAmmSwap"> | Date | string
    pairId?: IntFilter<"SpikeyAmmSwap"> | number
  }

  export type DexlynSwapUpsertWithWhereUniqueWithoutPairInput = {
    where: DexlynSwapWhereUniqueInput
    update: XOR<DexlynSwapUpdateWithoutPairInput, DexlynSwapUncheckedUpdateWithoutPairInput>
    create: XOR<DexlynSwapCreateWithoutPairInput, DexlynSwapUncheckedCreateWithoutPairInput>
  }

  export type DexlynSwapUpdateWithWhereUniqueWithoutPairInput = {
    where: DexlynSwapWhereUniqueInput
    data: XOR<DexlynSwapUpdateWithoutPairInput, DexlynSwapUncheckedUpdateWithoutPairInput>
  }

  export type DexlynSwapUpdateManyWithWhereWithoutPairInput = {
    where: DexlynSwapScalarWhereInput
    data: XOR<DexlynSwapUpdateManyMutationInput, DexlynSwapUncheckedUpdateManyWithoutPairInput>
  }

  export type DexlynSwapScalarWhereInput = {
    AND?: DexlynSwapScalarWhereInput | DexlynSwapScalarWhereInput[]
    OR?: DexlynSwapScalarWhereInput[]
    NOT?: DexlynSwapScalarWhereInput | DexlynSwapScalarWhereInput[]
    id?: IntFilter<"DexlynSwap"> | number
    network?: StringFilter<"DexlynSwap"> | string
    transactionHash?: StringFilter<"DexlynSwap"> | string
    sequenceNumber?: StringFilter<"DexlynSwap"> | string
    blockNumber?: BigIntFilter<"DexlynSwap"> | bigint | number
    blockTimestamp?: DateTimeFilter<"DexlynSwap"> | Date | string
    curve?: StringFilter<"DexlynSwap"> | string
    xIn?: BigIntFilter<"DexlynSwap"> | bigint | number
    xOut?: BigIntFilter<"DexlynSwap"> | bigint | number
    yIn?: BigIntFilter<"DexlynSwap"> | bigint | number
    yOut?: BigIntFilter<"DexlynSwap"> | bigint | number
    timestamp?: BigIntFilter<"DexlynSwap"> | bigint | number
    reserveX?: BigIntFilter<"DexlynSwap"> | bigint | number
    reserveY?: BigIntFilter<"DexlynSwap"> | bigint | number
    processedAt?: DateTimeFilter<"DexlynSwap"> | Date | string
    pairId?: IntFilter<"DexlynSwap"> | number
  }

  export type OhlcDataUpsertWithWhereUniqueWithoutPairInput = {
    where: OhlcDataWhereUniqueInput
    update: XOR<OhlcDataUpdateWithoutPairInput, OhlcDataUncheckedUpdateWithoutPairInput>
    create: XOR<OhlcDataCreateWithoutPairInput, OhlcDataUncheckedCreateWithoutPairInput>
  }

  export type OhlcDataUpdateWithWhereUniqueWithoutPairInput = {
    where: OhlcDataWhereUniqueInput
    data: XOR<OhlcDataUpdateWithoutPairInput, OhlcDataUncheckedUpdateWithoutPairInput>
  }

  export type OhlcDataUpdateManyWithWhereWithoutPairInput = {
    where: OhlcDataScalarWhereInput
    data: XOR<OhlcDataUpdateManyMutationInput, OhlcDataUncheckedUpdateManyWithoutPairInput>
  }

  export type OhlcDataScalarWhereInput = {
    AND?: OhlcDataScalarWhereInput | OhlcDataScalarWhereInput[]
    OR?: OhlcDataScalarWhereInput[]
    NOT?: OhlcDataScalarWhereInput | OhlcDataScalarWhereInput[]
    id?: IntFilter<"OhlcData"> | number
    network?: StringFilter<"OhlcData"> | string
    ammSource?: StringFilter<"OhlcData"> | string
    timeframe?: StringFilter<"OhlcData"> | string
    timestamp?: DateTimeFilter<"OhlcData"> | Date | string
    open?: DecimalFilter<"OhlcData"> | Decimal | DecimalJsLike | number | string
    high?: DecimalFilter<"OhlcData"> | Decimal | DecimalJsLike | number | string
    low?: DecimalFilter<"OhlcData"> | Decimal | DecimalJsLike | number | string
    close?: DecimalFilter<"OhlcData"> | Decimal | DecimalJsLike | number | string
    volume?: DecimalFilter<"OhlcData"> | Decimal | DecimalJsLike | number | string
    tradeCount?: IntFilter<"OhlcData"> | number
    createdAt?: DateTimeFilter<"OhlcData"> | Date | string
    updatedAt?: DateTimeFilter<"OhlcData"> | Date | string
    pairId?: IntFilter<"OhlcData"> | number
  }

  export type PairCreateWithoutOhlcDataInput = {
    network: string
    spikeyAmmPairAddress?: string | null
    spikeyAmmReserve0?: bigint | number | null
    spikeyAmmReserve1?: bigint | number | null
    createdAt?: Date | string
    token0: TokenCreateNestedOneWithoutPairsAsToken0Input
    token1: TokenCreateNestedOneWithoutPairsAsToken1Input
    spikeyAmmSwaps?: SpikeyAmmSwapCreateNestedManyWithoutPairInput
    dexlynSwaps?: DexlynSwapCreateNestedManyWithoutPairInput
  }

  export type PairUncheckedCreateWithoutOhlcDataInput = {
    id?: number
    network: string
    token0Id: number
    token1Id: number
    spikeyAmmPairAddress?: string | null
    spikeyAmmReserve0?: bigint | number | null
    spikeyAmmReserve1?: bigint | number | null
    createdAt?: Date | string
    spikeyAmmSwaps?: SpikeyAmmSwapUncheckedCreateNestedManyWithoutPairInput
    dexlynSwaps?: DexlynSwapUncheckedCreateNestedManyWithoutPairInput
  }

  export type PairCreateOrConnectWithoutOhlcDataInput = {
    where: PairWhereUniqueInput
    create: XOR<PairCreateWithoutOhlcDataInput, PairUncheckedCreateWithoutOhlcDataInput>
  }

  export type PairUpsertWithoutOhlcDataInput = {
    update: XOR<PairUpdateWithoutOhlcDataInput, PairUncheckedUpdateWithoutOhlcDataInput>
    create: XOR<PairCreateWithoutOhlcDataInput, PairUncheckedCreateWithoutOhlcDataInput>
    where?: PairWhereInput
  }

  export type PairUpdateToOneWithWhereWithoutOhlcDataInput = {
    where?: PairWhereInput
    data: XOR<PairUpdateWithoutOhlcDataInput, PairUncheckedUpdateWithoutOhlcDataInput>
  }

  export type PairUpdateWithoutOhlcDataInput = {
    network?: StringFieldUpdateOperationsInput | string
    spikeyAmmPairAddress?: NullableStringFieldUpdateOperationsInput | string | null
    spikeyAmmReserve0?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    spikeyAmmReserve1?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token0?: TokenUpdateOneRequiredWithoutPairsAsToken0NestedInput
    token1?: TokenUpdateOneRequiredWithoutPairsAsToken1NestedInput
    spikeyAmmSwaps?: SpikeyAmmSwapUpdateManyWithoutPairNestedInput
    dexlynSwaps?: DexlynSwapUpdateManyWithoutPairNestedInput
  }

  export type PairUncheckedUpdateWithoutOhlcDataInput = {
    id?: IntFieldUpdateOperationsInput | number
    network?: StringFieldUpdateOperationsInput | string
    token0Id?: IntFieldUpdateOperationsInput | number
    token1Id?: IntFieldUpdateOperationsInput | number
    spikeyAmmPairAddress?: NullableStringFieldUpdateOperationsInput | string | null
    spikeyAmmReserve0?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    spikeyAmmReserve1?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    spikeyAmmSwaps?: SpikeyAmmSwapUncheckedUpdateManyWithoutPairNestedInput
    dexlynSwaps?: DexlynSwapUncheckedUpdateManyWithoutPairNestedInput
  }

  export type PairCreateManyToken0Input = {
    id?: number
    network: string
    token1Id: number
    spikeyAmmPairAddress?: string | null
    spikeyAmmReserve0?: bigint | number | null
    spikeyAmmReserve1?: bigint | number | null
    createdAt?: Date | string
  }

  export type PairCreateManyToken1Input = {
    id?: number
    network: string
    token0Id: number
    spikeyAmmPairAddress?: string | null
    spikeyAmmReserve0?: bigint | number | null
    spikeyAmmReserve1?: bigint | number | null
    createdAt?: Date | string
  }

  export type PairUpdateWithoutToken0Input = {
    network?: StringFieldUpdateOperationsInput | string
    spikeyAmmPairAddress?: NullableStringFieldUpdateOperationsInput | string | null
    spikeyAmmReserve0?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    spikeyAmmReserve1?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token1?: TokenUpdateOneRequiredWithoutPairsAsToken1NestedInput
    spikeyAmmSwaps?: SpikeyAmmSwapUpdateManyWithoutPairNestedInput
    dexlynSwaps?: DexlynSwapUpdateManyWithoutPairNestedInput
    ohlcData?: OhlcDataUpdateManyWithoutPairNestedInput
  }

  export type PairUncheckedUpdateWithoutToken0Input = {
    id?: IntFieldUpdateOperationsInput | number
    network?: StringFieldUpdateOperationsInput | string
    token1Id?: IntFieldUpdateOperationsInput | number
    spikeyAmmPairAddress?: NullableStringFieldUpdateOperationsInput | string | null
    spikeyAmmReserve0?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    spikeyAmmReserve1?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    spikeyAmmSwaps?: SpikeyAmmSwapUncheckedUpdateManyWithoutPairNestedInput
    dexlynSwaps?: DexlynSwapUncheckedUpdateManyWithoutPairNestedInput
    ohlcData?: OhlcDataUncheckedUpdateManyWithoutPairNestedInput
  }

  export type PairUncheckedUpdateManyWithoutToken0Input = {
    id?: IntFieldUpdateOperationsInput | number
    network?: StringFieldUpdateOperationsInput | string
    token1Id?: IntFieldUpdateOperationsInput | number
    spikeyAmmPairAddress?: NullableStringFieldUpdateOperationsInput | string | null
    spikeyAmmReserve0?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    spikeyAmmReserve1?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PairUpdateWithoutToken1Input = {
    network?: StringFieldUpdateOperationsInput | string
    spikeyAmmPairAddress?: NullableStringFieldUpdateOperationsInput | string | null
    spikeyAmmReserve0?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    spikeyAmmReserve1?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token0?: TokenUpdateOneRequiredWithoutPairsAsToken0NestedInput
    spikeyAmmSwaps?: SpikeyAmmSwapUpdateManyWithoutPairNestedInput
    dexlynSwaps?: DexlynSwapUpdateManyWithoutPairNestedInput
    ohlcData?: OhlcDataUpdateManyWithoutPairNestedInput
  }

  export type PairUncheckedUpdateWithoutToken1Input = {
    id?: IntFieldUpdateOperationsInput | number
    network?: StringFieldUpdateOperationsInput | string
    token0Id?: IntFieldUpdateOperationsInput | number
    spikeyAmmPairAddress?: NullableStringFieldUpdateOperationsInput | string | null
    spikeyAmmReserve0?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    spikeyAmmReserve1?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    spikeyAmmSwaps?: SpikeyAmmSwapUncheckedUpdateManyWithoutPairNestedInput
    dexlynSwaps?: DexlynSwapUncheckedUpdateManyWithoutPairNestedInput
    ohlcData?: OhlcDataUncheckedUpdateManyWithoutPairNestedInput
  }

  export type PairUncheckedUpdateManyWithoutToken1Input = {
    id?: IntFieldUpdateOperationsInput | number
    network?: StringFieldUpdateOperationsInput | string
    token0Id?: IntFieldUpdateOperationsInput | number
    spikeyAmmPairAddress?: NullableStringFieldUpdateOperationsInput | string | null
    spikeyAmmReserve0?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    spikeyAmmReserve1?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SpikeyAmmSwapCreateManyPairInput = {
    id?: number
    network: string
    transactionHash: string
    eventIndex: number
    blockNumber: bigint | number
    blockTimestamp: Date | string
    sender: string
    to: string
    amount0In: bigint | number
    amount1In: bigint | number
    amount0Out: bigint | number
    amount1Out: bigint | number
    processedAt?: Date | string
  }

  export type DexlynSwapCreateManyPairInput = {
    id?: number
    network: string
    transactionHash: string
    sequenceNumber: string
    blockNumber: bigint | number
    blockTimestamp: Date | string
    curve: string
    xIn: bigint | number
    xOut: bigint | number
    yIn: bigint | number
    yOut: bigint | number
    timestamp: bigint | number
    reserveX: bigint | number
    reserveY: bigint | number
    processedAt?: Date | string
  }

  export type OhlcDataCreateManyPairInput = {
    id?: number
    network: string
    ammSource: string
    timeframe: string
    timestamp: Date | string
    open: Decimal | DecimalJsLike | number | string
    high: Decimal | DecimalJsLike | number | string
    low: Decimal | DecimalJsLike | number | string
    close: Decimal | DecimalJsLike | number | string
    volume: Decimal | DecimalJsLike | number | string
    tradeCount: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SpikeyAmmSwapUpdateWithoutPairInput = {
    network?: StringFieldUpdateOperationsInput | string
    transactionHash?: StringFieldUpdateOperationsInput | string
    eventIndex?: IntFieldUpdateOperationsInput | number
    blockNumber?: BigIntFieldUpdateOperationsInput | bigint | number
    blockTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    sender?: StringFieldUpdateOperationsInput | string
    to?: StringFieldUpdateOperationsInput | string
    amount0In?: BigIntFieldUpdateOperationsInput | bigint | number
    amount1In?: BigIntFieldUpdateOperationsInput | bigint | number
    amount0Out?: BigIntFieldUpdateOperationsInput | bigint | number
    amount1Out?: BigIntFieldUpdateOperationsInput | bigint | number
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SpikeyAmmSwapUncheckedUpdateWithoutPairInput = {
    id?: IntFieldUpdateOperationsInput | number
    network?: StringFieldUpdateOperationsInput | string
    transactionHash?: StringFieldUpdateOperationsInput | string
    eventIndex?: IntFieldUpdateOperationsInput | number
    blockNumber?: BigIntFieldUpdateOperationsInput | bigint | number
    blockTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    sender?: StringFieldUpdateOperationsInput | string
    to?: StringFieldUpdateOperationsInput | string
    amount0In?: BigIntFieldUpdateOperationsInput | bigint | number
    amount1In?: BigIntFieldUpdateOperationsInput | bigint | number
    amount0Out?: BigIntFieldUpdateOperationsInput | bigint | number
    amount1Out?: BigIntFieldUpdateOperationsInput | bigint | number
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SpikeyAmmSwapUncheckedUpdateManyWithoutPairInput = {
    id?: IntFieldUpdateOperationsInput | number
    network?: StringFieldUpdateOperationsInput | string
    transactionHash?: StringFieldUpdateOperationsInput | string
    eventIndex?: IntFieldUpdateOperationsInput | number
    blockNumber?: BigIntFieldUpdateOperationsInput | bigint | number
    blockTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    sender?: StringFieldUpdateOperationsInput | string
    to?: StringFieldUpdateOperationsInput | string
    amount0In?: BigIntFieldUpdateOperationsInput | bigint | number
    amount1In?: BigIntFieldUpdateOperationsInput | bigint | number
    amount0Out?: BigIntFieldUpdateOperationsInput | bigint | number
    amount1Out?: BigIntFieldUpdateOperationsInput | bigint | number
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DexlynSwapUpdateWithoutPairInput = {
    network?: StringFieldUpdateOperationsInput | string
    transactionHash?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: StringFieldUpdateOperationsInput | string
    blockNumber?: BigIntFieldUpdateOperationsInput | bigint | number
    blockTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    curve?: StringFieldUpdateOperationsInput | string
    xIn?: BigIntFieldUpdateOperationsInput | bigint | number
    xOut?: BigIntFieldUpdateOperationsInput | bigint | number
    yIn?: BigIntFieldUpdateOperationsInput | bigint | number
    yOut?: BigIntFieldUpdateOperationsInput | bigint | number
    timestamp?: BigIntFieldUpdateOperationsInput | bigint | number
    reserveX?: BigIntFieldUpdateOperationsInput | bigint | number
    reserveY?: BigIntFieldUpdateOperationsInput | bigint | number
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DexlynSwapUncheckedUpdateWithoutPairInput = {
    id?: IntFieldUpdateOperationsInput | number
    network?: StringFieldUpdateOperationsInput | string
    transactionHash?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: StringFieldUpdateOperationsInput | string
    blockNumber?: BigIntFieldUpdateOperationsInput | bigint | number
    blockTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    curve?: StringFieldUpdateOperationsInput | string
    xIn?: BigIntFieldUpdateOperationsInput | bigint | number
    xOut?: BigIntFieldUpdateOperationsInput | bigint | number
    yIn?: BigIntFieldUpdateOperationsInput | bigint | number
    yOut?: BigIntFieldUpdateOperationsInput | bigint | number
    timestamp?: BigIntFieldUpdateOperationsInput | bigint | number
    reserveX?: BigIntFieldUpdateOperationsInput | bigint | number
    reserveY?: BigIntFieldUpdateOperationsInput | bigint | number
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DexlynSwapUncheckedUpdateManyWithoutPairInput = {
    id?: IntFieldUpdateOperationsInput | number
    network?: StringFieldUpdateOperationsInput | string
    transactionHash?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: StringFieldUpdateOperationsInput | string
    blockNumber?: BigIntFieldUpdateOperationsInput | bigint | number
    blockTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    curve?: StringFieldUpdateOperationsInput | string
    xIn?: BigIntFieldUpdateOperationsInput | bigint | number
    xOut?: BigIntFieldUpdateOperationsInput | bigint | number
    yIn?: BigIntFieldUpdateOperationsInput | bigint | number
    yOut?: BigIntFieldUpdateOperationsInput | bigint | number
    timestamp?: BigIntFieldUpdateOperationsInput | bigint | number
    reserveX?: BigIntFieldUpdateOperationsInput | bigint | number
    reserveY?: BigIntFieldUpdateOperationsInput | bigint | number
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OhlcDataUpdateWithoutPairInput = {
    network?: StringFieldUpdateOperationsInput | string
    ammSource?: StringFieldUpdateOperationsInput | string
    timeframe?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    open?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    high?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    low?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    close?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volume?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tradeCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OhlcDataUncheckedUpdateWithoutPairInput = {
    id?: IntFieldUpdateOperationsInput | number
    network?: StringFieldUpdateOperationsInput | string
    ammSource?: StringFieldUpdateOperationsInput | string
    timeframe?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    open?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    high?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    low?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    close?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volume?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tradeCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OhlcDataUncheckedUpdateManyWithoutPairInput = {
    id?: IntFieldUpdateOperationsInput | number
    network?: StringFieldUpdateOperationsInput | string
    ammSource?: StringFieldUpdateOperationsInput | string
    timeframe?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    open?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    high?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    low?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    close?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volume?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tradeCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}