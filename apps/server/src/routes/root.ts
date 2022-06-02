import { FastifyPluginAsync } from 'fastify'
import { Users, userSchema } from 'schemas'
const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const user: Users = [
    { name: 'sourav', age: 18 }
  ]
  console.log(user)
  fastify.get('/', {
    schema: {
      body: userSchema
    }
  }, async function (request, reply) {
    fastify.log.info({ red: 'ping' })
    return { root: true }
  })
}

export default root
