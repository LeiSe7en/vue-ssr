export default {
	name: 'Foo',
	render (h) {
		return h('div', 'I am Foo')
	},
	mounted () {
		console.log('Foo mounted')
	}
}