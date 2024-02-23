<template lang="pug">
.paused-root
	strong PAUSE
</template>

<style lang="sass" scoped>
.paused-root
	display: inline-block
	background-color: #000
	border-width: 12px 24px
	border-style: solid
	border-color: #9e3b1f
	padding: 4px 48px
	position: absolute
	z-index: 100
	bottom: calc(51px * 12)
	left: 50%
	transform: translateX(-50%)
	strong
		font-size: 48px
		font-weight: bold
		color: #fff
</style>
