<template lang="pug">
.root
	ContainerView(v-if="gameData" v-bind="gameData")
</template>

<script>
import _ from 'lodash';
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

		document.addEventListener('keydown', this.handleKeydown);
		document.addEventListener('keyup', this.handleKeyup);
	},
	beforeDestroy() {
		document.removeEventListener('keydown', this.handleKeydown);
		document.removeEventListener('keyup', this.handleKeyup);
		this.container.destroy();
	},
	methods: {
		handleKeydown(event) {
			switch (event.keyCode) {
				case 90: {
					// z
					this.container.stopFalling();
					break;
				}
				// 按 A 或 LEFT 向左移动当前俄罗斯方块
				case KEY_ENUM.A:
				case KEY_ENUM.LEFT: {
					this.container.move(true);
					break;
				}
				// 按 D 或 RIGHT 向右移动当前俄罗斯方块
				case KEY_ENUM.D:
				case KEY_ENUM.RIGHT: {
					this.container.move(false);
					break;
				}
				// 按 S 或 DOWN 向下移动当前俄罗斯方块
				case KEY_ENUM.S:
				case KEY_ENUM.DOWN: {
					this.container.fall();
					break;
				}
			}
		},
		handleKeyup(event) {
		},
		renderCallback(data) {
			this.gameData = data;
			// console.log(_.cloneDeep(data));
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
	justify-content: center
	align-items: center
</style>
