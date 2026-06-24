# Smart Contract Events Reference (Backend Listener Guide)

This document outlines all the Move events emitted by the DAO Factory smart contracts. Your backend indexer should listen for these events to maintain an up-to-date off-chain state.

> [!NOTE]
> All addresses shown here refer to the Aptos/Supra Account Address type. `legacy` refers to the user's locked veToken NFT/Object address, and `pilgrim` is the internal epoch/week identifier.

---

## 🏛️ DAO Core & Factory Events (`petra.move`, `charter.move`)

These events are related to the creation and administration of the DAO itself.

### `DaoCreated` (`petra.move`)
Emitted when a new DAO is instantiated by the factory.
```move
struct DaoCreated has drop, store {
    creator: address,
    dao_address: address, // The treasury / resource account of the DAO
    name: String,
    is_inflationary: bool,
}
```

### `AdminTransferred` & `AdminRenounced` (`petra.move`)
Tracks ownership changes of the DAO Factory package itself.
```move
struct AdminTransferred { old_admin: address, new_admin: address }
struct AdminRenounced { admin: address, epoch: u64 }
```

### `GuardianUpdated` (`charter.move`)
Emitted when the security Guardian (multi-sig or emergency admin) is updated.
```move
struct GuardianUpdated { dao_address: address, old_guardian: Option<address>, new_guardian: Option<address> }
```

---

## 🔒 ve-Tokenomics & Staking (`legacy.move`)

These events track the locking, extending, and withdrawing of tokens to get voting power (vePower).

### `LockCreated`
Emitted when a user locks tokens for the first time.
```move
struct LockCreated has drop, store {
    owner: address,
    legacy: address, // The Object address of their lock
    dao_address: address,
    amount: u64,
    end_epoch: u64,
    voting_power: u64,
}
```

### `LockExtended` & `AmountIncreased`
Emitted when users modify their existing lock to get more power.
```move
struct LockExtended { owner: address, legacy: address, old_end_epoch: u64, new_end_epoch: u64 }
struct AmountIncreased { owner: address, legacy: address, added_amount: u64, new_total: u64 }
```

### `Withdrawn`
Emitted when the lock expires and the user withdraws their underlying tokens.
```move
struct Withdrawn { owner: address, legacy: address, amount: u64 }
```

### `RebaseCompounded` & `DelegateChanged`
```move
struct RebaseCompounded { legacy: address, amount: u64 }
struct DelegateChanged { legacy: address, owner: address, old_delegate: Option<address>, new_delegate: Option<address> }
```

---

## 🗳️ Governance & Proposals (`herald.move`, `witness.move`, `anchor.move`)

Events tracking the lifecycle of a proposal from creation to execution.

### `ProposalCreated` (`herald.move`)
Listen to this to notify users of a new vote.
```move
struct ProposalCreated has drop, store {
    dao_address: address,
    proposal_id: u64,
    proposer: address,
    title: String,
    start_time: u64,
    end_time: u64,
}
```

### `VoteCast` & `LateQuorumExtended` (`witness.move`)
```move
struct VoteCast has drop, store {
    dao_address: address,
    proposal_id: u64,
    voter: address,
    legacy: address, // The lock used to vote
    support: u8,     // 0 = Against, 1 = For, 2 = Abstain
    weight: u64,     // Voting power used
}

struct LateQuorumExtended { dao_address: address, proposal_id: u64, old_end_time: u64, new_end_time: u64 }
```

### `ProposalExecuted` & `ProposalCanceled` (`anchor.move`)
```move
struct ProposalExecuted { dao_address: address, proposal_id: u64 }
struct ProposalCanceled { dao_address: address, proposal_id: u64 }
```

---

## 💰 Economic Engine (Gauges, Bribes & Epochs)

These events manage the weekly Epoch cycle (`jubilee`), bribes (`restore`), emissions (`zeal`), and fee distributions (`harvest`).

### `EpochAdvanced` (`jubilee.move`)
**CRITICAL:** Emitted when the 7-day epoch turns over. This triggers emissions and unlocks bribes.
```move
struct EpochAdvanced has drop, store {
    dao_address: address,
    pilgrim: u64, // The ID of the current epoch/week
    total_minted: u64,
    gauge_amount: u64,
    rebase_amount: u64,
}
```

### Gauges & Voting (`zeal.move`)
```move
struct GaugeCreated { dao_address: address, gauge_id: u64, destination: address }
struct Voted { dao_address: address, pilgrim: u64, voter: address, legacy: address, power: u128 }
struct EmissionsDistributed { dao_address: address, pilgrim: u64, total_amount: u64 }
```

### Bribes (`restore.move`)
```move
struct BribeDeposited { dao_address: address, depositor: address, pilgrim: u64, gauge_id: u64, token: address, amount: u64 }
struct BribeClaimed { dao_address: address, claimer: address, legacy: address, pilgrim: u64, gauge_id: u64, token: address, amount: u64 }
```

### Rewards & Rebases (`harvest.move`)
```move
struct RewardsInjected { dao_address: address, amount: u64, new_acc: u128 }
struct RewardsClaimed { dao_address: address, claimer: address, legacy: address, amount: u64 }
```

---

## 🚨 Emergency Protocols (`sentinel.move`)

### `ProtocolPaused` & `ProtocolUnpaused`
Listen to this to disable frontend interactions if the protocol is paused.
```move
struct ProtocolPaused { dao_address: address, guardian: address, pause_epoch: u64, expiry_epoch: u64 }
struct ProtocolUnpaused { dao_address: address, caller: address, epoch: u64, was_auto_expired: bool }
```
