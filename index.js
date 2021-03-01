import Vue from 'vue'
import App from '@/App'
import HomePage from '@/HomePage'
import './src/assets/css/index.css'
const app = new Vue ({
  ...App
})
app.$mount('#app')