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
		category,
	}: CreateTransaction): Promise<Transaction> {
		const transaction = await prismaClient.transaction.create({
			data: {
				type,
				amount,
				userId,
				category,
			},
		})

		return transaction
	}
}
