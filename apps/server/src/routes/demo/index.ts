import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    fastify.log.info({ demo: true })
    return { demo: true }
  })
}

export default root
