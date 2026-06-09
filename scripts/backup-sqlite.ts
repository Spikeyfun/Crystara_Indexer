
import { PrismaClient, Prisma } from '../prisma/dist/generated/sqlite';
import fs from 'fs/promises';
import path from 'path';

// JSON.stringify doesn't support BigInt, so we need a replacer.
const replacer = (key: string, value: any) => {
    if (typeof value === 'bigint') {
        return value.toString();
    }
    // Prisma's Decimal type is an object, convert it to a string representation
    if (value instanceof Prisma.Decimal) {
        return value.toString();
    }
    return value;
};


const prisma = new PrismaClient();
const backupDir = path.join(__dirname, '..', 'prisma', 'sqlite', 'backup');

async function backupTable(modelName: keyof Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$executeRaw' | '$queryRaw' | '$executeRawUnsafe' | '$queryRawUnsafe'>) {
    console.log(`Backing up ${modelName}...`);
    try {
        // @ts-ignore
        const records = await prisma[modelName].findMany();
        if (records.length === 0) {
            console.log(`No records found for ${modelName}. Skipping.`);
            return;
        }

        const json = JSON.stringify(records, replacer, 2);
        const filePath = path.join(backupDir, `${modelName}.json`);
        await fs.writeFile(filePath, json);
        console.log(`Backed up ${records.length} records from ${modelName} to ${filePath}`);

    } catch (error) {
        console.error(`Error backing up ${modelName}:`, error);
    }
}

async function main() {
    await fs.mkdir(backupDir, { recursive: true });
    console.log(`Backup directory ensured at: ${backupDir}`);

    await backupTable('token');
    await backupTable('pair');
    await backupTable('spikeyAmmSwap');
    await backupTable('dexlynSwap');
    await backupTable('ohlcData');
    await backupTable('eventTracking');
    await backupTable('groupConfiguration');

    console.log('Backup process finished.');
    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
