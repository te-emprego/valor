'use strict'

const chalk = require('chalk')
const emoji = require('node-emoji')

const cliLineWidth = 40
const line = Array(cliLineWidth).fill('─').join('')
let startTime = Date.now()

const log = message => console.log(emoji.emojify(message))

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Retorna o próximo valor de um argumento
 * @param {string} param
 * @param {array} args
 */
const getParamInArguments = (param, args) => {
  const next = args.indexOf(param) + 1
  return next ? args[next] : undefined
}

/**
 * Align a text to center
 * @param {string} message
 * @param {number} size
 */
const alignCenter = (message, size = cliLineWidth) => {
  const asArray = message.split('')
  const hasEmoji = message.match(/:\w+:/g)

  let emojiScape = 0

  if (hasEmoji) {
    hasEmoji.forEach(e => { emojiScape += e.length - 1 })
  }

  const space = Math.round((size - (asArray.length - emojiScape)) / 2)

  let line = Array(space).fill(' ')

  asArray.forEach(char => line.push(char))

  line.push(Array(space).fill(''))

  return line.join('').replace(/,/g, ' ')
}

const printHeader = async (customHeaderMessage = 'CLI') => {
  startTime = Date.now()
  log(chalk.red(` ┌${line} `))
  log(` ${chalk.red(`│`)} ${customHeaderMessage}`)
  log(chalk.red(` ├${line} `))
}

const printFooter = async (message = 'Finalizado') => {
  log(chalk.red(` └${line} `))
  log(message)
  const timer = (Date.now() - startTime) / 1000
  log(`Tempo de execução: ${timer} segundos`)
}

const printStep = async (message, time = 0) => {
  log(` ${chalk.red('├')} ${message}`)
  await sleep(time)
}
module.exports = {
  getParamInArguments,
  printFooter,
  printHeader,
  printStep,
  alignCenter
}
