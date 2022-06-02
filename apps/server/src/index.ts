import fastify from 'fastify'
const app = fastify({ logger: true })

const PORT = process.env.PORT || 8080
const HOST = process.env.HOST || '0.0.0.0'
app.get('/health', (request, reply) => {
  reply.send({ status: 'ok' })
})
app.register(import('./app.js'))
app.listen(PORT, HOST, (err, address) => {
  if (err) {
    console.log('error occured', err)
    process.exit(1)
  }
  console.log('Server listing on', address)
})
