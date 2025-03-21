import type { Transaction } from '@prisma/client'
import { string } from 'zod'

export interface User {
	id: string
	name: string
	email: string
	password: string
	createdAt: Date
	updatedAt?: Date | null
	transaction?: Transaction[]
}

export interface CreateUser {
	name: string
	email: string
	password: string
}

export interface LoginUser {
	email: string
	password: string
}

export interface FindUserByEmail {
	email: string
}

export interface FindUserById {
	id: string
}

export interface UserRepository {
	create(data: CreateUser): Promise<User>
	login(data: FindUserByEmail): Promise<User>
	findUser({ id }: FindUserById): Promise<User>
}
