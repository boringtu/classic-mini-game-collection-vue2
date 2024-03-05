<template lang="pug">
.panel-root
	.panel-box
		h2 LEVEL
		strong {{ level }}
	.panel-box
		h2 STEP
		strong {{ step }}
	.panel-box.placeholder-box
		img(src="/static/images/cat.gif")
</template>

<script>
export default {
	props: {
		level: Number,
		step: Number,
	},
}
</script>

<style lang="sass" scoped>
.panel-root
	background-color: #000
	width: 300px
	height: 1061px
	padding: 12px 12px 0
	border: 10px solid #fff
	border-left: 0
	display: flex
	flex-direction: column
	align-items: stretch
	.panel-box
		margin-bottom: 12px
		padding: 16px
		border: 1px solid #fff
		display: flex
		flex-direction: column
		h2
			color: #999
		strong
			color: #fff
			margin-top: 24px
		&.placeholder-box
			flex: 1
			display: flex
			justify-content: flex-end
</style>
