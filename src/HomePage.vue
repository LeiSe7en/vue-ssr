<template>
  <div class="home-page">
    <div>
      <input type="text" v-model="desc"/>
    </div>
    <show-hide v-if="show"></show-hide>
    <input type="checkbox" v-model="show"/>
    <div class="greeting-message">
      I am Home page: 
      {{message}} {{desc}} dsdsdsdssd
    </div>
  </div>
</template>
<script>
export default {
  name: 'home-page',
  components: {
    ShowHide: () => import(/* webpackChunkName: 'show-hide' */ /* webpackPrefetch: true */'./ShowHide.vue')
  },
  data () {
    return {
      message: "Nelson",
      desc: "",
      show: false
    }
  }
}
</script>
<style scoped>
  .greeting-message {
    color: red;
    font-size: 30px;
    font-weight: 700;
    background-color: yellow;
    line-height: 2;
  }
</style>