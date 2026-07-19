import 'dotenv/config';
import { NEXT_PUBLIC_DAO_CONTRACT_ADDRESS } from '../app/indexer/rpcClient';
const eventTypesToFetch = [
    `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::petra::DaoCreated`,
    `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::jubilee::EpochAdvanced`,
    `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::zeal::GaugeCreated`,
    `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::restore::BribeDeposited`,
    `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::legacy::LockCreated`,
    `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::legacy::LockExtended`,
    `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::legacy::AmountIncreased`,
    `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::legacy::LockMerged`,
    `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::legacy::Withdrawn`,
    `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::witness::VoteCast`,
    `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::herald::ProposalCreated`,
    `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::anchor::ProposalQueued`,
    `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::anchor::ProposalExecuted`,
    `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::anchor::ProposalCanceled`,
    `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::charter::DaoConfigUpdated`,
    `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::charter::GuardianUpdated`,
    `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::zeal::Voted`,
    `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::restore::BribeClaimed`,
    `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::harvest::RewardsClaimed`,
    `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::sentinel::ProtocolPaused`,
    `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::sentinel::ProtocolUnpaused`,
  ];
console.log(eventTypesToFetch);
