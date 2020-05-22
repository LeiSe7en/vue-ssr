import Router from 'vue-router'
import Vue from 'vue'
import Foo from '@/components/Foo'
Vue.use(Router)

export function createRouter () {
	return new Router({
		mode: 'history',
		routes: [
			{ path: '/foo', component: Foo }
		]
	})
}