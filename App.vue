<template>
  <div id="app">
    <div>
      I am nelson
      <button @click="goTo"></button>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
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
    methods: {
      goTo () {
        this.$router.push('/foo')
      }
    }
  }
</script>
