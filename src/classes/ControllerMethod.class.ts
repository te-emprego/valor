import { ModuleResponse } from '@interfaces'
import { HttpException } from '@classes'
import AuthenticationService from '@services/Authentication.service'

class Controller {
  public status: number
  public data: object | []
  public HttpException: any
  public Auth: AuthenticationService

  public constructor () {
    this.status = 200
    this.data = {}
    this.HttpException = HttpException
    this.Auth = new AuthenticationService()
  }

  public respond = (): ModuleResponse => {
    return {
      status: this.status,
      data: this.data
    }
  }
}

export { Controller }
export default Controller
