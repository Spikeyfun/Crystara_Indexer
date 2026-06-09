import { PrismaClient, Prisma } from '../prisma/dist/generated/sqlite';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();
const backupDir = path.join(__dirname, '..', 'prisma', 'sqlite', 'backup');

// A helper to convert values during the restoration process
function convertRecord(modelName: string, record: any): any {
    const newRecord = { ...record };

    const conversions: { [model: string]: { [key: string]: (v: any) => any } } = {
        token: {
            maxSupply: v => v ? BigInt(v) : null,
            circulatingSupply: v => v ? BigInt(v) : null,
            minTradeVolume: v => v ? new Prisma.Decimal(v) : null,
        },
        pair: {
            spikeyAmmReserve0: v => v ? BigInt(v) : null,
            spikeyAmmReserve1: v => v ? BigInt(v) : null,
        },
        spikeyAmmSwap: {
            blockNumber: v => BigInt(v),
            amount0In: v => BigInt(v),
            amount1In: v => BigInt(v),
            amount0Out: v => BigInt(v),
            amount1Out: v => BigInt(v),
        },
        dexlynSwap: {
            blockNumber: v => BigInt(v),
            xIn: v => BigInt(v),
            xOut: v => BigInt(v),
            yIn: v => BigInt(v),
            yOut: v => BigInt(v),
            timestamp: v => BigInt(v),
            reserveX: v => BigInt(v),
            reserveY: v => BigInt(v),
        },
        ohlcData: {
            open: v => new Prisma.Decimal(v),
            high: v => new Prisma.Decimal(v),
            low: v => new Prisma.Decimal(v),
            close: v => new Prisma.Decimal(v),
            volume: v => new Prisma.Decimal(v),
        },
        eventTracking: {
            blockHeight: v => BigInt(v),
        },
        groupConfiguration: {
            chatId: v => BigInt(v),
        }
    };

    if (conversions[modelName]) {
        for (const key in conversions[modelName]) {
            if (newRecord[key] !== null && newRecord[key] !== undefined) {
                newRecord[key] = conversions[modelName][key](newRecord[key]);
            }
        }
    }
    
    // Set default for the new column if it's missing from backup data
    if (modelName === 'token' && newRecord.minTradeVolume === undefined) {
        newRecord.minTradeVolume = null;
    }

    return newRecord;
}


async function restoreTable(modelName: string) {
    const clientModel = modelName.charAt(0).toLowerCase() + modelName.slice(1);
    console.log(`Restoring ${clientModel}...`);
    const filePath = path.join(backupDir, `${clientModel}.json`);

    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        let data = JSON.parse(fileContent);

        if (!Array.isArray(data) || data.length === 0) {
            console.log(`No data to restore for ${clientModel}. Skipping.`);
            return;
        }

        data = data.map(record => convertRecord(clientModel, record));
        
        // @ts-ignore
        await prisma[clientModel].createMany({
            data: data,
            skipDuplicates: true,
        });

        console.log(`Successfully restored ${data.length} records to ${clientModel}.`);

    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log(`Backup file for ${clientModel} not found. Skipping.`);
        } else {
            console.error(`Error restoring ${clientModel}:`, error);
        }
    }
}

async function main() {
    console.log('Starting data restoration process...');

    // Order is important due to foreign key constraints
    await restoreTable('token');
    await restoreTable('groupConfiguration');
    await restoreTable('pair');
    await restoreTable('spikeyAmmSwap');
    await restoreTable('dexlynSwap');
    await restoreTable('ohlcData');
    await restoreTable('eventTracking');

    console.log('Data restoration finished.');
    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
