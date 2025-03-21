import { fastify } from 'fastify'
import { env } from './env'
import { userRoutes } from './routes/user.routes'
import cors from '@fastify/cors'
import fastifyCookie from '@fastify/cookie'
import { transactionRoutes } from './routes/Transaction.routes'
const server = fastify()

server.register(cors, {
	methods: ['GET', 'PUT', 'DELETE', 'PATCH', 'POST'],
	origin: '*',
})
server.register(fastifyCookie)

server.get('/helloworld', (request, reply) => {
	return reply.send({
		myName: 'Pedro',
		age: 25,
		project: 'transaction control',
	})
})

server.register(userRoutes)
server.register(transactionRoutes)

server
	.listen({
		port: env.PORT,
		host: '0.0.0.0',
	})
	.then(() => console.log(`HTTP server running in port ${env.PORT}`))
