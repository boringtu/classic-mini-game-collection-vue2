<template lang="pug">
.game-over-root
	.word-box
		strong GAME
		strong OVER
</template>

<style lang="sass" scoped>
.game-over-root
	display: inline-block
	background-color: #000
	border: 8px solid #9e3b1f
	padding: 4px
	position: absolute
	z-index: 100
	bottom: calc(51px * 12)
	left: 50%
	transform: translateX(-50%)
	.word-box
		padding: 4px
		border: 24px solid #68716f
		display: flex
		flex-direction: column
		strong
			font-size: 48px
			font-weight: bold
			color: #fff
</style>
