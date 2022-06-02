/* eslint-disable no-unused-vars */
/**
 * For quick access and change in mongodb database
 */
import { MongoClient } from 'mongodb'

// #region BOOTSTRAP
const client = new MongoClient('mongodb://localhost:27018', {
  appName: 'migrations',
  keepAlive: false,
  maxPoolSize: 1,
  directConnection: true
})

client.once('open', async () => {
  console.log('[db] connection open')
  try {
    await main()
  } catch (err) {
    console.log('[main err]', err)
  } finally {
    client.close()
  }
})

client.once('error', (err) => {
  console.log('[db] error', err)
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

export default async function main () {
  console.log('[main]')
}
