import { fastify } from "fastify"
// import { default as GracefulServer } from "@gquittet/graceful-server"

const PORT = 8080
const HOST = "0.0.0.0"
const PREFIX = "api"

const app = fastify({ logger: true })


// if (!process.env.DEV) {
//   const gracefulServer = GracefulServer(app.server)
//   gracefulServer.on(GracefulServer.READY, () => {
//     console.log("[grace] start")
//   })

//   gracefulServer.on(GracefulServer.SHUTTING_DOWN, () => {
//     console.log("[grace] shutting down")
//   })

//   gracefulServer.on(GracefulServer.SHUTDOWN, error => {
//     console.log("[grace] shutdown", error.message)
//   })
// }


app.register(import("./app.js"), { prefix: PREFIX })

app.listen({ port: PORT, host: HOST }, (err, address) => {
  if (err) {
    console.log("error occured", err)
    process.exit(1)
  }
  console.log("Server listing on", address)
})
app.ready((err) => {
  console.log("[plugins]\n", app.printPlugins())
  console.log("[routes]\n", app.printRoutes())
})
