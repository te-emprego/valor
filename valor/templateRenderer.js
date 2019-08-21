'use strict'

const fs = require('fs')
const path = require('path')
const hbs = require('handlebars')
const _ = require('lodash')

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

  render = () => {
    const template = this.getTemplate()
    const compiled = template(this.args)
    this.compiledTemplate = compiled
    return this
  }

  write = (moduleName) => {
    const filePath = path.resolve(__dirname, '../src/modules/', moduleName, this.toWritePath)
    fs.writeFileSync(filePath, this.compiledTemplate)
  }
}

/**
 * Gera a estrutura de diretórios interna do que
 * será renderizado em seguida
 * @param {string} moduleName
 * @param {Array<string>} directories
 */
function buildStructure (moduleName, directories) {
  const p = path.resolve(__dirname, '../src/modules/', moduleName)
  fs.mkdirSync(p)
  directories.forEach(dir => {
    fs.mkdirSync(
      path.resolve(p, dir)
    )
  })
}

function renderModule (name) {
  const data = {
    module: _.camelCase(name),
    Module: _.upperFirst(_.camelCase(name))
  }

  const moduleFiles = [
    new Template('Controller', data, 'controllers/Greet.controller.ts'),
    new Template('Controller.index', data, 'controllers/index.ts'),
    new Template('Module.index', data, 'index.ts'),
    new Template('Schema', data, `${data.Module}.schema.ts`),
    new Template('Interface', data, `${data.Module}.interface.ts`),
    new Template('Endpoints', data, `${data.Module}.endpoints.ts`)
  ]

  const directoryStructure = [
    'controllers'
  ]

  buildStructure(data.Module, directoryStructure)
  moduleFiles.forEach(file => file.render().write(name))
  console.log('Module created')
}

module.exports = {
  renderModule
}
