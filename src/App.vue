<template>
  <div>
    I am App
    <home-page></home-page>
  </div>
</template>
<script>
import HomePage from './HomePage.vue'
export default {
  components: { HomePage },
  name: "app"
}
</script>