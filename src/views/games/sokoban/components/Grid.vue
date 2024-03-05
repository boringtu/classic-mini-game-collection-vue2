<template lang="pug">
.grid(:class="gridClass" :data-value="value")
</template>

<script>
import { DIGIT_TYPE_ENUM } from '../libs/consts';


export default {
	props: {
		value: Number,
	},
	computed: {
		gridClass() {
			const { value } = this;
			const list = [];
			if (!value) list.push('empty');
			if (value & DIGIT_TYPE_ENUM.FLOOR) list.push('floor');
			if (value & DIGIT_TYPE_ENUM.POINT) list.push('point');
			if (value & DIGIT_TYPE_ENUM.WALL) list.push('wall');
			if (value & DIGIT_TYPE_ENUM.BOX) list.push('box');
			if (value & DIGIT_TYPE_ENUM.WORKER) list.push('worker');
			return list;
		},
	},
}
</script>

<style lang="sass" scoped>
.grid
	width: 50px
	height: 50px
	border-radius: 8px
	position: relative
	&.floor
		z-index: 1
		background-color: #fff
	&.point
		z-index: 2
		background-color: #70bc3d
		&:after
			content: "P"
			line-height: 52px
			color: #fff
	&.wall
		z-index: 1
		background-color: #bababa
	&.box
		z-index: 10
		background-color: #a77d29
		&:after
			content: "BOX"
			font-size: 12px
			line-height: 52px
			color: #fff
	&.worker
		z-index: 10
		background-color: #b55631
		&:after
			content: "人"
			font-family: "8bit-cn"
			line-height: 52px
			color: #fff
</style>
