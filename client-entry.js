import {createApp} from './createApp'


const { app, router } = createApp()
console.log('dsdsdsdsdsdsdsdsd')
router.onReady(() => {
	
  app.$mount('#app')
})