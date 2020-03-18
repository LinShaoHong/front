import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { UserInfo } from '@/api/user'
import store from '@/store'

export interface UserState {
  user: UserInfo
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements UserState {
  public user: UserInfo = null

  @Mutation
  public SET(user: UserInfo) {
    this.user = user
  }

  @Action
  public Set(user: UserInfo) {
    this.SET(user)
  }
}

export const UserModule = getModule(User)
