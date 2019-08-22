'use strict'

const fs = require('fs')
const path = require('path')
const hbs = require('handlebars')
const _ = require('lodash')
const chalk = require('chalk')

const h = require('./helpers')

class Template {
  /**
   * @param {string} templateName
   * @param {object} args
   * @param {string} toWritePath
   */
  constructor (templateName, args, toWritePath) {
    this.templateName = templateName
    this.args = args
    this.toWritePath = toWritePath
  }

  getTemplate = () => {
    const templatePath = path.resolve(__dirname, 'templates', this.templateName)
    const templateString = fs.readFileSync(templatePath, 'utf-8')
    return hbs.compile(templateString)
  }

  render = async () => {
    const template = this.getTemplate()
    const compiled = template(this.args)
    this.compiledTemplate = compiled
    return this
  }

  writeModule = async (moduleName) => {
    const filePath = path.resolve(__dirname, '../src/modules/', moduleName, this.toWritePath)
    fs.writeFileSync(filePath, this.compiledTemplate)
    await h.printStep(`Criado: ${this.toWritePath}`, 800)
  }

  writeGlobal = async () => {
    const filePath = path.resolve(__dirname, '../', this.toWritePath)
    fs.writeFileSync(filePath, this.compiledTemplate)
    await h.printStep(`Criado: ${this.toWritePath}`, 800)
  }
}

/**
 * Gera a estrutura de diretórios interna do que
 * será renderizado em seguida
 * @param {string} moduleName
 * @param {Array<string>} directories
 */
async function buildStructure (moduleName, directories) {
  const p = path.resolve(__dirname, '../src/modules/', moduleName)
  fs.mkdirSync(p)
  await directories.forEach(async dir => {
    fs.mkdirSync(
      path.resolve(p, dir)
    )
    await h.printStep(`Diretório ${chalk.green(dir)} criado`, 200)
  })
}

async function renderModule (name) {
  await h.printHeader('Valor generate:module')

  await h.printStep('Gerando variáveis de renderização', 500)
  const data = {
    module: _.camelCase(name),
    Module: _.upperFirst(_.camelCase(name))
  }

  await h.printStep('Construindo os templates', 1000)
  const moduleFiles = [
    new Template('Controller', data, 'controllers/Greet.controller.ts'),
    new Template('Controller.index', data, 'controllers/index.ts'),
    new Template('Module.index', data, 'index.ts'),
    new Template('Schema', data, `${data.Module}.schema.ts`),
    new Template('Interface', data, `${data.Module}.interface.ts`),
    new Template('Endpoints', data, `${data.Module}.endpoints.ts`)
  ]

  await h.printStep('Preparando a estrutura do módulo', 500)
  const directoryStructure = [
    'controllers'
  ]

  await buildStructure(data.Module, directoryStructure)
  await moduleFiles.forEach(async file => file.render().then(() => file.writeModule(name)))
  await h.printFooter()
}

function fileExists (filePath) {
  return fs.existsSync(path.resolve(__dirname, '../', filePath))
}

async function generateEnv (clear = false) {
  await h.printHeader('Valor generate:env')
  await h.printStep('Criando templates', 100)
  let templates = [
    {
      file: '.env',
      shouldRender: true
    },
    {
      file: '.env.test',
      shouldRender: true
    }
  ]

  await h.printStep('Verificando parâmetro clear', 100)
  if (!clear) {
    templates.forEach(template => {
      template.shouldRender = !fileExists(template.file)
    })
    await h.printStep(chalk.red('Parâmetro clear não encontrado...'))
    await h.printStep(chalk.red('Mantendo os environments antigos!'), 500)
  }

  await h.printStep('Montando fila de renderização', 1000)
  const toRender = templates.filter(template => template.shouldRender)
  const envFiles = toRender.map(file => new Template('env', null, file.file))

  if (!envFiles.length) {
    await h.printStep('Não há nada na fila para ser feito :)')
    await h.printFooter()
    return
  }

  await h.printStep('Escrevendo arquivos no sistema...', 500)
  await envFiles.forEach(async file => file.render().then(() => file.writeGlobal()))
  await h.printFooter()
}

module.exports = {
  renderModule,
  generateEnv
}
