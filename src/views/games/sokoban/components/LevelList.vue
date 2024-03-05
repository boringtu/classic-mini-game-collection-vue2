<template lang="pug">
.level-list-root(:class="{ hiding }")
	.container
		h1
			span CHOOSE
			span LEVEL
		h2
			span PUSH
			span.key UP
			span.key DOWN
			span.key LEFT
			span.key RIGHT
			span.key B
			span.key A
			span.key START
			span KEY
		.preview
			.matrix-box
				.row(v-for="(row, i) in matrix" :key="i")
					GridView(
						v-for="(v, j) in row"
						:key="`${i}-${j}`"
						:value="v"
					)
		ul
			li(
				v-for="(matrix, i) in levelList"
				:key="i"
				:class="{ active: i + 1 === activeLevel, disabled: i + 1 > maxLevel }"
			)
				label LEVEL {{ i + 1 }}
</template>

<script>
import { KEY_ENUM } from '@/assets/js/dicts';
import LEVEL_MAP from '../libs/levels';
import GridView from './Grid';
import { STORATE_LEVEL_KEY } from '../libs/consts';
import { sleep } from '@/libs/utils';

// 用于缓存当前已按下的按键
const keyMap = {};

export default {
	props: {
		game: Object,
		level: Number,
	},
	components: {
		GridView,
	},
	data() {
		return {
			activeLevel: null,
			hiding: false,
		};
	},
	watch: {
		level: {
			immediate: true,
			handler(level) {
				this.activeLevel = level;
			},
		},
	},
	computed: {
		levelList() {
			const list = [];
			const len = Object.keys(LEVEL_MAP).length;
			for (let level = 1; level <= len; level++) {
				list.push(LEVEL_MAP[level]);
			}
			return list;
		},
		// 最高已通过关卡数
		maxLevel() {
			return localStorage.getItem(STORATE_LEVEL_KEY) || 1;
		},
		matrix() {
			return LEVEL_MAP[this.activeLevel];
		},
	},
	mounted() {
		document.addEventListener('keydown', this.handleKeydown);
		document.addEventListener('keyup', this.handleKeyup);
	},
	beforeDestroy() {
		document.removeEventListener('keydown', this.handleKeydown);
		document.removeEventListener('keyup', this.handleKeyup);
	},
	methods: {
		handleKeydown(event) {
			const { maxLevel, activeLevel } = this;
			switch (event.keyCode) {
				// 按 A 或 LEFT 向左移动
				case KEY_ENUM.A:
				case KEY_ENUM.LEFT: {
					if (keyMap[KEY_ENUM.LEFT]) return;
					keyMap[KEY_ENUM.LEFT] = 1;
					if (activeLevel > 5) this.activeLevel -= 5;
					break;
				}
				// 按 D 或 RIGHT 向右移动
				case KEY_ENUM.D:
				case KEY_ENUM.RIGHT: {
					if (keyMap[KEY_ENUM.RIGHT]) return;
					keyMap[KEY_ENUM.RIGHT] = 1;
					if (activeLevel <= maxLevel - 5) this.activeLevel += 5;
					break;
				}
				// 按 S 或 DOWN 向下移动
				case KEY_ENUM.S:
				case KEY_ENUM.DOWN: {
					if (keyMap[KEY_ENUM.DOWN]) return;
					keyMap[KEY_ENUM.DOWN] = 1;
					if (activeLevel % 5 && activeLevel < maxLevel) this.activeLevel++;
					break;
				}
				// 按 W 或 UP 向上移动
				case KEY_ENUM.W:
				case KEY_ENUM.UP: {
					if (keyMap[KEY_ENUM.UP]) return;
					keyMap[KEY_ENUM.UP] = 1;
					if ((activeLevel + 4) % 5) this.activeLevel--;
					break;
				}
				// 按 START 或 SINGLE_A 键 开始选中的关卡
				case KEY_ENUM.START:
				case KEY_ENUM.SINGLE_A: {
					this.game.restart(activeLevel);
					this.close();
					break;
				}
				// 按 SINGLE_B 关闭关卡列表
				case KEY_ENUM.SINGLE_B: {
					this.close();
					break;
				}
			}
		},
		handleKeyup(event) {
			switch (event.keyCode) {
				// 松开 A 或 LEFT 停止屏蔽按键长按状态
				case KEY_ENUM.A:
				case KEY_ENUM.LEFT: {
					delete keyMap[KEY_ENUM.LEFT];
					break;
				}
				// 松开 D 或 RIGHT 停止屏蔽按键长按状态
				case KEY_ENUM.D:
				case KEY_ENUM.RIGHT: {
					delete keyMap[KEY_ENUM.RIGHT];
					break;
				}
				// 松开 S 或 DOWN 停止屏蔽按键长按状态
				case KEY_ENUM.S:
				case KEY_ENUM.DOWN: {
					delete keyMap[KEY_ENUM.DOWN];
					break;
				}
				// 松开 W 或 UP 停止屏蔽按键长按状态
				case KEY_ENUM.W:
				case KEY_ENUM.UP: {
					delete keyMap[KEY_ENUM.UP];
					break;
				}
				// 松开 START 停止屏蔽按键长按状态
				case KEY_ENUM.START: {
					delete keyMap[KEY_ENUM.START];
					break;
				}
				// 松开 SINGLE_B 停止屏蔽按键长按状态
				case KEY_ENUM.SINGLE_B: {
					delete keyMap[KEY_ENUM.SINGLE_B];
					break;
				}
			}
		},
		// 关闭关卡列表
		async close() {
			this.hiding = true;
			await sleep(500);
			this.$emit('close');
		},
	},
}
</script>

<style lang="sass" scoped>
@keyframes bounce-in-top
	0%
		transform: translateY(-500px)
		animation-timing-function: ease-in
		opacity: 0
	38%
		transform: translateY(0)
		animation-timing-function: ease-out
		opacity: 1
	55%
		transform: translateY(-65px)
		animation-timing-function: ease-in
	72%
		transform: translateY(0)
		animation-timing-function: ease-out
	81%
		transform: translateY(-28px)
		animation-timing-function: ease-in
	90%
		transform: translateY(0)
		animation-timing-function: ease-out
	95%
		transform: translateY(-8px)
		animation-timing-function: ease-in
	100%
		transform: translateY(0)
		animation-timing-function: ease-out

@keyframes slide-out-top
	0%
		transform: translateY(0)
		opacity: 1
	100%
		transform: translateY(-1000px)
		opacity: 0

.level-list-root
	background-color: #000
	position: fixed
	z-index: 10
	top: 0
	right: 0
	bottom: 0
	left: 0
	display: flex
	justify-content: center
	align-items: center
	font-family: "8bit"
	animation: bounce-in-top 1s both
	&.hiding
		animation: slide-out-top .5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both
	.container
		h1
			font-size: 24px
			span
				color: #fff
				+ span
					margin-left: 16px
		h2
			font-size: 20px
			margin-top: 36px
			span
				color: #86bed9
				+ span
					margin-left: 16px
				&.key
					color: #eb974c
		.preview
			margin-top: 24px
			height: 280px
			display: flex
			justify-content: center
			align-items: center
			.matrix-box
				zoom: .75
				display: flex
				flex-direction: column
				row-gap: 1px
				.row
					display: flex
					column-gap: 1px
		ul
			display: flex
			flex-direction: column
			flex-wrap: wrap
			height: calc(48px * 5 + 12px * 4)
			row-gap: 12px
			column-gap: 24px
			li
				border: 1px solid transparent
				border-radius: 8px
				padding: 12px
				label
					color: #fff
				&.active
					border-color: #fff
				&.disabled
					label
						color: #333
</style>
