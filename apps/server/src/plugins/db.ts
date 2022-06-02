import fp from 'fastify-plugin'
import { HookHandlerDoneFunction, FastifyInstance } from 'fastify'
import { Db } from 'mongodb'
import DbConn from '../utils/DbConn.js'

export default fp(async (fastify, opts) => {
  const logger = fastify.log.child({ scope: 'db', type: 'plugin' })
  // initialize all db connections
  fastify.addHook('onReady', (done: HookHandlerDoneFunction) => {
    logger.info('db plugin ready')
    DbConn
      .init()
      .then((verdict: string) => {
        logger.info(verdict)
        done()
      })
      .catch((reason: string) => {
        logger.error(reason)
        done(new Error(reason))
      })
  })
  // close all db connections before process.exit
  fastify.addHook('onClose', (
    fastify: FastifyInstance,
    done: HookHandlerDoneFunction
  ) => {
    logger.info('closing db connections')
    DbConn
      .close()
      .then((verdict: string) => {
        logger.info(verdict)
        console.log(verdict)
        done()
      })
      .catch((reason: string) => {
        logger.error(reason)
        done(new Error(reason))
      })
  })
  fastify.decorate('db', function (company: string): Db {
    logger.info('%s db conn requested', company)
    return DbConn.getConn(company)
  })
}, {
  name: 'db',
  dependencies: ['redis']
})

declare module 'fastify' {
  export interface FastifyInstance {
    db (company: string): Db
  }
}
