<template lang="pug">
.root.bg_1(ref="root")
	Container(v-if="gameData" v-bind="gameData")
	Panel(v-if="gameData" v-bind="gameData")
</template>

<script>
import { KEY_ENUM } from '@/assets/js/dicts';
import Game from './libs/Game';
import Container from './components/Container';
import Panel from './components/Panel';

// 用于缓存当前已按下的按键
const keyMap = {};

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
					// this.game.stopFalling();
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
					// this.game.pause();
					break;
				}
				// 按 A 或 LEFT 向左移动
				case KEY_ENUM.A:
				case KEY_ENUM.LEFT: {
					if (keyMap[KEY_ENUM.LEFT]) return;
					keyMap[KEY_ENUM.LEFT] = 1;
					this.game.move(KEY_ENUM.LEFT);
					break;
				}
				// 按 D 或 RIGHT 向右移动
				case KEY_ENUM.D:
				case KEY_ENUM.RIGHT: {
					if (keyMap[KEY_ENUM.RIGHT]) return;
					keyMap[KEY_ENUM.RIGHT] = 1;
					this.game.move(KEY_ENUM.RIGHT);
					break;
				}
				// 按 S 或 DOWN 向下移动
				case KEY_ENUM.S:
				case KEY_ENUM.DOWN: {
					if (keyMap[KEY_ENUM.DOWN]) return;
					keyMap[KEY_ENUM.DOWN] = 1;
					this.game.move(KEY_ENUM.DOWN);
					break;
				}
				// 按 W 或 UP 向上移动
				case KEY_ENUM.W:
				case KEY_ENUM.UP: {
					if (keyMap[KEY_ENUM.UP]) return;
					keyMap[KEY_ENUM.UP] = 1;
					this.game.move(KEY_ENUM.UP);
					break;
				}
			}
		},
		handleKeyup(event) {
			switch (event.keyCode) {
				// 松开 A 或 LEFT 或 D 或 S 或 DOWN 或 W 或 UP 停止屏蔽按键长按状态
				case KEY_ENUM.A:
				case KEY_ENUM.LEFT:
				case KEY_ENUM.D:
				case KEY_ENUM.S:
				case KEY_ENUM.DOWN:
				case KEY_ENUM.W:
				case KEY_ENUM.UP: {
					delete keyMap[KEY_ENUM.LEFT];
					delete keyMap[KEY_ENUM.RIGHT];
					delete keyMap[KEY_ENUM.DOWN];
					delete keyMap[KEY_ENUM.UP];
					break;
				}
			}
		},
		renderCallback(data) {
			this.gameData = data;
			console.log(_.cloneDeep(data));
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
