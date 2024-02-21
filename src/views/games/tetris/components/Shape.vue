<template lang="pug">
.shape(:style="{ zoom }")
	.row(v-for="(row, i) in gridMatrix" :key="i")
		GridView(
			v-for="(grid, j) in row"
			:key="`${i}-${j}`"
			:data="grid"
		)
</template>

<script>
import GridView from './Grid';
import { TETRIS_SHAPE_COLOR_ENUM, TETRIS_SHAPE_MATRIX } from '../libs/consts';
import { spinMatrix } from '../libs/utils';
import { Grid } from '../libs/Basic';

export default {
	props: {
		// 缩放倍数
		zoom: Number,
		// 俄罗斯方块形状枚举值 TETRIS_SHAPE_ENUM
		shape: Number,
		// 俄罗斯方块旋转状态枚举值 TETRIS_SPIN_STATUS_ENUM
		spinStatus: Number,
	},
	components: {
		GridView,
	},
	computed: {
		// 俄罗斯方块的 grid 矩阵模型
		gridMatrix() {
			const { shape, spinStatus } = this;
			const color = TETRIS_SHAPE_COLOR_ENUM[shape];
			const originMatrix = TETRIS_SHAPE_MATRIX[shape];
			const tetrisMatrix = spinMatrix(originMatrix, spinStatus);
			// 下一个俄罗斯方块矩阵模型的行数
			const yTLen = tetrisMatrix.length;
			// 下一个俄罗斯方块矩阵模型的列数
			const xTLen = tetrisMatrix[0].length;
			// 初始化 grid 矩阵模型
			const matrix = new Array(yTLen);
			for (let i = 0; i < yTLen; i++) {
				matrix[i] = new Array(xTLen).fill(null);
				for (let j = 0; j < xTLen; j++) {
					const n = tetrisMatrix[i][j];
					if (!n) continue;
					matrix[i][j] = new Grid({ color });
				}
			}
			return matrix;
		},
	},
}
</script>

<style lang="sass" scoped>
.shape
	display: inline-block
	.row
		display: flex
		column-gap: 1px
		+ .row
			margin-top: 1px
</style>
