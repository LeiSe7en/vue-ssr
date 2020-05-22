export default {
  data () {
    return {
      url: 'dsdssd'
    }
  },
  mounted () {
    console.log('App mounted')
  },
  created () {
    console.log('created')
  },
  render (h) {
    return h('div', {domProps: {id: 'app'}}, [h('div', 'I am Nelson'), h('router-view')])
  },
  asyncData ({ store, router }) {
    console.log('asyncData')
  }
}
