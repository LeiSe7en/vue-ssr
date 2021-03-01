<template>
  <div class="app">
    I am App sdsd ssss 
    <home-page></home-page>
    <greeting></greeting>
  </div>
</template>
<script>
import HomePage from './HomePage.vue'
import Greeting from './Greeting.vue'
export default {
  components: { HomePage, Greeting },
  name: "app"
}
</script>
<style>
	.app {
		color: green;
	}
</style>