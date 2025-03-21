import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { UserUseCase } from '../usecases/user.usecase'
import { Prisma } from '@prisma/client'
import { env } from '@/env'
import { AuthVerification } from '@/middleware/auth'

const userUseCase = new UserUseCase()

export function userRoutes(app: FastifyInstance) {
	app.post('/user', async (request, reply) => {
		const userSchema = z.object({
			name: z.string(),
			email: z.string().email(),
			password: z.string(),
		})

		try {
			const { email, name, password } = userSchema.parse(request.body)

			await userUseCase.create({ email, name, password })
			const token = await userUseCase.login({ email, password })

			return reply
				.status(201)
				.setCookie('token', token, {
					httpOnly: true,
					secure: env.NODE_ENV === 'PRODUCTION',
					sameSite: 'strict',
					path: '/',
					maxAge: 3600,
				})
				.send({ message: 'Usuário cadastrado com sucesso', token: token })
		} catch (err) {
			if (err instanceof z.ZodError) {
				return reply.status(400).send({
					message: 'Erro de validação de dados',
					errors: err.errors,
				})
			}

			if (err instanceof Prisma.PrismaClientKnownRequestError) {
				if (err.code === 'P2002') {
					return reply.status(409).send({ message: 'Email já cadastrado' })
				}

				return reply.status(500).send({ message: 'Erro do servidor' })
			}
		}
	})

	app.post('/login', async (request, reply) => {
		const userSchema = z.object({
			email: z.string().email(),
			password: z.string(),
		})

		try {
			const { email, password } = userSchema.parse(request.body)
			const token = await userUseCase.login({ email, password })

			return reply
				.setCookie('token', token, {
					httpOnly: true,
					secure: env.NODE_ENV === 'PRODUCTION',
					sameSite: 'strict',
					path: '/',
					maxAge: 3600,
				})
				.send({ token: token })
		} catch (err) {
			if (err instanceof z.ZodError) {
				return reply.status(400).send({
					message: 'Erro de validação de dados',
					errors: err.errors,
				})
			}

			if (err instanceof Error) {
				if (err.message === 'Usuário não encontrado') {
					return reply.status(401).send({ message: err.message })
				}

				if (err.message === 'Senha incorreta') {
					return reply.status(401).send({ message: err.message })
				}
			}
		}
	})

	app.post('/logoff', async (requst, reply) => {
		return reply
			.clearCookie('token', {
				httpOnly: true,
				secure: env.NODE_ENV === 'PRODUCTION',
				sameSite: 'strict',
				path: '/',
			})
			.send({ message: 'Logout realizado com sucesso' })
	})

	app.get('/test', { preHandler: AuthVerification }, async (request, reply) => {
		return reply.send('entrou aqui')
	})

	app.get(
		'/user/amout',
		{ preHandler: AuthVerification },
		async (request, reply) => {
			if (!request.user) {
				return reply.status(401).send({ message: 'Usuário não logado' })
			}

			const user = await userUseCase.findUserById(request.user)
			// console.log(user)
		},
	)
}
