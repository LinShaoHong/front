import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'

export interface MenuItem {
  label: string,
  path: string,
  type: string
}

export interface MenuState {
  index: number,
  menus: MenuItem[]
}

@Module({ dynamic: true, store, name: 'menu' })
class Menu extends VuexModule implements MenuState {
  public index: number = 0
  public menus: MenuItem[] = [
    { label: '首頁', path: '/home', type: null },
    { label: '樓鳳資訊', path: '/girl/qm', type: 'QM' },
    { label: '會所資訊', path: '/girl/sn', type: 'SN' },
    { label: '視頻資訊', path: '/girl/video', type: 'VIDEO' },
    { label: '美圖資訊', path: '/girl/pic', type: 'PIC' },
    { label: '充值', path: '/user/recharge', type: null },
    { label: '我的', path: '/user/detail', type: null }
  ]

  @Mutation
  public SET_INDEX(index: number) {
    this.index = index
  }

  @Mutation
  public TO_MENU(path: string) {
    this.index = -1
    for(let i = 0; i < this.menus.length; i++) {
      if (this.menus[i].path === path) {
        this.index = i;
      }
    }
  }

  @Action
  public SetIndex(index: number) {
    this.SET_INDEX(index)
  }

  @Action
  public ToMenu(path: string) {
    this.TO_MENU(path)
  }
}

export const MenuModule = getModule(Menu)
