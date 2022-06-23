import { FastifyPluginAsync } from "fastify"

const app: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  const VERSION = process.env.VERSION || 1
  fastify.log.info(VERSION)
  fastify.ready(async () => {
    fastify.log.info("fastify ready")
  })
  //! plugins
  fastify.register(import("./plugins/redis.js"))
  fastify.register(import("./plugins/db.js"))

  //! routes
  fastify.register(import("./routes/root.js"))
  // fastify.register(fastifyAutoload, {
  //   dir: join(__dirname, "routes"),
  //   options: { ...opts, prefix: `/v${VERSION}` },
  //   autoHooks: false,
  //   ignorePattern: /.*(test|spec).js/
  // })
}
export default app