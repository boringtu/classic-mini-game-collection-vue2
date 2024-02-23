<template lang="pug">
.elimination-line(:style="{ bottom }")
	.label-box
		.label-wrap
			span {{ label }}
		.shadow-mask
	.hide-wrap
		.hide-mask
		.shadow-mask
</template>

<script>
import { ELIMINATION_TYPE_DICT } from '../libs/consts';

export default {
	props: {
		index: Number,
		type: Number,
	},
	computed: {
		bottom() {
			return `${ 51 * (20 - this.index - 1) + 1 }px`;
		},
		label() {
			return ELIMINATION_TYPE_DICT[this.type].label;
		},
	},
}
</script>

<style lang="sass" scoped>
@keyframes view-label
	0%
		width: 0
	100%
		width: calc(100% + 200px)
@keyframes hide-label
	0%
		left: calc(-100% - 200px)
	100%
		left: 0

.elimination-line
	overflow: hidden
	position: absolute
	z-index: 90
	left: 0
	width: 100%
	height: 50px
	.label-box
		color: #fff
		text-align: left
		height: 50px
		font-size: 48px
		line-height: 56px
		position: absolute
		z-index: 1
		left: 0
		// width: 0
		width: calc(100% + 200px)
		overflow: hidden
		animation: view-label .6s ease-in-out both
		.label-wrap
			position: relative
			z-index: 1
			overflow: hidden
			background-color: #000
			height: 100%
			margin-right: 200px
			span
				margin-left: 48px
		.shadow-mask
			position: absolute
			z-index: 2
			top: 0
			right: 0
			width: 220px
			height: 100%
			background-image: linear-gradient(to right, rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 1) 20px, rgba(0, 0, 0, 0) 100%)
	.hide-wrap
		position: relative
		z-index: 10
		left: calc(-100% - 200px)
		width: calc(100% + 200px)
		height: 100%
		animation: hide-label .6s ease-in-out .6s both
		.hide-mask
			background-color: #000
			position: relative
			z-index: 1
			height: 100%
			margin-right: 200px
		.shadow-mask
			position: absolute
			z-index: 2
			top: 0
			right: 0
			width: 220px
			height: 100%
			background-image: linear-gradient(to right, rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 1) 20px, rgba(0, 0, 0, 0) 100%)
</style>
