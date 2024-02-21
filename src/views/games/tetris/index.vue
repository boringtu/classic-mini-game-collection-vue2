<template lang="pug">
.root
	Container(v-if="gameData" v-bind="gameData")
</template>

<script>
import _ from 'lodash';
import Container from './components/Container';
import { KEY_ENUM } from '@/assets/js/dicts';
import Game from './libs/Game';

export default {
	components: {
		Container,
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
		this.game = Game.getInstance(this.renderCallback);
		window.game = this.game;

		document.addEventListener('keydown', this.handleKeydown);
		document.addEventListener('keyup', this.handleKeyup);
	},
	beforeDestroy() {
		document.removeEventListener('keydown', this.handleKeydown);
		document.removeEventListener('keyup', this.handleKeyup);
		this.game.destroy();
	},
	methods: {
		handleKeydown(event) {
			switch (event.keyCode) {
				case 90: {
					// z
					this.game.stopFalling();
					break;
				}
				// 按 A 或 LEFT 向左移动当前俄罗斯方块
				case KEY_ENUM.A:
				case KEY_ENUM.LEFT: {
					this.game.move(true);
					break;
				}
				// 按 D 或 RIGHT 向右移动当前俄罗斯方块
				case KEY_ENUM.D:
				case KEY_ENUM.RIGHT: {
					this.game.move(false);
					break;
				}
				// 按 S 或 DOWN 向下移动当前俄罗斯方块
				case KEY_ENUM.S:
				case KEY_ENUM.DOWN: {
					this.game.fall();
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
