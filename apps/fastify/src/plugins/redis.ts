import { default as fp } from "fastify-plugin"
import { HookHandlerDoneFunction, FastifyInstance, FastifyPluginCallback } from "fastify"
import { createClient } from "redis"

const REDISURL = process.env.REDISURL || "redis://localhost:6379"
const redis = createClient({
  url: REDISURL,
  database: 0,
})
const redisPlugin: FastifyPluginCallback = async (fastify, opts) => {
  const logger = fastify.log.child({ scope: "redis", type: "plugin" })
  logger.info(REDISURL)
  // initialize all db connections
  fastify.addHook("onReady", (done: HookHandlerDoneFunction) => {
    if (!redis.isOpen) {
      logger.info("redis connection ready")
      redis.once("error", (err: Error) => {
        logger.error(err, "Redis Client Error")
        done(err)
      })
      redis.once("ready", async () => {
        const status = await redis.get("status")
        logger.info("redis connection %s", status)
        done()
      })
      redis.connect()
    }
    else {
      logger.info("redis connection already created")
      done()
    }
  })

  // close all db connections before process.exit
  fastify.addHook("onClose", (
    fastify: FastifyInstance,
    done: HookHandlerDoneFunction
  ) => {
    logger.info("closing redis connections")
    redis.quit()
    done()
  })
  //! can't figure out return type
  fastify.decorate("redis", function (company: string) {
    logger.info("%s redis conn requested", company)
    return redis
  })

}
declare module "fastify" {
  export interface FastifyInstance {
    redis(company: string): any
  }
}
export default fp(redisPlugin, {
  // fastify: "4.x",
  name: "redis"
})