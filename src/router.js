import Router from 'vue-router'
import Vue from 'vue'
import Foo from '@/pages/Foo.vue'
import Home from '@/pages/Home.vue'
Vue.use(Router)

export function createRouter () {
	return new Router({
		mode: 'history',
		routes: [
			{ path: '/', component: Home, name: 'home' },
			{ path: '/foo', component: Foo, name: 'foo' }
		]
	})
}