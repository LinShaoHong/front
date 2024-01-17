import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'

export interface LikeState {
  likes: Map<string, boolean>;
}

@Module({ dynamic: true, store, name: 'likes' })
class Likes extends VuexModule implements LikeState {
  public likes: Map<string, boolean> = new Map()

  @Mutation
  public LIKE(itemId: string) {
    let liked = this.likes.get(itemId)
    this.likes.set(itemId, !liked)
  }

  @Action
  public Like(itemId: string) {
    this.LIKE(itemId)
  }
}

export const LikesModule = getModule(Likes)
