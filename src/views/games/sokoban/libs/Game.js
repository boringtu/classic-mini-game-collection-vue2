import _ from 'lodash';
import { cloneModel } from '@/libs/utils';
import { coordinateComparison } from './utils';
import { DIGIT_TYPE_ENUM, STORATE_LEVEL_KEY } from './consts';
import { KEY_ENUM } from '@/assets/js/dicts';
import LEVEL_MAP from './levels';

// level 关卡数
// step 移动次数
// 已完成个数与目标点总个数
// 需要保存已通过的关卡数

/**
 * 推箱子游戏类（单例）
 */
export default class Game {
	// 容器的宽度（格数）
	width = 10;
	// 容器的高度（格数）
	height = 20;
	// 当前关卡数
	level = 1;
	// 移动次数
	step = 0;
	// 综合矩阵模型（左上角为坐标原点）
	matrix = null;
	// 工人
	worker = null;
	// 箱子列表
	boxes = null;
	// 历史记录
	history = null;

	// 获取单例
	static getInstance(renderCallback) {
		if (!Game.instance) {
			Game.instance = new Game(renderCallback);
		}
		return Game.instance;
	}
	// 构造函数 设置容器宽度和高度
	constructor(renderCallback) {
		this.renderCallback = renderCallback;
		// 通过 restart 初始化游戏
		this.restart();
	}
	// 销毁容器
	destroy() {
		this.matrix = null;
		this.worker = null;
		this.boxes = null;
		this.history = null;
		Game.instance = null;
	}
	// 初始化综合矩阵模型
	initMatrix() {
		const { width, height, level } = this;
		// 当前关卡原始数据矩阵模型
		const origin = LEVEL_MAP[level];
		// 原始数据矩阵模型的行数
		const yLen = origin.length;
		// 原始数据矩阵模型的列数
		const xLen = origin[0].length;
		// 原始数据矩阵模型在容器居中的垂直偏移量
		const yOffset = Math.floor((height - yLen) / 2);
		// 原始数据矩阵模型在容器居中的水平偏移量
		const xOffset = Math.floor((width - xLen) / 2);
		// 初始化综合矩阵模型
		const matrix = new Array(height).fill(0).map(() => new Array(width).fill(0));
		for (let i = 0; i < height; i++) {
			if (i - yOffset < 0 || i - yOffset >= yLen) continue;
			for (let j = 0; j < width; j++) {
				if (j - xOffset < 0) continue;
				matrix[i][j] |= origin[i - yOffset][j - xOffset];
				if (matrix[i][j] & DIGIT_TYPE_ENUM.WORKER) {
					this.worker = [j, i];
				} else if (matrix[i][j] & DIGIT_TYPE_ENUM.BOX) {
					this.boxes.push([j, i]);
				}
			}
		}
		this.matrix = matrix;
		// 追加历史记录
		this._addHistory();
	}
	/**
	 * 移动工人
	 */
	move(direction) {
		console.log(direction);
		const { matrix, worker } = this;
		const [wx, wy] = worker;
		let tx, ty;
		// 根据方向计算工人的目标位置
		switch (direction) {
			case KEY_ENUM.UP:
				tx = wx;
				ty = wy - 1;
				break;
			case KEY_ENUM.DOWN:
				tx = wx;
				ty = wy + 1;
				break;
			case KEY_ENUM.LEFT:
				tx = wx - 1;
				ty = wy;
				break;
			case KEY_ENUM.RIGHT:
				tx = wx + 1;
				ty = wy;
				break;
		}
		// 判断是否撞墙
		if (matrix[ty][tx] & DIGIT_TYPE_ENUM.WALL) return;
		// 判断是否撞箱子，且箱子可以向前推动
		if (matrix[ty][tx] & DIGIT_TYPE_ENUM.BOX) {
			// 箱子前面的位置
			const fx = tx + (tx - wx);
			const fy = ty + (ty - wy);
			// 判断箱子前面的位置是否是墙或箱子
			if ((matrix[fy][fx] & DIGIT_TYPE_ENUM.WALL) || (matrix[fy][fx] & DIGIT_TYPE_ENUM.BOX)) return;
			// 移动箱子
			matrix[ty][tx] ^= DIGIT_TYPE_ENUM.BOX;
			matrix[fy][fx] ^= DIGIT_TYPE_ENUM.BOX;
			const i = this.boxes.findIndex((box) => coordinateComparison(box, [tx, ty]));
			this.boxes[i] = [fx, fy];
		}
		// 移动工人
		matrix[wy][wx] ^= DIGIT_TYPE_ENUM.WORKER;
		matrix[ty][tx] ^= DIGIT_TYPE_ENUM.WORKER;
		this.worker = [tx, ty];
		// 步数加一
		this.step++;
		// 追加历史记录
		this._addHistory();
		// 推送渲染数据
		this.render();
	}
	/**
	 * 重置游戏
	 */
	restart() {
		// 获取持久化存储的当前关卡数
		this.level = +localStorage.getItem(STORATE_LEVEL_KEY) || 1;
		// 重置移动步数
		this.step = 0;
		// 重置工人
		this.worker = null;
		// 重置箱子列表
		this.boxes = [];
		// 重置历史记录
		this.history = [];
		// 初始化综合矩阵模型
		this.initMatrix();
		// 推送渲染数据
		this.render();
	}
	/**
	 * 追加历史记录
	 */
	_addHistory() {
		this.history.push({
			matrix: cloneModel(this.matrix),
			worker: cloneModel(this.worker),
			boxes: cloneModel(this.boxes),
		});
	}
	// 推送渲染数据
	render() {
		// 推送渲染数据
		const data = {
			width: this.width,
			height: this.height,
			matrix: cloneModel(this.matrix),
			level: this.level,
			step: this.step,
			worker: this.worker,
			boxes: this.boxes,
		};
		this.renderCallback(data);
	}
}
