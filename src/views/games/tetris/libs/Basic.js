import { TETRIS_LEVEL_COLOR_LIST, TETRIS_SHAPE_COLOR_ENUM, TETRIS_SHAPE_ENUM, TETRIS_SHAPE_MATRIX, TETRIS_SPIN_STATUS_ENUM } from './consts';
import { spinMatrix } from './utils';

// 最小俄罗斯方块单位
export class Grid {
	// 颜色
	_color = TETRIS_LEVEL_COLOR_LIST[0];
	/**
	 * 构造函数
	 * @param {string} color - 颜色
	 */
	constructor({ color = TETRIS_LEVEL_COLOR_LIST[0] }) {
		this._color = color;
	}
	get color() {
		return this._color;
	}
	// 设置颜色
	setColor(color) {
		this._color = color;
	}
	toString() {
		const data = {
			color: this._color,
		}
		return JSON.stringify(data);
	}
}

// 俄罗斯方块基类
class TetrisShape extends Grid {
	// 横坐标
	_x = -10;
	// 纵坐标
	_y = -10;
	// 形状
	_shape = null;
	// 旋转状态
	_spinStatus = TETRIS_SPIN_STATUS_ENUM.SPIN_0;
	// 当前形状当前旋转状态下的俄罗斯方块的矩阵模型
	_matrix = null;
	/**
	 * 构造函数
	 * @param {Object} shape - 初始形状
	 * @param {String} spinStatus - 初始旋转状态
	 */
	constructor({ shape, spinStatus = TETRIS_SPIN_STATUS_ENUM.SPIN_0 }) {
		// 该形状的默认颜色
		const color = TETRIS_SHAPE_COLOR_ENUM[shape];
		super({ color });
		this._shape = shape;
		// 设置当前俄罗斯方块的旋转状态
		this.setSpinStatus(spinStatus);
	}
	get position() {
		return { x: this._x, y: this._y };
	}
	get shape() {
		return this._shape;
	}
	get spinStatus() {
		return this._spinStatus;
	}
	get matrix() {
		return this._matrix;
	}
	// 设置当前俄罗斯方块的位置
	setPosition(x, y) {
		this._x = x;
		this._y = y;
	}
	// 设置当前俄罗斯方块的旋转状态
	setSpinStatus(spinStatus) {
		this._spinStatus = spinStatus;
		this._matrix = spinMatrix(TETRIS_SHAPE_MATRIX[this._shape], spinStatus);
	}
	// // 初始化当前俄罗斯方块的位置
	// initPosition() {
	// 	// 当前形状当前旋转状态下的俄罗斯方块的矩阵模型
	// 	const matrix = spinMatrix(TETRIS_SHAPE_MATRIX[this._shape], this._spinStatus);
	// 	this._x = matrix[0].;
	// 	this._y = 0;
	// }
}

class TetrisShapeLine extends TetrisShape {
	constructor(spinStatus) {
		super({ shape: TETRIS_SHAPE_ENUM.LINE, spinStatus });
	}
}
class TetrisShapeT extends TetrisShape {
	constructor(spinStatus) {
		super({ shape: TETRIS_SHAPE_ENUM.T, spinStatus });
	}
}
class TetrisShapeS extends TetrisShape {
	constructor(spinStatus) {
		super({ shape: TETRIS_SHAPE_ENUM.S, spinStatus });
	}
}
class TetrisShapeZ extends TetrisShape {
	constructor(spinStatus) {
		super({ shape: TETRIS_SHAPE_ENUM.Z, spinStatus });
	}
}
class TetrisShapeL extends TetrisShape {
	constructor(spinStatus) {
		super({ shape: TETRIS_SHAPE_ENUM.L, spinStatus });
	}
}
class TetrisShapeJ extends TetrisShape {
	constructor(spinStatus) {
		super({ shape: TETRIS_SHAPE_ENUM.J, spinStatus });
	}
}
class TetrisShapeO extends TetrisShape {
	constructor(spinStatus) {
		super({ shape: TETRIS_SHAPE_ENUM.O, spinStatus });
	}
}

// 俄罗斯方块形状类字典
export const TETRIS_SHAPE_CLASS_MAP = {
	[TETRIS_SHAPE_ENUM.LINE]: TetrisShapeLine,
	[TETRIS_SHAPE_ENUM.T]: TetrisShapeT,
	[TETRIS_SHAPE_ENUM.S]: TetrisShapeS,
	[TETRIS_SHAPE_ENUM.Z]: TetrisShapeZ,
	[TETRIS_SHAPE_ENUM.L]: TetrisShapeL,
	[TETRIS_SHAPE_ENUM.J]: TetrisShapeJ,
	[TETRIS_SHAPE_ENUM.O]: TetrisShapeO,
};
