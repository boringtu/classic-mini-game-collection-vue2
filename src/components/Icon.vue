<template>
<svg class="svg-icon" aria-hidden="true" v-bind="$attrs" v-on="$listeners">
	<use :xlink:href="`#icon-${name}`" />
</svg>
</template>

<script>
import '../../public/static/fonts/iconfont';

export default {
	props: {
		name: {
			type: String,
			required: true,
		},
	},
};
</script>

<style lang="scss" scoped>
.svg-icon {
	width: 1em;
	height: 1em;
	vertical-align: -0.15em;
	fill: currentColor;
	overflow: hidden;
}
</style>
