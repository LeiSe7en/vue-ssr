<template>
  <div>
    I am Home page: 
    {{message}} {{desc}} sdsds
    <div>
      <input type="text" v-model="desc"/>
    </div>
    <show-hide v-if="show"></show-hide>
    <input type="checkbox" v-model="show"/>
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