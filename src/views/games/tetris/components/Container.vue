<template lang="pug">
.container-root
	.grid-box
		template(v-for="(row, i) in integratedMatrix")
			GridView(
				v-for="(grid, j) in row"
				:key="`${i}-${j}`"
				:data="grid"
			)
	.redline
	GameOverView(v-if="gameover")
	PausedView(v-if="paused")
</template>

<script>
import GridView from './Grid';
import GameOverView from './GameOver';
import PausedView from './Paused';
import { cloneModel } from '../libs/utils';
import { Grid } from '../libs/Basic';
import { TETRIS_LEVEL_COLOR_LIST } from '../libs/consts';

export default {
	props: {
		width: Number,
		readyHeight: Number,
		matrix: Array,
		currentTetris: Object,
		level: Number,
		gameover: Boolean,
		paused: Boolean,
	},
	components: {
		GridView,
		GameOverView,
		PausedView,
	},
	data() {
		return {
			containerMatrix: [[]],
		};
	},
	watch: {
		matrix: {
			immediate: true,
			handler(matrix, old) {
				if (old && JSON.stringify(matrix) === JSON.stringify(old)) return;
				this.containerMatrix = cloneModel(matrix);
			},
		},
	},
	computed: {
		// 准备阶段的矩阵模型
		readyMatrix() {
			const { width, readyHeight } = this;
			// console.log('readyHeight', readyHeight);
			const readyMatrix = new Array(readyHeight);
			for (let i = 0; i < readyHeight; i++) {
				readyMatrix[i] = new Array(width).fill(0);
			}
			return readyMatrix;
		},
		// 准备阶段的矩阵模型与容器矩阵模型合并后的矩阵模型
		combinedMatrix() {
			return [
				...this.readyMatrix,
				...this.containerMatrix,
			];
		},
		// 综合矩阵模型（包含合并了准备阶段的容器矩阵模型，以及当前俄罗斯方块矩阵模型）
		integratedMatrix() {
			const { currentTetris, combinedMatrix, level } = this;
			// 合并了准备阶段的容器矩阵模型的行数
			const yLen = combinedMatrix.length;
			// 合并了准备阶段的容器矩阵模型的列数
			const xLen = combinedMatrix[0].length;
			// 石化的俄罗斯方块颜色
			const petrifiedColor = TETRIS_LEVEL_COLOR_LIST[level % 10];
			// 初始化综合矩阵模型
			const matrix = new Array(yLen);
			for (let i = 0; i < yLen; i++) {
				matrix[i] = new Array(xLen).fill(null);
				for (let j = 0; j < xLen; j++) {
					const n = combinedMatrix[i][j];
					if (!n) continue;
					matrix[i][j] = new Grid({ color: petrifiedColor });
				}
			}
			// console.log('初始化后的综合矩阵模型：', cloneModel(matrix));
			// 将当前俄罗斯方块插入综合矩阵模型
			if (currentTetris) {
				const { matrix: tetrisMatrix, position: { x, y }, color } = currentTetris;
				// 当前俄罗斯方块矩阵模型的行数
				const yTLen = tetrisMatrix.length;
				// 当前俄罗斯方块矩阵模型的列数
				const xTLen = tetrisMatrix[0].length;
				for (let i = 0; i < yTLen; i++) {
					if (!matrix[y + i + 2]) continue;
					for (let j = 0; j < xTLen; j++) {
						if (!tetrisMatrix[i][j]) continue;
						matrix[y + i + 2][x + j] = new Grid({ color });
					}
				}
			}
			// console.log('插入当前俄罗斯方块的综合矩阵模型：', cloneModel(matrix));
			return matrix;
		},
	},
}
</script>

<style lang="sass" scoped>
.container-root
	// opacity: .1
	position: relative
	border: 10px solid #fff
	.grid-box
		opacity: .1
		width: 509px
		height: 1123px
		display: flex
		flex-wrap: wrap
		row-gap: 1px
		column-gap: 1px
		.grid
			width: 50px
			height: 50px
			border-radius: 8px
	.redline
		position: absolute
		z-index: 10
		left: 0
		bottom: calc(51px * 20 + 1px)
		width: 100%
		height: 1px
		background-color: red
		opacity: .25
</style>
