<template>
<div class="loading-root" :class="{ loading }">
	<img src="@/assets/images/icon.png" />
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

.loading-root
	position: fixed
	z-index: 100000
	top: 0
	right: 0
	bottom: 0
	left: 0
	background-color: #000
	display: flex
	justify-content: center
	align-items: center
	opacity: 1
	&.loading
		animation: bg-fade-out .5s ease-in 1s forwards
		img
			animation: bounce-in-top 1s forwards, slide-out-top 0.4s cubic-bezier(0.550, 0.085, 0.680, 0.530) 1.1s forwards
</style>
