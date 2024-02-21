<template lang="pug">
.root
	Container(v-if="gameData" v-bind="gameData")
</template>

<script>
import _ from 'lodash';
import Container from './components/Container';
import { KEY_ENUM } from '@/assets/js/dicts';
import Game from './libs/Game';

// 用于缓存当前已按下的按键
const keyMap = {};
// 连续按键触发延迟时间
const keyTurboDelay = 200;

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
					if (keyMap[KEY_ENUM.LEFT]) return;
					keyMap[KEY_ENUM.LEFT] = 1;
					this.moveContinuously(true);
					this.game.move(true);
					break;
				}
				// 按 D 或 RIGHT 向右移动当前俄罗斯方块
				case KEY_ENUM.D:
				case KEY_ENUM.RIGHT: {
					if (keyMap[KEY_ENUM.RIGHT]) return;
					keyMap[KEY_ENUM.RIGHT] = 1;
					this.moveContinuously(false);
					this.game.move(false);
					break;
				}
				// 按 S 或 DOWN 向下移动当前俄罗斯方块
				case KEY_ENUM.S:
				case KEY_ENUM.DOWN: {
					if (keyMap[KEY_ENUM.DOWN]) return;
					keyMap[KEY_ENUM.DOWN] = 1;
					this.fallRapidly();
					this.game.fall();
					break;
				}
			}
		},
		handleKeyup(event) {
			switch (event.keyCode) {
				// 松开 A 或 LEFT 或 D 或 RIGHT 停止移动当前俄罗斯方块
				case KEY_ENUM.A:
				case KEY_ENUM.LEFT:
				case KEY_ENUM.D:
				case KEY_ENUM.RIGHT: {
					delete keyMap[KEY_ENUM.LEFT];
					delete keyMap[KEY_ENUM.RIGHT];
					clearTimeout(this._handleMoveTimeout);
					clearInterval(this._handleMoveInterval);
					break;
				}
				// 松开 S 或 DOWN 停止下落当前俄罗斯方块
				case KEY_ENUM.S:
				case KEY_ENUM.DOWN: {
					delete keyMap[KEY_ENUM.DOWN];
					clearTimeout(this._handleFallTimeout);
					this.game.setRapid(false);
					break;
				}
			}
		},
		// 连续平移
		moveContinuously(toLeft) {
			// 停止之前的移动相关的定时器
			clearTimeout(this._handleMoveTimeout);
			clearInterval(this._handleMoveInterval);
			// 开始本次移动相关的定时器
			this._handleMoveTimeout = setTimeout(() => {
				this._handleMoveInterval = setInterval(() => {
					this.game.move(toLeft);
				}, 60);
			}, keyTurboDelay);
		},
		// 极速下落
		fallRapidly() {
			// 停止之前的移动相关的定时器
			clearTimeout(this._handleFallTimeout);
			// 开始本次下落相关的定时器
			this._handleFallTimeout = setTimeout(() => {
				this.game.fall(true);
			}, keyTurboDelay);
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
