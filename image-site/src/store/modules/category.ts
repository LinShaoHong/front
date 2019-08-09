import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'

export interface ICategory {
  type: string,
  items: { name: string, path: string }[]
}

export interface ICategoryState {
  category: ICategory
}

@Module({dynamic: true, store, name: 'categories'})
class Categories extends VuexModule implements ICategoryState {
  private categories: Map<string, ICategory> = new Map()
  public category: ICategory = {
    type: 'image',
    items: []
  }

  @Mutation
  private SET_CATEGORIES(categories: Map<string, ICategory>) {
    this.categories = categories
  }

  @Mutation
  public SET_TYPE(type: string) {
    this.category = this.categories.get(type)
  }

  @Action
  public SetCategories(categories: Map<string, ICategory>) {
    this.SET_CATEGORIES(categories)
  }

  @Action
  public ChangeType(type: string) {
    this.SET_TYPE(type)
  }
}

export const CategoryModule = getModule(Categories)
