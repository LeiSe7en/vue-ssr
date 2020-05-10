import Vue from 'vue'
import App from './App.js'

module.exports = function (context) {
  const app = new Vue({
    render: h => h(App)
  })
  return { app }
} 