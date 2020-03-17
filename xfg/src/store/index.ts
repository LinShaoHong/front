import Vue from 'vue'
import Vuex from 'vuex'
import { IAppState } from './modules/app'
import { IErrorLogState } from './modules/error-log'
import { ISettingsState } from './modules/settings'
import { ICategoryState } from './modules/category'
import { LikeState } from './modules/like'
import { CollectState } from './modules/collect'
import { UserState } from './modules/user'
import { MenuState } from "@/store/modules/menu";
import { IMessageState } from "@/store/modules/message";

Vue.use(Vuex)

export interface IRootState {
  app: IAppState
  errorLog: IErrorLogState
  settings: ISettingsState
  category: ICategoryState,
  likes: LikeState,
  collects: CollectState
  user: UserState,
  menu: MenuState,
  message: IMessageState
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({})
