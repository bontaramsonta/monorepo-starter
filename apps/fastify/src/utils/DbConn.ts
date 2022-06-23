import { Db, MongoClient, MongoOptions } from "mongodb"

const MONGOBASEURL = process.env.BASE_MONGO_URL || "mongodb://localhost:27017"

type DbConnAppsType = {
  name: string
  conn: MongoClient
}

type AppObjectType = {
  name: string,
  remote: boolean,
  url: string | null,
  conn_options: MongoOptions | null,
  [x: string]: any
}

class DbConn {
  // eslint-disable-next-line no-use-before-define
  private static _DbConn: DbConn
  private base: MongoClient | null = null
  private apps: DbConnAppsType[] = []

  private setBase(base: MongoClient) {
    if (!base) { this.base = base }
  }

  private pushApps(app: DbConnAppsType) {
    this.apps.push(app)
  }

  static async init(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!DbConn._DbConn) {
        DbConn._DbConn = new DbConn()
        const client = new MongoClient(MONGOBASEURL, {
          appName: "fleto-global",
          keepAlive: false,
          maxPoolSize: 1,
          directConnection: true
        })
        client.connect()
        client.once("error", function () {
          console.log("[db] error")
          reject(new Error("db connection failed"))
        })
        client.once("open", async () => {
          console.log("[db] base connection made")
          DbConn._DbConn.setBase(client)

          // Get apps db connection object
          const doc = await client.db("global").collection("base").findOne()
          console.log(doc?.apps)
          if (doc) {
            // console.log(1);
            Promise.all(
              doc.appList.map((app: string): Promise<string> => {
                // console.log(2);
                return new Promise((resolve, reject) => {
                  try {
                    // console.log(3);
                    const appObject: AppObjectType = doc.apps[app]

                    const appConnection = new MongoClient(MONGOBASEURL, {
                      appName: `fleto-${appObject.name}`,
                      keepAlive: false,
                      // maxPoolSize: 1,
                      // directConnection: true
                      ...appObject.conn_options
                    })
                    appConnection.connect()
                    appConnection.once("open", async () => {
                      // console.log(4);
                      console.log(`${app} connection open`)
                      // let baseDoc = await appConnection.db(app).collection('base').findOne({})
                      // console.log(baseDoc); //? log base obj for companies
                      DbConn._DbConn.pushApps({ name: app, conn: appConnection })
                      resolve(`${app} connection open`)
                    })
                    appConnection.once("error", (connErr) => {
                      // console.log(-4);
                      console.log(`${app} connection error`)
                      reject(new Error(`${app} connection err ${connErr.message}`))
                    })
                  } catch (err) {
                    console.log(`${app} db err`, err)
                    reject(err)
                  }
                }) // app promise
              }) // doc.map
            ).then(() => {
              resolve("all connections established")
            }).catch((reason: Error) => {
              reject(reason.message)
            })
          } else {
            console.log("db global base not found")
          }
        }) // db "open"
      } else {
        resolve("already init")
      }
    }) // top-level promise
  }

  static getConn(app?: string): Db {
    if (app) {
      // give specific app connection
      if (DbConn._DbConn.apps.length === 0) {
        throw new Error("not initialized")
      }
      const selectedApp = DbConn._DbConn.apps.filter(a => a.name === app)
      if (selectedApp.length === 0) {
        throw new Error("app not found")
      }
      return selectedApp[0].conn.db(`${selectedApp[0].name}`)
    } else if (DbConn._DbConn.base) {
      return DbConn._DbConn.base.db("global")
    } else {
      throw new Error("not initialized")
    }
  }

  static close(): Promise<string> {
    return new Promise((resolve, reject) => {
      const base = DbConn._DbConn.base
      const apps = DbConn._DbConn.apps
      // close base connection to db
      if (base) {
        base.once("close", () => {
          // then close all app connections
          Promise.all(
            apps.map((app): Promise<void> => {
              return new Promise<void>((resolve, reject) => {
                try {
                  app.conn.once("close", () => {
                    console.log(`${app.name} db conn closed`)
                    resolve()
                  })
                  app.conn.close()
                } catch (err) {
                  console.log(`${app.name} db err`, err)
                  reject(err)
                }
              })
            })
          ).then(() => {
            resolve("all db connections closed")
          }).catch(() => {
            reject(new Error("db conn closing err"))
          })
        })
        base.close()
      }
    })
  }
}
export default DbConn
export { DbConn }
