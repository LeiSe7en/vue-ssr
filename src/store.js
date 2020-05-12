import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const createStore = () => {

	return new Vuex.Store({
		state: {
			items: []
		},
		actions: {
			fetchUsers ({ commit }) {
				const users = [
					{name: 'Nelson', age: 27, job: 'programmer'},
					{name: 'Libing', age: 30, job: 'saler'}
				]
				return new Promise((resolve, reject) => {
					resolve(users)
				}).then(res => {
					commit('FETCH_USERS', res)
				})
			}
		},
		mutations: {
			FETCH_USERS (state, payload) {
				state.items = payload
			}
		}

	})
}