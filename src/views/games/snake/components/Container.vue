<template lang="pug">
.container-root
	.grid-box
		template(v-for="(row, i) in matrix")
			GridView(
				v-for="(v, j) in row"
				:key="`${i}-${j}`"
				:value="v"
			)
	.redline
	GameOverView(v-if="gameover")
	PausedView(v-if="paused")
</template>

<script>
import GridView from './Grid';
import GameOverView from './GameOver';
import PausedView from './Paused';

export default {
	props: {
		matrix: Array,
		gameover: Boolean,
		paused: Boolean,
	},
	components: {
		GridView,
		GameOverView,
		PausedView,
	},
}
</script>

<style lang="sass" scoped>
.container-root
	position: relative
	background-color: #000
	border: 10px solid #fff
	.grid-box
		width: 509px
		height: 1041px
		padding: 1px 0
		display: flex
		flex-wrap: wrap
		row-gap: 1px
		column-gap: 1px
		.grid
			width: 50px
			height: 50px
			border-radius: 8px
	.redline
		position: absolute
		z-index: 10
		left: 0
		bottom: calc(51px * 20)
		width: 100%
		height: 1px
		background-color: red
		opacity: .25
</style>
