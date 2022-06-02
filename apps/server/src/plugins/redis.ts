import fp from 'fastify-plugin'
import { HookHandlerDoneFunction, FastifyInstance } from 'fastify'
import { createClient } from 'redis'

export default fp(async (fastify, opts) => {
  const logger = fastify.log.child({ scope: 'redis', type: 'plugin' })
  const REDISURL = process.env.REDISURL || 'redis://localhost:6379'
  const redis = createClient({
    url: REDISURL
  })
  // initialize all db connections
  fastify.addHook('onReady', (done: HookHandlerDoneFunction) => {
    logger.info('redis connection ready')
    redis.once('error', (err: Error) => {
      logger.error(err, 'Redis Client Error')
      done(err)
    })
    redis.once('ready', async () => {
      const status = await redis.get('status')
      logger.info('redis connection %s', status)
      done()
    })
    redis.connect()
  })
  // close all db connections before process.exit
  fastify.addHook('onClose', (
    fastify: FastifyInstance,
    done: HookHandlerDoneFunction
  ) => {
    logger.info('closing redis connections')
    done()
  })
  //! can't figure out return type
  fastify.decorate('redis', function (company: string) {
    logger.info('%s redis conn requested', company)
    return redis
  })
}, {
  name: 'redis'
})

declare module 'fastify' {
  export interface FastifyInstance {
    redis (company: string): any
  }
}
