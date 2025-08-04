import { sqliteDb as prismadb } from '@/lib/prismadb';

export interface DexlynSwapEventData {
  curve: string;
  pair_x: string;
  pair_y: string;
  reserve_x: string;
  reserve_y: string;
  timestamp: string;
  x_in: string;
  x_out: string;
  y_in: string;
  y_out: string;
}

export interface SpikeyAmmSwapEventData {
  amount0_in: string;
  amount0_out: string;
  amount1_in: string;
  amount1_out: string;
  pair_address: string;
  sender: string;
  to: string;
}

export interface SyncEventData {
  reserve0: string;
  reserve1: string;
  pair_address: string;
}

export interface RpcEvent {
  type: string;
  guid: any;
  sequence_number: string;
  data: any; // This will be refined by specific event handlers
  network: string;
  blockHeight?: string | number;
  transactionHash?: string;
  timestamp: string | number;
  // New fields to pass processed values
  processedTransactionHash: string;
  processedSequenceNumber: string;
}

export type TransactionClient = Omit<
  typeof prismadb,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export interface EventOptionStringVec {
  vec: string[];
}

export interface PoolRegisteredEventData {
  pool_key: {
    creator_addr: string;
    stake_addr: string;
    reward_addr: string;
  };
  is_dynamic: boolean;
  start_timestamp: string;
  initial_end_timestamp: string;
  initial_reward_per_sec: string;
  boost_enabled: boolean;
  boost_config_collection_owner?: EventOptionStringVec | null;
  boost_config_collection_name?: EventOptionStringVec | null;
  boost_config_percent?: EventOptionStringVec | null;
}