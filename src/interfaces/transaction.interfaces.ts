import type { Decimal } from '@prisma/client/runtime/library'
export interface Transaction {
	id: string
	type: TransactionType
	category: string | null
	amount: Decimal
	date: Date
	userId: string
}

export interface CreateTransaction {
	type: TransactionType
	amount: number
	userId: string
	category: string
}

export interface TransactionRepository {
	create(data: CreateTransaction): Promise<Transaction>
}

export type TransactionType = 'INCOME' | 'EXPENSE'
