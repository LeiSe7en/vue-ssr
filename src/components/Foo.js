export default {
	name: 'Foo',
	render (h) {
		return h('div', 'I am Foo')
	},
	mounted () {
		console.log('Foo mounted')
	},
	asyncData ({store, router}) {
		return store.dispatch('fetchPost').then(res => {
			return 
		})
	}
}