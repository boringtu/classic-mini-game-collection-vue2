<template>
<div class="loading-root" :class="{ loading, 'bg-reset': !loading }">

</div>
</template>

<script>
import { sleep } from '@/libs/utils';

export default {
	inject: [
		'setLoading',
		'getLoading',
	],
	computed: {
		loading() {
			return this.getLoading();
		},
	},
	watch: {
		async loading(v) {
			if (!v) return;
			await sleep(2000);
			this.setLoading(false);
		},
	},
}
</script>

<style lang="sass" scoped>
@import "./keyframes.scss"
.bg-reset
	animation: none
	opacity: 0
.loading-root
	position: fixed
	z-index: 100000
	top: 0
	right: 0
	bottom: 0
	left: 0
	background-color: #000
	&.loading
		animation: bg-fade-in 1s ease-out forwards
</style>
