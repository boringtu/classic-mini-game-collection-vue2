<template lang="pug">
.grid(:class="gridClass" :data-value="value")
	template(v-if="value & DIGIT_TYPE_ENUM.POINT")
		Icon.icon(name="point")
	template(v-if="value & DIGIT_TYPE_ENUM.WALL")
		Icon.icon(name="wall")
	template(v-if="value & DIGIT_TYPE_ENUM.BOX")
		img.box(:src="imgBox")
	template(v-if="value & DIGIT_TYPE_ENUM.WORKER")
		img.worker(src="/static/images/cat.gif")
</template>

<script>
import Icon from '@/components/Icon';
import { DIGIT_TYPE_ENUM } from '../libs/consts';


export default {
	props: {
		value: Number,
	},
	components: {
		Icon,
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
	data() {
		return {
			DIGIT_TYPE_ENUM,
			imgBox: require('../images/box.png'),
		};
	},
}
</script>

<style lang="sass" scoped>
.grid
	width: 50px
	height: 50px
	position: relative
	img,
	.icon
		position: absolute
		z-index: 1
		top: 0
		left: 0
		width: 100%
		height: 100%
		&.wall,
		&.box,
		&.worker
			z-index: 10
	&.floor
		z-index: 1
		background: url("../images/tile.svg") no-repeat
		background-size: 100% 100%
	&.point
		.icon
			color: #8e98d4
			width: 50%
			height: 50%
			top: 50%
			left: 50%
			transform: translate(-50%, -50%)
		.box
			filter: hue-rotate(200deg)
	&.wall
		z-index: 1
		.icon
			color: #ccc
</style>
