import nodemon from "nodemon"
import c from "chalk"
import { resolve, join } from "path"
import { rm } from "fs/promises"
import { createReadStream } from "fs"
import { json } from "node:stream/consumers"

(async () => {
  const p = await json(createReadStream(join(resolve(), "package.json")))
  const l = (color, msg) => c[color].bold(msg) // colored label
  try {
    if (process.env.FRESH == 1) {
      console.log("\n" + l("yellow", "FRESH") + "\n")
      await rm(join(resolve(), "dist"), { recursive: true, force: true })
    }
    nodemon({
      exec: `tsc && node ${p.module}`,
      verbose: false,
      ext: "js,ts",
      watch: "./src/**/*.ts",
      colours: true,
      env: {
        DEV: true,
        BASE_MONGO_URL: "mongodb://localhost:27018",
        REDIS_URL: "redis://localhost:6379",
      }
    })
      .on("quit", () => {
        console.log(l("red", "[nodemon quiting] "))
        process.exit(0)
      })
      .on("watching", files => {
        console.log(
          l("green", "[watching] "),
          files.substring(files.lastIndexOf("/") + 1)
        )
      })
      .on("exit", () => {
        console.log(l("red", "[nodemon exiting]"))
      })
      .on("restart", files => {
        console.log(l("red", "[nodemon restarted] "), "files changed", files)
      })
  } catch (err) {
    console.log(err)
  }
})()
