<template lang="pug">
.grid(:style="{ backgroundImage }")
</template>

<script>
import { calcGridBackgroundImage } from '../libs/utils';

export default {
	props: {
		data: Object,
	},
	computed: {
		backgroundImage() {
			const { data } = this;
			return data ? calcGridBackgroundImage(data.color) : null;
		},
	},
}
</script>

<style lang="sass" scoped>
.grid
	width: 50px
	height: 50px
	border-radius: 8px
</style>
