/* eslint-disable no-unused-vars */
/**
 * For quick access and change in mongodb database
 */
import { MongoClient } from "mongodb"

// #region BOOTSTRAP
const client = new MongoClient("mongodb://localhost:27018", {
  appName: "migrations",
  keepAlive: false,
  maxPoolSize: 1,
  directConnection: true
})

client.once("open", async () => {
  console.log("[db] connection open")
  try {
    await main()
  } catch (err) {
    console.log("[main err]", err)
  } finally {
    client.close()
  }
})

client.once("error", (err) => {
  console.log("[db] error", err)
})

client.connect()

//* Snippets
//* get a collection
// client.db(dbName).collection(colName)
//* drop collection
// await client.db(dbName).dropCollection(colName)
// client.db(dbName).
//* loop documents
/**
 * docs.forEach(d=>{
 *  console.log(d)
 * })
 */
// #endregion

export default async function main() {
  console.log("[main]")
  client.db("global").collection("base").insertOne({
    appList: ["cabigo", "getTaxi", "fleto"],
    apps: {
      cabigo: {
        name: "cabigo",
        remote: false,
        url: "mongodb://localhost:27017/cabigo",
        connOptions: {
          maxPoolSize: 1,
          directConnection: true
        }
      },
      getTaxi: {
        name: "getTaxi",
        remote: false,
        url: "mongodb://localhost:27017/getTaxi",
        connOptions: {
          maxPoolSize: 1,
          directConnection: true
        }
      },
      fleto: {
        name: "fleto",
        remote: false,
        url: "mongodb://localhost:27017/fleto",
        connOptions: {
          maxPoolSize: 1,
          directConnection: true
        }
      }
    }
  })
  client.db("cabigo").collection("base").insertOne({
    name: "cabigo",
    fullName: "Cabigo Taxi",
    services: ["local", "outstation", "rental"],
    roles: ["admin", "sup-admin", "sub-admin", "driver", "user"],
    users: ["user:get-own", "user:set-own", "booking:get-one"]
  })
}
