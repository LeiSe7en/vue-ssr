const createApp = require('./createApp')

export default (context) => {
	return new Promise ((resolve, reject) => {
		const { app, router, store } = createApp()
		router.push(context.url)
		router.onReady(() => {
			const matchedComponents = router.getMatchedComponents()
			if (!matchedComponents || matchedComponents.legnth === 0) {
				// 404
			}
			console.log(matchedComponents)
			Promise.all(matchedComponents.map(component => {
				if (component.asyncData) {
					return component.asyncData({store, router})
				}
			})).then(res => {
				resolve(app)
			})
		})
	}) 
}