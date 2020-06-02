<template>
	<div>
		<h1> I am Home haha sss </h1>
	</div>
</template>
<script>
	export default {
		name: "Home",
		asyncData ({ store }) {
			store.dispatch('fetchPost')
		}
	}
</script>