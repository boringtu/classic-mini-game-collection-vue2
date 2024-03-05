<template lang="pug">
.container-root
	.grid-box
		template(v-for="(row, i) in matrix")
			GridView(
				v-for="(v, j) in row"
				:key="`${i}-${j}`"
				:value="v"
			)
	WellDone(v-if="passing")
</template>

<script>
import GridView from './Grid';
import WellDone from './WellDone';

export default {
	props: {
		matrix: Array,
		passing: Boolean,
	},
	components: {
		GridView,
		WellDone,
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
</style>
