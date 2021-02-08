import Vue from 'vue'
import HomePage from '@/HomePage'
const app = new Vue ({
  el: '#app',
  components: {
    HomePage
  },
  render (h) {
    return h('div', {}, [h(HomePage)])
  }
})
app.$mount()