import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

const allowCors = (
  app: FastifyInstance,
  _opts: unknown,
  done: (err?: Error | undefined) => void,
) => {
  app.addHook('onRequest', (request: FastifyRequest, reply: FastifyReply) => {
    reply.header('Access-Control-Allow-Origin', '*')
    reply.header(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    )
    reply.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    )
    if (request.method === 'OPTIONS') {
      reply.send()
    }
  })
  done()
}

export default allowCors
