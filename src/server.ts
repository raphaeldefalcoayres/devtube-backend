import { PrismaClient, Prisma } from '@prisma/client'
import { fastify, FastifyReply, FastifyRequest, FastifyInstance } from 'fastify'

const app: FastifyInstance = fastify()

app.addHook('onRequest', (req, res, done) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  )
  done()
})

const prisma = new PrismaClient()

interface VideosParams {
  title?: string
  description?: string
  category?: string
  _limit?: string
  _skip?: string
  page?: string
}

app.get(
  '/videos',
  async (
    req: FastifyRequest<{ Querystring: VideosParams }>,
    reply: FastifyReply,
  ) => {
    const params = req.query
    const where: Prisma.VideoWhereInput = {}

    if (params.title) {
      where.title = { contains: params.title }
    }

    if (params.description) {
      where.description = { contains: params.description }
    }

    if (params.category) {
      where.category = { equals: params.category }
    }

    const limit = parseInt(params._limit ?? '10') // Convert to number, default to 10 videos per page
    const skip = parseInt(params._skip ?? '0') // Convert to number, default to 0
    const page = parseInt(params.page ?? '1') // Convert to number, default to 1

    const count = await prisma.video.count({ where })
    const totalPages = Math.ceil(count / limit)
    const currentPage = Math.min(totalPages, Math.max(1, page)) // Ensure current page is within bounds
    const offset = (currentPage - 1) * limit

    const videos = await prisma.video.findMany({
      where,
      skip: offset + skip,
      take: limit,
    })

    return {
      total: count,
      limit,
      skip,
      currentPage,
      totalPages,
      data: videos,
    }
  },
)

interface ChannelsParams {
  title?: string
  description?: string
  _limit?: string
  _skip?: string
  page?: string
}

app.get(
  '/channels',
  async (
    req: FastifyRequest<{ Querystring: ChannelsParams }>,
    reply: FastifyReply,
  ) => {
    const params = req.query
    const where: Prisma.VideoWhereInput = {}

    if (params.title) {
      where.title = { contains: params.title }
    }

    if (params.description) {
      where.description = { contains: params.description }
    }

    const limit = parseInt(params._limit ?? '10') // Convert to number, default to 10 videos per page
    const skip = parseInt(params._skip ?? '0') // Convert to number, default to 0
    const page = parseInt(params.page ?? '1') // Convert to number, default to 1

    const count = await prisma.video.count({ where })
    const totalPages = Math.ceil(count / limit)
    const currentPage = Math.min(totalPages, Math.max(1, page)) // Ensure current page is within bounds
    const offset = (currentPage - 1) * limit

    const channels = await prisma.channel.findMany({
      where,
      skip: offset + skip,
      take: limit,
    })

    return {
      total: count,
      limit,
      skip,
      currentPage,
      totalPages,
      data: channels,
    }
  },
)

interface VideoParams {
  id: string
}

app.get(
  '/videos/:id',
  async (req: FastifyRequest<{ Params: VideoParams }>, reply: FastifyReply) => {
    const videoId = req.params.id
    const video = await prisma.video.findUnique({
      where: { videoId },
      include: { channel: true },
    })

    if (!video) {
      reply.code(404).send()
      return
    }

    const relatedVideos = await prisma.video.findMany({
      where: {
        category: video.category,
        NOT: { videoId },
      },
      take: 4, // Pega apenas os 4 primeiros vídeos encontrados
    })

    return { video, relatedVideos }
  },
)

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
