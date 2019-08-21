import ModuleRegisterService from '@services/ModuleRegister.service'
import * as Controller from './controllers'
import Endpoints from './User.endpoints'

const userModule = new ModuleRegisterService(Endpoints, Controller)

userModule.registerEndpoints()

export default userModule.getRoutes()
