import jwt from 'jsonwebtoken'
import { z } from 'zod'
import type { FastifyRequest, FastifyReply } from 'fastify'
import { env } from '@/env'

interface DecodedToken {
	id: string
	email: string
	firtsName: string
}

declare module 'fastify' {
	interface FastifyRequest {
		user?: DecodedToken
	}
}

export async function AuthVerification(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const jwtSchema = z.object({
		id: z.string(),
		email: z.string(),
		firtsName: z.string(),
	})

	try {
		const token = request.headers.authorization

		if (!token) {
			throw new Error('Token inválido')
		}

		const formatedToken = token.split(' ')[1]
		const decoded = jwt.verify(formatedToken, env.JWT_SECRET) as DecodedToken

		const { email, firtsName, id } = jwtSchema.parse(decoded)

		request.user = { email, firtsName, id }
	} catch (err) {
		if (err instanceof Error) {
			console.log(err.name)
			if (err.name === 'SyntaxError') {
				return reply.status(401).send({ message: 'Token inválido' })
			}

			if (err.name === 'TokenExpiredError') {
				return reply.status(401).send({ message: 'Sessão expirada' })
			}
		}
		return reply.status(500).send({ message: 'Erro ao verificar sessão' })
	}
}
