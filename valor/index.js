'use strict'
const helpers = require('./helpers')

// get arguments
const args = process.argv.slice(2)

if (args.includes('prepare')) {
  const rimraf = require('rimraf')
  const path = require('path')

  const dir = p => path.resolve(__dirname, '..', p)

  rimraf.sync(dir('file'))
  rimraf.sync(dir('website'))
  rimraf.sync(dir('docs'))

  console.log('\n\nProntinho! :D')
  return;
}

if (args.includes('create-module')) {
  const ModuleCreator = require('./CreateModule.method')

  const name = helpers.getParamInArguments('-n', args)
  if (!name) {
    throw new Error('Missing -n (name) param')
  }

  return new ModuleCreator(name)
}