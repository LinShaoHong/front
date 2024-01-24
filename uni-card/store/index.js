// #ifndef VUE3
import Vue from 'vue'
import Vuex from 'vuex'
import utils from '@/common/utils';

Vue.use(Vuex)

const store = new Vuex.Store({
// #endif
// #ifdef VUE3
import {
	createStore
} from 'vuex'
const store = createStore({
// #endif
	state: {
		user: {},
		isLogin: false,
		config: {
			cardNum: 0
		},
	},
	getters: {},
	mutations: {
		setUser(state, data) {
			state.user = data
			state.isLogin = !utils.empty(data)
			uni.setStorageSync('user', data)
		},
		setConfig(state, data) {
			state.config = {
				cardNum: 50,
				...(data || {})
			}
		},
		logout(state) {
			state.user = {}
			state.isLogin = false
			state.config = {}
			uni.removeStorageSync('user')
		},
	},
	actions: {
		
	}
})

export default store