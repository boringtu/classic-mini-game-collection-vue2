<template lang="pug">
.panel-root
	.panel-box.next-panel
		h2 NEXT
		.next-box
			ShapeView(v-if="shapeParams" v-bind="shapeParams")
	.panel-box.score-panel
		h2 SCORE
		strong {{ score }}
	.panel-box.lines-panel
		h2 LINES
		strong {{ lines }}
	.panel-box.level-panel
		h2 LEVEL
		strong {{ level }}
	.panel-box.statistics-panel
		h2 STATISTICS
		ul
			li(
				v-for="(shapeParams, i) in STATS_CONFIG_LIST"
				:key="i"
			)
				ShapeView(v-bind="shapeParams" :zoom=".4")
				strong {{ stats[shapeParams.shape] || 0 }}
</template>

<script>
import ShapeView from '../Shape';
import { Grid } from '../../libs/Basic';
import { STATS_CONFIG_LIST } from './consts';

export default {
	props: {
		score: Number,
		lines: Number,
		level: Number,
		nextTetris: Object,
		stats: Object,
	},
	components: {
		ShapeView,
	},
	data() {
		return {
			STATS_CONFIG_LIST,
		};
	},
	computed: {
		// 下一个俄罗斯方块的 ShapeView 参数对象
		shapeParams() {
			const { nextTetris } = this;
			if (!nextTetris) return null;
			console.log('nextTetris', nextTetris);
			const { shape, spinStatus } = nextTetris;
			return { shape, spinStatus, zoom: .5 };
		},
		// 下一个俄罗斯方块的 grid 矩阵模型
		gridMatrix() {
			const { nextTetris } = this;
			if (!nextTetris) return [[]];
			const { matrix: tetrisMatrix, color } = nextTetris;
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
.panel-root
	background-color: #000
	width: 300px
	height: 1143px
	padding: 12px
	border: 10px solid #fff
	border-left: 0
	display: flex
	flex-direction: column
	align-items: stretch
	.panel-box
		margin-bottom: 12px
		padding: 16px
		border: 1px solid #fff
		display: flex
		flex-direction: column
		h2
			color: #999
		strong
			color: #fff
			margin-top: 24px
	.next-panel
		height: 200px
		padding-bottom: 0
		.next-box
			flex: 1
			display: flex
			justify-content: center
			align-items: center
	.statistics-panel
		flex: 1
		display: flex
		flex-direction: column
		align-items: stretch
		ul
			flex: 1
			padding-top: 16px
			display: flex
			flex-direction: column
			justify-content: space-around
			align-items: stretch
			li
				width: 100%
				height: 50px
				padding: 0 36px
				display: flex
				justify-content: space-between
				align-items: center
				strong
					margin: 0
</style>
