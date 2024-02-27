<template lang="pug">
.grid(:class="{ [gridClass]: gridClass }" :data-value="value")
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
			if (value & DIGIT_TYPE_ENUM.EMPTY) return 'empty';
			if (value & DIGIT_TYPE_ENUM.HEAD) return 'head';
			if (value & DIGIT_TYPE_ENUM.BODY) return 'body';
			if (value & DIGIT_TYPE_ENUM.FOOD) return 'food';
			if (value & DIGIT_TYPE_ENUM.HIGH) return 'high';
		},
	},
}
</script>

<style lang="sass" scoped>
@keyframes flashing
	0%
		opacity: 1
	100%
		opacity: 0
.grid
	width: 50px
	height: 50px
	border-radius: 8px
	&.head
		background-color: #b55631
	&.body
		background-color: #bababa
	&.food
		background-color: #70bc3d
	&.high
		background-color: #70bc3d
		animation: flashing .4s ease-in-out both infinite
</style>
