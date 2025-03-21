import type {
  CreateTransaction,
  Transaction,
  TransactionRepository,
} from '@/interfaces/transaction.interfaces'
import { prismaClient } from '@/prisma'

export class TransactionRepositoryprisma implements TransactionRepository {
  async create({
    amount,
    type,
    userId,
  }: CreateTransaction): Promise<Transaction> {
    const transaction = await prismaClient.transaction.create({
      data: {
        type,
        amount,
        userId,
      },
    })

    return transaction
  }
}
