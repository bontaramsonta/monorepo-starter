import c from 'chalk'
import { writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
console.log(__dirname)
const type = process.argv[2]
const title = process.argv[3]
if (type === '--help' || process.argv.length === 2) {
  console.log("save the play file's main fn code in archive with a title.\nTo run\n", c.green("$ node _save.js mongo 'seed driver data'"))
} else if (type !== 'mongo' || type !== 'redis') {
  console.log(c.greenBright.bold(`[saving ${type} file]`), `with title: ${title}`)
  writeFileSync(join(__dirname, 'archive.md'), `\n## [**mongo**] ${title}\n\`\`\`js\n${(await import('./mongoplay.js')).default.toString().split('\n').slice(1, -1).join('\n')}\n\`\`\``, { flag: 'a' })
}
