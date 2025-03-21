import type {
	CreateUser,
	FindUserByEmail,
	FindUserById,
	LoginUser,
	User,
	UserRepository,
} from '../interfaces/user.interfaces'
import { prismaClient } from '../prisma/index'

export class UserRepositoryPrisma implements UserRepository {
	async create(data: CreateUser): Promise<User> {
		const user = await prismaClient.user.create({
			data: {
				email: data.email,
				name: data.name,
				password: data.password,
				transaction: {
					create: [],
				},
			},
		})
		return user
	}

	async login({ email }: FindUserByEmail): Promise<User> {
		const user = await prismaClient.user.findUnique({
			where: {
				email,
			},
		})

		if (!user) {
			throw new Error('Usuário não encontrado')
		}

		return user
	}

	async findUser({ id }: FindUserById): Promise<User> {
		const user = await prismaClient.user.findUnique({
			where: {
				id,
			},
			include: {
				transaction: true,
			},
		})

		if (!user) {
			throw new Error('Usuário não encontrado')
		}

		return user
	}
}
