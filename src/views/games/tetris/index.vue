<template lang="pug">
.root.bg_1(ref="root")
	Container(v-if="gameData" v-bind="gameData")
	Panel(v-if="gameData" v-bind="gameData")
</template>

<script>
import _ from 'lodash';
import Container from './components/Container';
import Panel from './components/Panel';
import { KEY_ENUM } from '@/assets/js/dicts';
import Game from './libs/Game';

// 用于缓存当前已按下的按键
const keyMap = {};
// 连续按键触发延迟时间
const keyTurboDelay = 200;

export default {
	components: {
		Container,
		Panel,
	},
	data() {
		return {
			gameData: null,
		};
	},
	mounted() {
		this.game = Game.getInstance(this.renderCallback);
		window.game = this.game;

		document.addEventListener('keydown', this.handleKeydown);
		document.addEventListener('keyup', this.handleKeyup);

		this.$bus.$on('resize', this.resizeWindow);
		this.resizeWindow();
	},
	beforeDestroy() {
		document.removeEventListener('keydown', this.handleKeydown);
		document.removeEventListener('keyup', this.handleKeyup);

		this.$bus.$off('resize', this.resizeWindow);

		this.game.destroy();
		this.game = null;
	},
	methods: {
        resizeWindow() {
            // 计算页面缩放比例（0.25 的倍数）
            const zoom = Math.min(
				+(Math.floor(document.documentElement.clientHeight / 1200 * 4) / 4).toFixed(2),
				+(Math.floor(document.documentElement.clientWidth / 1000 * 4) / 4).toFixed(2),
			);
            // 缩放页面
            this.$refs.root.style.zoom = zoom;
        },
		handleKeydown(event) {
			switch (event.keyCode) {
				case 90: {
					// z
					this.game.stopFalling();
					break;
				}
				case 32: {
					// TODO: TEST CODE
					window._debugging = true;
					// this.game.restart();
					break;
				}
				// 按 START 键 暂停游戏 / 开始游戏 或 重新开始游戏
				case KEY_ENUM.START: {
					this.game.pause();
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
				// 按 TURBO_A 或 SINGLE_A 顺时针转动当前俄罗斯方块
				case KEY_ENUM.TURBO_A:
				case KEY_ENUM.SINGLE_A: {
					if (event.keyCode === KEY_ENUM.TURBO_A) {
						if (keyMap[KEY_ENUM.TURBO_A]) return;
						keyMap[KEY_ENUM.TURBO_A] = 1;
						this.spinContinuously(true);
					} else {
						if (keyMap[KEY_ENUM.SINGLE_A]) return;
						keyMap[KEY_ENUM.SINGLE_A] = 1;
						// 停止之前的旋转相关的定时器
						clearTimeout(this._handleSpinTimeout);
						clearInterval(this._handleSpinInterval);
					}
					this.game.spin(true);
					break;
				}
				// 按 TURBO_B 或 SINGLE_B 逆时针转动当前俄罗斯方块
				case KEY_ENUM.TURBO_B:
				case KEY_ENUM.SINGLE_B: {
					if (event.keyCode === KEY_ENUM.TURBO_B) {
						if (keyMap[KEY_ENUM.TURBO_B]) return;
						keyMap[KEY_ENUM.TURBO_B] = 1;
						this.spinContinuously(false);
					} else {
						if (keyMap[KEY_ENUM.SINGLE_B]) return;
						keyMap[KEY_ENUM.SINGLE_B] = 1;
						// 停止之前的旋转相关的定时器
						clearTimeout(this._handleSpinTimeout);
						clearInterval(this._handleSpinInterval);
					}
					this.game.spin(false);
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
				// 松开 TURBO_A 或 SINGLE_A 或 TURBO_B 或 SINGLE_B 停止转动当前俄罗斯方块
				case KEY_ENUM.TURBO_A:
				case KEY_ENUM.SINGLE_A:
				case KEY_ENUM.TURBO_B:
				case KEY_ENUM.SINGLE_B: {
					delete keyMap[event.keyCode];
					clearTimeout(this._handleSpinTimeout);
					clearInterval(this._handleSpinInterval);
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
		// 连续旋转
		spinContinuously(clockwise) {
			// 停止之前的旋转相关的定时器
			clearTimeout(this._handleSpinTimeout);
			clearInterval(this._handleSpinInterval);
			// 开始本次旋转相关的定时器
			this._handleSpinTimeout = setTimeout(() => {
				this._handleSpinInterval = setInterval(() => {
					this.game.spin(clockwise);
				}, 200);
			}, keyTurboDelay);
		},
		renderCallback(data) {
			this.gameData = data;
			// console.log('score:', data.score, 'lines:', data.lines, 'level:', data.level);
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
	font-family: "8bit"

</style>
