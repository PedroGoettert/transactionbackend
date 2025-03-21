import type { Decimal } from '@prisma/client/runtime/library'
export interface Transaction {
	id: string
	type: TransactionType
	amount: Decimal
	date: Date
	userId: string
}

export interface CreateTransaction {
	type: TransactionType
	amount: number
	userId: string
}

export interface TransactionRepository {
	create(data: CreateTransaction): Promise<Transaction>
}

export type TransactionType = 'INCOME' | 'EXPENSE'
