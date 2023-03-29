import { google, youtube_v3 } from 'googleapis'
import { PrismaClient } from '@prisma/client'
import { franc } from 'franc'

import { isBrazilianChannel, parseISO8601Duration } from './utils'

// Configuração da API do YouTube
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY,
})

async function fetchAndSaveVideos(prisma: PrismaClient) {
  try {
    const searchKeywords = [
      'javascript',
      'typescript',
      'html',
      'css',
      'react native',
      'react.js',
      'next.js',
      'node.js',
    ]
    const promises = searchKeywords.map(async (keyword) => {
      const params: youtube_v3.Params$Resource$Search$List = {
        part: ['snippet'],
        q: keyword,
        type: ['video'],
        videoDuration: 'medium',
        maxResults: 100,
        regionCode: 'BR',
        relevanceLanguage: 'pt',
        publishedAfter: '2023-01-01T00:00:00Z',
        publishedBefore: '2023-12-31T23:59:59Z',
      }
      // Busca os vídeos na API do YouTube
      const res = await youtube.search.list(params)

      // Itera sobre os vídeos encontrados e os salva no banco de dados
      for (const item of res.data.items || []) {
        const channelId = item?.snippet?.channelId

        const channelParams: youtube_v3.Params$Resource$Channels$List = {
          part: ['snippet'],
          id: [channelId!],
        }

        const channelResponse = await youtube.channels.list(channelParams)

        let channelSnippet
        if (
          channelResponse.data.items &&
          channelResponse.data.items.length > 0
        ) {
          channelSnippet = channelResponse.data.items[0].snippet
        }

        // console.log('channelSnippet', channelSnippet)

        if (!isBrazilianChannel(channelSnippet?.title!)) {
          continue
        }

        let newChannel

        const existingChannel = await prisma.channel.findFirst({
          where: { title: channelSnippet?.title! },
        })

        if (!existingChannel) {
          newChannel = await prisma.channel.create({
            data: {
              title: channelSnippet?.title!,
              description: channelSnippet?.description!,
              customUrl: channelSnippet?.customUrl!,
              publishedAt: channelSnippet?.publishedAt!,
              defaultThumbnailUrl: channelSnippet?.thumbnails?.default?.url!,
              defaultThumbnailWidth:
                channelSnippet?.thumbnails?.default?.width!,
              defaultThumbnailHeight:
                channelSnippet?.thumbnails?.default?.height!,
              mediumThumbnailUrl: channelSnippet?.thumbnails?.medium?.url!,
              mediumThumbnailWidth: channelSnippet?.thumbnails?.medium?.width!,
              mediumThumbnailHeight:
                channelSnippet?.thumbnails?.medium?.height!,
              highThumbnailUrl: channelSnippet?.thumbnails?.high?.url!,
              highThumbnailWidth: channelSnippet?.thumbnails?.high?.width!,
              highThumbnailHeight: channelSnippet?.thumbnails?.high?.height!,
            },
          })

          // console.log('Channel saved successfully:', newChannel)
        } else {
          newChannel = existingChannel
        }

        const videoParams: youtube_v3.Params$Resource$Videos$List = {
          part: ['snippet', 'contentDetails', 'statistics', 'topicDetails'],
          id: [item?.id?.videoId!],
        }

        const videoResponse = await youtube.videos.list(videoParams)
        const videoContentDetails =
          videoResponse?.data?.items?.[0].contentDetails
        const videoSnippet = videoResponse?.data?.items?.[0].snippet
        const videoStatistics = videoResponse?.data?.items?.[0].statistics
        const duration = parseISO8601Duration(videoContentDetails?.duration!)

        const categoryParams: youtube_v3.Params$Resource$Videocategories$List =
          {
            id: [videoSnippet?.categoryId!],
            part: ['snippet'],
          }

        const categoryResponse = await youtube.videoCategories.list(
          categoryParams,
        )

        const category = categoryResponse?.data?.items?.[0]?.snippet?.title

        // Identifica o idioma do texto
        const languageInfo = franc(item?.snippet?.title!)

        // console.log(`title`, item?.snippet?.title)
        // console.log(`languageInfo`, languageInfo)

        // if (languageInfo === 'por') {
        //   console.log('O idioma é português do Brasil')
        // } else {
        //   console.log('O idioma NÃO é português do Brasil')
        //   continue
        // }

        // console.log('item', item)
        // console.log('videoResponse', videoResponse.data.items)

        const videoDetails = {
          channelId: newChannel?.id,
          channelTitle: channelSnippet?.title,
          channelLogo: channelSnippet?.thumbnails?.high?.url,
          publishTime: new Date(item?.snippet?.publishedAt!),
          videoId: item?.id?.videoId,
          title: item?.snippet?.title,
          description: item?.snippet?.description,
          thumbnail: item?.snippet?.thumbnails?.high?.url,
          duration,
          viewCount: parseInt(videoStatistics?.viewCount!),
          likeCount: parseInt(videoStatistics?.likeCount!),
          commentCount: parseInt(videoStatistics?.commentCount!),
          favoriteCount: parseInt(videoStatistics?.favoriteCount!),
          positiveVotes: 0,
          negativeVotes: 0,
          relevance: 0,
          tags: videoSnippet?.tags ? videoSnippet.tags.join(', ') : '',
          topics: '',
          segment: category,
          language: languageInfo,
          category:
            keyword && keyword.replace('aprenda ', '').replace('sobre ', ''),
        }

        // console.log('videoDetails', videoDetails)

        const existingVideo = await prisma.video.findUnique({
          where: { videoId: videoDetails.videoId! },
        })

        if (!existingVideo) {
          const newVideo = await prisma.video.create({ data: videoDetails })
          // console.log('Video saved successfully:', newVideo)
        } else {
          const updatedVideo = await prisma.video.update({
            where: { id: existingVideo.id },
            data: videoDetails,
          })
          // console.log('Video updated successfully:', updatedVideo)
        }
        console.log('ok')
      }
    })

    const result = await Promise.all(promises)

    console.log(`${result.length} videos saved or updated successfully.`)
  } catch (err) {
    console.error('Error fetching and saving videos:', err)
  }
}

// Cria uma instância do Prisma Client
const prisma = new PrismaClient()

// Chama a função para buscar e salvar os vídeos
fetchAndSaveVideos(prisma)
  .then(() => {
    console.log('Videos fetched and saved successfully')
  })
  .catch((err) => {
    console.error('Error fetching and saving videos:', err)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
