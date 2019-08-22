import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import routes from './routes'
import middlewares from '@middlewares/index'
import config from '@config'

class App {
  public express: express.Application

  public constructor () {
    this.express = express()
    this.middlewares()
    this.database()
    this.routes()
  }

  public boot (): express.Application {
    console.clear()
    console.log(`App starting at ${config.app.protocol}://${config.app.host}:${config.app.port}`)
    return this.express
  }

  private middlewares (): void {
    this.express.use(express.json())
    this.express.use(cors())
    this.express.use(...middlewares)
  }

  private database (): void {
    mongoose.set('useNewUrlParser', true)
    mongoose.set('useCreateIndex', true)
    mongoose.set('useFindAndModify', false)
    mongoose.set('auth', { authdb: 'admin' })
    mongoose
      .connect(config.app.database.connectionString)
      .then((): void => {
        console.log('Successfully connected to database.')
      })
      .catch((error): void => {
        console.log('Error during database connection.')
        console.log(error.message)
      })
  }

  private routes (): void {
    this.express.use(routes)
  }
}

export default App
