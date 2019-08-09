import Vue from 'vue'
import Vuex from 'vuex'
import { IAppState } from './modules/app'
import { IErrorLogState } from './modules/error-log'
import { ISettingsState } from './modules/settings'
import { ICategoryState } from './modules/category'

Vue.use(Vuex)

export interface IRootState {
  app: IAppState
  errorLog: IErrorLogState
  settings: ISettingsState
  categories: ICategoryState
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({})
