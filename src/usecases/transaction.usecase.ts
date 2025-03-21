import type {
  CreateTransaction,
  TransactionRepository,
} from '@/interfaces/transaction.interfaces'
import { TransactionRepositoryprisma } from '@/repositories/transaction.repositories'

export class TransactionUseCase {
  private transactionRepository: TransactionRepository
  constructor() {
    this.transactionRepository = new TransactionRepositoryprisma()
  }

  async create({ amount, type, userId }: CreateTransaction) {
    const transaction = await this.transactionRepository.create({
      amount,
      type,
      userId,
    })

    return transaction
  }
}
