import { TETRIS_SPIN_STATUS_ENUM } from './consts';

/**
 * clone 数据模型（只支持纯 JSON 数据模型 object | array）
 * @param {object | array} model 数据模型
 * @returns clone 后的数据模型
 */
export const cloneModel = (model) => {
	return JSON.parse(JSON.stringify(model));
}

/**
 * 将给定矩阵顺时针旋转指定次数 90°
 *
 * @param {array} matrix - 要旋转的矩阵
 * @param {number} spinTimes - 将给定矩阵顺时针旋转 90° 的次数（默认旋转 1 次）
 * @return {array} 旋转后的矩阵
 */
export const spinMatrix = (matrix, spinTimes = TETRIS_SPIN_STATUS_ENUM.ROTATE_90) => {
	// 单次旋转矩阵
	const fn = (matrix) => {
		// 原矩阵的行数
		const yLen = matrix.length;
		// 原矩阵的列数
		const xLen = matrix[0].length;

		// 创建一个新的矩阵来存储旋转后的结果
		const spinnedMatrix = new Array(xLen);
		for (let i = 0; i < xLen; i++) {
			spinnedMatrix[i] = new Array(yLen);
		}
		// 执行旋转操作
		for (let i = 0; i < yLen; i++) {
			for (let j = 0; j < xLen; j++) {
				spinnedMatrix[j][yLen - 1 - i] = matrix[i][j];
			}
		}
		return spinnedMatrix;
	};
	// 旋转 spinTimes 次
	return new Array(spinTimes).fill(null).reduce(fn, matrix);
}

/**
 * 随机获取俄罗斯方块
 */
export const getRandomTetris = () => {
	// 随机获取俄罗斯方块形状
	const shape = Math.floor(Math.random() * 7);
	// 随机获取俄罗斯方块旋转状态
	const spinStatus = Math.floor(Math.random() * 4);
	return { shape, spinStatus };
}

