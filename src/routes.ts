import { Router } from 'express'
import UsersModule from './modules/User'

const routes = Router()

routes.use('/users', UsersModule)

export default routes
