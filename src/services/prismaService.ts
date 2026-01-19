import { PrismaClient } from '@prisma/client';

/**
 * Singleton Prisma client service.
 */
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

export default prisma;
