import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'

export interface ICategory {
  type: string,
  subType: string,
  items: { label: string, name: string, count: number }[]
}

export interface ICategoryState {
  category: ICategory
}

@Module({ dynamic: true, store, name: 'categories' })
class Categories extends VuexModule implements ICategoryState {
  private categories: Map<string, ICategory> = new Map()
  private initiated: boolean = false
  private keyType: string = null
  public index: number = 0
  public hoverIndex: number = 0
  public category: ICategory = {
    type: '',
    subType: '',
    items: []
  }

  @Mutation
  private SET_CATEGORIES(categories: Map<string, ICategory>) {
    this.categories = categories
    if (this.keyType !== null && !this.initiated) {
      this.initiated = true
      this.category = this.categories.get(this.keyType)
    }
  }

  @Mutation
  public SET_KEY_TYPE(keyType: string) {
    if (this.keyType !== keyType) {
      this.category = this.categories.get(keyType)
      this.keyType = keyType
    }
  }

  @Mutation
  public SET_INDEX(index: number) {
    this.index = index
  }

  @Mutation
  public SET_HOVER_INDEX(hoverIndex: number) {
    this.hoverIndex = hoverIndex
  }

  @Action
  public SetCategories(categories: Map<string, ICategory>) {
    this.SET_CATEGORIES(categories)
  }

  @Action
  public ChangeKeyType(keyType: string) {
    this.SET_KEY_TYPE(keyType)
  }

  @Action
  public ChangeIndex(index: number) {
    this.SET_INDEX(index)
  }

  @Action
  public ChangeHoverIndex(hoverIndex: number) {
    this.SET_HOVER_INDEX(hoverIndex)
  }
}

export const CategoryModule = getModule(Categories)
