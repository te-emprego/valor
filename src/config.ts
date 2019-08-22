import path from 'path'
import dotenv from 'dotenv'

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV.toLocaleLowerCase()}`)
})

export default {
  app: {
    protocol: process.env.NODE_ENV === 'development' ? 'http' : process.env.PROTOCOL,
    host: process.env.NODE_ENV === 'development' ? 'localhost' : process.env.HOSTNAME, 
    secret: process.env.SECRET,
    port: process.env.PORT || 3333,
    database: {
      connectionString: process.env.DATABASE_CONNECTION_STRING
    }
  },
  passport: {
    google: {
      client: {
        id: process.env.PASSPORT_GOOGLE_CLIENT_ID,
        secret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET
      }
    }
  },
  requests: {
    window: 2 * 60 * 1000,
    delay: 200,
    limit: 50
  }
}
