<template lang="pug">
.panel-root
	.panel-box
		h2 LEVEL
		strong {{ level }}
	.panel-box
		h2 STEP
		strong {{ step }}
	.panel-box.tips-box
		h2 TIPS
		ul
			li
				label UP
				span MOVE UP
			li
				label DOWN
				span MOVE DOWN
			li
				label LEFT
				span MOVE LEFT
			li
				label RIGHT
				span MOVE RIGHT
			li
				label B
				span REVOKE
			li
				label A
				span NEXT LEVEL
			li
				label SEL
				span SHOW LEVEL LIST
		img(src="@/assets/images/cat.gif")
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
		&.tips-box
			flex: 1
			display: flex
			flex-direction: column
			align-items: stretch
			ul
				margin-top: 24px
				flex: 1
				display: flex
				flex-direction: column
				li
					text-align: left
					white-space: nowrap
					display: flex
					flex-direction: column
					label
						color: #eb974c
						font-size: 20px
					span
						color: #86bed9
						margin-top: 12px
						font-size: 15px
					+ li
						margin-top: 24px
</style>
