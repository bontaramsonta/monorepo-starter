import autoLoad from '@fastify/autoload'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { FastifyPluginAsync } from 'fastify'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  const VERSION = process.env.VERSION || 1
  fastify.log.info(VERSION)

  //! plugins
  fastify.register(autoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts
  })

  //! routes
  fastify.register(autoLoad, {
    dir: join(__dirname, 'routes'),
    options: { ...opts, prefix: `/v${VERSION}` },
    autoHooks: true,
    autoHooksPattern: /^[_.]?auto_?hooks(\.js|\.cjs|\.mjs)$/i,
    cascadeHooks: false
  })
}
export default app
export { app }
