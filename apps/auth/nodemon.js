import nodemon from 'nodemon'
import p from './package.json' assert {type: 'json'}
import c from 'chalk'
import { resolve, join } from 'path'
import { rm } from 'fs/promises'

(async () => {
  const l = (color, msg) => c[color].bold(msg) // colored label
  try {
    if (process.env.FRESH === 1) {
      await rm(join(resolve(), 'dist'), { recursive: true, force: true })
    }
    nodemon({
      exec: 'tsc && node dist/index.js',
      verbose: false,
      ext: 'js,ts',
      watch: './src/**/*.ts',
      colours: true,
      env: {
        DEV: true,
        PORT: 8000,
        HOST: '0.0.0.0',
        VERSION: p.version[0],
        BASE_MONGO_URL: 'mongodb://localhost:27018'
      }
    })
      .on('quit', () => {
        console.log(l('red', '[nodemon quiting] '))
        process.exit(0)
      })
      .on('watching', files => {
        console.log(
          l('green', '[watching] '),
          files.substring(files.lastIndexOf('/') + 1)
        )
      })
      .on('exit', () => {
        console.log(l('red', '[nodemon exiting]'))
      })
      .on('restart', files => {
        console.log(l('red', '[nodemon restarted] '), 'files changed', files)
      })
  } catch (err) {
    console.log(err)
  }
})()
