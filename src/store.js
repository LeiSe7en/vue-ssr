import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

export const createStore = () => {

	return new Vuex.Store({
		state: {
			items: [],
			post: null
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
			},
			fetchPost ({ commit }) {
				return axios.$get("https://jsonplaceholder.typicode.com/posts/1")
				          .then(response => commit('SET_POST', response.data))
			},
			fetchUsers ({ commit }) {
				return axios.get("")
			}
		},
		mutations: {
			FETCH_USERS (state, payload) {
				state.items = payload
			},
			SET_POST (state, { post }) {
				state.post = post
			}
		}

	})
}