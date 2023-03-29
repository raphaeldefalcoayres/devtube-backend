import { PrismaClient } from '@prisma/client'
import { fastify, FastifyReply, FastifyRequest } from 'fastify'

const app = fastify()

const prisma = new PrismaClient()

app.get('/videos', async () => {
  const users = await prisma.video.findMany()
  return { users }
})

app.get('/channels', async () => {
  const channels = await prisma.channel.findMany()
  return { channels }
})

interface ChannelParams {
  id: string
}

app.get(
  '/channels/:id',
  async (
    req: FastifyRequest<{ Params: ChannelParams }>,
    reply: FastifyReply,
  ) => {
    const channelId = req.params.id
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      include: { videos: true },
    })
    return { channel }
  },
)

app
  .listen({
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  })
  .then(() => {
    console.log('HTTP Server Running')
  })
