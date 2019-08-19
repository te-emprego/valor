import { ModuleResponse } from '@interfaces'
import { Controller } from '@classes'

import UserModel from '../User.schema'
import { User } from '../User.interface'

class List extends Controller {
  private users: User[]

  public handle = async (): Promise<ModuleResponse> =>
    this
      .getUsers()
      .then(this.respond)

  private async getUsers (): Promise<void> {
    this.users = await UserModel.find()
    this.status = 200
    this.data = this.users
  }
}

export const list = new List()
