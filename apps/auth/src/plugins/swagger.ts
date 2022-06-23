import fp from 'fastify-plugin'
import swagger from '@fastify/swagger'

export default fp(async (fastify, opts) => {
  fastify.register(swagger, {
    routePrefix: '/documentation',
    exposeRoute: true,
    swagger: {
      info: {
        title: 'Fleto API docs',
        description: 'auth module (still in dev)',
        version: '1.0.0'
      },
      host: 'localhost:8000',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json']
    }
  })
})
