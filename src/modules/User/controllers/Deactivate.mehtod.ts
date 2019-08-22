import { ModuleResponse } from '@interfaces'
import { Controller } from '@classes'
import UserModel from '../User.schema'

class Deactivate extends Controller {
  private userId: string

  public handle = async (userId: string): Promise<ModuleResponse> => {
    this.userId = userId

    return this
      .verifyIfUserExists()
      .then(this.deactivateUser)
      .then(this.respond)
  }

  private verifyIfUserExists = async (): Promise<void> => {
    const { userId } = this
    const exists = await UserModel.findOne({ _id: userId })
    if (!exists) {
      throw new this.HttpException(400, 'user does not exists')
    }
  }

  private deactivateUser = async (): Promise<void> => {
    const { userId } = this

    await UserModel
      .findOneAndUpdate(
        { _id: userId },
        { $set: { active: false } }
      )

    this.status = 200
    this.data = { message: 'user successfully deactivated' }
  }
}

export const deactivate = new Deactivate()
