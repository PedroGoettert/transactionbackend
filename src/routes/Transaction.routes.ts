import type { FastifyInstance } from 'fastify'
import { TransactionUseCase } from '@/usecases/transaction.usecase'
import { AuthVerification } from '@/middleware/auth'
import { z } from 'zod'

const transactionUseCase = new TransactionUseCase()

export async function transactionRoutes(app: FastifyInstance) {
	app.post(
		'/transaction',
		{ preHandler: AuthVerification },
		async (request, reply) => {
			const transactionSchema = z.object({
				type: z.enum(['INCOME', 'EXPENSE']).default('INCOME'),
				amount: z.number().min(0.1),
				category: z.string().nonempty(),
			})

			const userSchema = z.object({
				id: z.string(),
			})

			if (!request.user) {
				return reply.status(401).send('Usuário não autorizado')
			}

			try {
				const { amount, type, category } = transactionSchema.parse(request.body)
				const { id } = userSchema.parse(request.user)

				const transaction = await transactionUseCase.create({
					amount,
					type,
					userId: id,
					category,
				})

				return reply.send({ message: 'Transação criada', transaction })
			} catch (err) {
				throw new Error('erro no servidor')
			}
		},
	)

	app.get(
		'/amout',
		{ preHandler: AuthVerification },
		async (request, reply) => {},
	)
}
