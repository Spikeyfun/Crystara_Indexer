import * as assert from 'assert';
import { fuzzyMatch, normalizeAddress } from '../app/indexer/utils/eventMatching';

function testEventMatching() {
    console.log('--- Testing fuzzyMatch & normalizeAddress ---');

    // Case 1: Leading zero differences in Move module addresses
    const actual1 = '0x1::supra_coin::SupraCoin';
    const target1 = '0x01::supra_coin::SupraCoin';
    assert.strictEqual(fuzzyMatch(actual1, target1), true, '0x1 vs 0x01 should match');
    console.log('✅ Case 1 passed: 0x1 vs 0x01');

    // Case 2: 64-char full hex vs short hex
    const shortAddr = '0x1::liquidity_pool::SwapEvent';
    const longAddr = '0x0000000000000000000000000000000000000000000000000000000000000001::liquidity_pool::SwapEvent';
    assert.strictEqual(fuzzyMatch(shortAddr, longAddr), true, 'Short vs 64-char hex should match');
    console.log('✅ Case 2 passed: short vs 64-char hex');

    // Case 3: Whitespace resilience
    const whitespaceActual = ' 0x1::liquidity_pool::SwapEvent \n';
    assert.strictEqual(fuzzyMatch(whitespaceActual, shortAddr), true, 'Whitespace should be trimmed');
    console.log('✅ Case 3 passed: whitespace resilience');

    // Case 4: Non-matching events
    const diffEvent = '0x1::liquidity_pool::SyncEvent';
    assert.strictEqual(fuzzyMatch(shortAddr, diffEvent), false, 'Different events should NOT match');
    console.log('✅ Case 4 passed: different events reject correctly');

    // Case 5: normalizeAddress 64-char canonicalization
    const canon = normalizeAddress('0xa');
    assert.strictEqual(canon.length, 66, 'Canonical address must be 0x + 64 hex chars');
    assert.strictEqual(canon, '0x000000000000000000000000000000000000000000000000000000000000000a', 'Padded to 64 chars');
    console.log('✅ Case 5 passed: normalizeAddress canonical 64-char');

    console.log('🎉 All Event Matching tests passed successfully!');
}

testEventMatching();
