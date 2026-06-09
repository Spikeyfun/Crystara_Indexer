import { PrismaClient, Prisma } from '../prisma/dist/generated/sqlite';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();
const backupDir = path.join(__dirname, '..', 'prisma', 'sqlite', 'backup');

const replacer = (key: string, value: any) => {
    if (typeof value === 'bigint') {
        return value.toString();
    }
    if (value instanceof Prisma.Decimal) {
        return value.toString();
    }
    return value;
};

async function backupTokenRaw() {
    console.log('Backing up Token table with a raw query...');
    try {
        // Select all columns that exist in the old database schema for the Token table.
        const records: any[] = await prisma.$queryRaw`
            SELECT id, network, address, wrappedAddress, symbol, name, decimals, maxSupply, circulatingSupply, createdAt 
            FROM Token
        `;

        if (records.length === 0) {
            console.log('No records found in Token table. Skipping.');
            return;
        }

        const json = JSON.stringify(records, replacer, 2);
        const filePath = path.join(backupDir, 'token.json');
        await fs.writeFile(filePath, json);
        console.log(`Successfully backed up ${records.length} records from Token to ${filePath}`);
    } catch (error) {
        console.error('Failed to back up Token table:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

backupTokenRaw();
