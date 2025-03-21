import { env } from '@/env'
import type {
	CreateUser,
	FindUserById,
	LoginUser,
	UserRepository,
} from '../interfaces/user.interfaces'
import { UserRepositoryPrisma } from '../repositories/user.repositories'
import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Decimal } from '@prisma/client/runtime/library'

export class UserUseCase {
	private userRepository: UserRepository
	constructor() {
		this.userRepository = new UserRepositoryPrisma()
	}

	async create({ email, name, password }: CreateUser) {
		const hashedPassword = await hash(password, 12)

		await this.userRepository.create({
			email,
			name,
			password: hashedPassword,
		})
	}

	async login({ email, password }: LoginUser) {
		const user = await this.userRepository.login({ email })

		const compareHash = await compare(password, user.password)

		if (!compareHash) {
			throw new Error('Senha incorreta')
		}

		const tokenPayLoad = {
			id: user.id,
			email: user.email,
			firtsName: user.name,
		}

		const token = jwt.sign(tokenPayLoad, env.JWT_SECRET, { expiresIn: '1h' })

		return token
	}

	async findUserById({ id }: FindUserById) {
		const user = await this.userRepository.findUser({ id })

		const newUser = user.transaction?.reduce((acc, transaction) => {
			if (transaction.type.trim().toUpperCase() === 'INCOME') {
				return acc.plus(transaction.amount)
			}
		}, new Decimal(0))

		const netAmount = user.transaction?.reduce((acc, transaction) => {
			if (transaction.type.trim().toUpperCase() === 'INCOME') {
				return acc.plus(transaction.amount)
			}
			if (transaction.type.trim().toUpperCase() === 'EXPENSE') {
				return acc.minus(transaction.amount)
			}
			return acc
		}, new Decimal(0))
	}
}
