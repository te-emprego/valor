'use strict'
const helpers = require('./helpers')
const chalk = require('chalk')

try {
  // get arguments
  const args = process.argv.slice(2)

  if (args.includes('prepare')) {
    const rimraf = require('rimraf')
    const path = require('path')

    const dir = p => path.resolve(__dirname, '..', p)

    rimraf.sync(dir('docs'))
    rimraf.sync(dir('.git'))

    console.log('\n\nProntinho! :D')
    return
  }

  if (args.includes('generate:module')) {
    const { renderModule } = require('./templateRenderer')

    const name = helpers.getParamInArguments('-n', args)
    if (!name) {
      throw new Error('Missing -n (name) param')
    }

    return renderModule(name)
  }
} catch (error) {
  const m = chalk.red(error.message)
  console.log(`\n  ${m}\n`)
}
