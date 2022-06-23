import fastify from 'fastify'
import sensible from './plugins/sensible.js'
import swagger from './plugins/swagger.js'
const app = fastify({ logger: false })

const PORT = process.env.PORT || 8000
const HOST = process.env.HOST || '0.0.0.0'
app.get('/health', (request, reply) => {
  reply.send({ status: 'ok' })
})
app.register(sensible)
app.register(swagger)

app.get('/', {
  schema: {
    description: 'get the status of the module',
    tags: ['ping'],
    response: {
      200: {
        type: 'object',
        properties: {
          status: {
            const: 'ok'
          }
        }
      },
      401: {
        type: 'object',
        properties: {
          response: {
            enum: [
              'you are not authorized to use this service',
              'too many unsuccessful attempts'
            ]
          }
        }
      },
      500: {
        type: 'object',
        properties: {
          response: { type: 'string' }
        }
      }
    }
  }
}, (request, reply) => {
  // reply.send({ status: 'ok' })
  reply.status(401).send({ response: 'you are not authorized to use this service' })
  // reply.status(500).send({ response: 'something is wrong' })
})
app.listen(PORT, HOST, (err, address) => {
  if (err) {
    console.log('error occured', err)
    process.exit(1)
  }
  console.log('Server listing on', address)
})
