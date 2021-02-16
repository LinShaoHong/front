import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'

export interface CollectState {
  collects: Map<string, boolean>;
}

@Module({ dynamic: true, store, name: 'collects' })
class Collect extends VuexModule implements CollectState {
  public collects: Map<string, boolean> = new Map()

  @Mutation
  public COLLECT(itemId: string) {
    let collected = this.collects.get(itemId)
    this.collects.set(itemId, !collected)
  }

  @Action
  public Collect(itemId: string) {
    this.COLLECT(itemId)
  }
}

export const CollectModule = getModule(Collect)
