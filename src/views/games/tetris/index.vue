<template lang="pug">
.root
	ContainerView(:gameData="gameData")
</template>

<script>
import ContainerView from './components/Container';
import { KEY_ENUM } from '@/assets/js/dicts';
import Container from './libs/Container';

export default {
	components: {
		ContainerView,
	},
	data() {
		return {
			gameData: null,
			containerMatrix: [],
			tetrisMatrix: [],
		};
	},
	mounted() {
		window.x = this;
		this.container = Container.getInstance(this.renderCallback);
		window.container = this.container;

		window.addEventListener('keydown', this.handleKeydown);
		window.addEventListener('keyup', this.handleKeyup);
	},
	beforeDestroy() {
		window.removeEventListener('keydown', this.handleKeydown);
		window.removeEventListener('keyup', this.handleKeyup);
		this.container.destroy();
	},
	methods: {
		handleKeydown(event) {
			switch (event.keyCode) {
			}
		},
		handleKeyup(event) {
		},
		renderCallback(data) {
			this.gameData = data;
			console.log(data);
		},
	},
}
</script>

<style lang="sass" scoped>
.root
	background-color: #000
	position: fixed
	top: 0
	right: 0
	bottom: 0
	left: 0
	display: flex
	align-items: center
</style>
