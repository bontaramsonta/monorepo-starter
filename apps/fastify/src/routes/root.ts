import { FastifyPluginAsync } from "fastify"
const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.log.info("root plugin")
  fastify.route({
    method: "GET",
    url: "/",
    schema: {
      querystring: {
        q: { type: "string" }
      },
      response: {
        200: {
          type: "object",
          properties: {
            ping: { type: "string" }
          }
        }
      },
      tags: ["ping"],
      summary: "ping",
      description: "ping the server",
      // security: [{ bearerAuth: [] }]
    },
    handler: async (request, reply) => {
      reply.send({ ping: `@${new Date().toISOString()}` })
    },
    onRequest: (request, reply, done) => {
      fastify.log.info("root onRequest")
      done()
    },
    preValidation: (request, reply, done) => {
      fastify.log.info("root preValidation")
      done()
    },
    preHandler: (request, reply, done) => {
      fastify.log.info("root preHandler")
      done()
    },
    onSend: (request, reply, payload, done) => {
      fastify.log.info("root onSend")
      done()
    },
    onResponse: (request, reply, done) => {
      fastify.log.info("root onResponse")
      done()
    },
    onError: (request, reply, error, done) => {
      fastify.log.info("root onError", error)
      done()
    },
  })
}

export default root