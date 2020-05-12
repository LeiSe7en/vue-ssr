export default {
  data () {
    return {
      url: 'dsdssd'
    }
  },
  mouted () {

  },
  created () {
    console.log('created')
  },
  render (h) {
    return h('div', [h('div', 'I am Nelson')])
  },
  asyncData ({ store, router }) {
    console.log('asyncData')
  }
}
