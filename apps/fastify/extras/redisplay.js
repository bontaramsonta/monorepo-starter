/**
 * For quick read and change of redis data
 */
// #region BOOTSTRAP
import { createClient } from "redis"

const REDISURL = process.env.REDISURL || "redis://localhost:6379"
const redis = createClient({
  url: REDISURL
})
redis.once("error", (err) => {
  console.error(err, "Redis Client Error")
})

redis.once("ready", async () => {
  console.log("redis connection made")
  try {
    await main()
  } catch (err) {
    console.log("[Redis Play Err]", err)
  } finally {
    await redis.QUIT()
  }
})

redis.connect()
// #endregion

export async function main() {
  console.log("[main]")
}
