import { sleep } from '@/libs/utils';
import { TETRIS_SHAPE_CLASS_MAP } from './Basic';
import { cloneModel, getRandomTetris } from './utils';

/**
 * 俄罗斯方块容器类（单例）
 */
export default class Container {
	// 容器的宽度（格数）
	width = 10;
	// 容器的高度（格数）
	height = 20;
	// 准备层的高度（格数）
	readyHeight = 2;
	// 当前容器矩阵模型（左上角为坐标原点）
	matrix = null;
	// 当前的俄罗斯方块实例
	currentTetris = null;
	// 下一个俄罗斯方块实例
	nextTetris = null;
	// 当前游戏等级
	level = 0;
	// 极速下落的速度
	maxSpeed = 60;
	// 当前是否是极速下落的状态
	rapid = false;
	// 是否已 Game Over
	gameover = false;
	// 需要消除的行下标列表
	lineIndexListToEliminate = [];
	// 消除行的动画时长
	durationToEliminate = 500;

	// 获取单例
	static getInstance(renderCallback) {
		if (!Container.instance) {
			Container.instance = new Container(renderCallback);
		}
		return Container.instance;
	}
	// 构造函数 设置容器宽度和高度
	constructor(renderCallback) {
		this.renderCallback = renderCallback;
		// 通过 reset 初始化游戏
		this.reset();
	}
	// 销毁容器
	destroy() {
		this.matrix = null;
		this.currentTetris = null;
		this.nextTetris = null;
		this.lineIndexListToEliminate = [];
		Container.instance = null;
	}
	// 获取当前游戏等级的下落速度
	get speed() {
		if (this.rapid) return this.maxSpeed;
		const ms = 1000 - (this.level * 100);
		return ms < 100 ? 100 : ms;
	}
	// 重置游戏
	reset() {
		// 重置 Game Over 状态
		this.gameover = false;
		const { width, height } = this;
		// 初始化容器矩阵模型
		const matrix = new Array(height);
		for (let i = 0; i < height; i++) {
			matrix[i] = new Array(width).fill(0);
		}
		this.matrix = matrix;
		// 重置当前游戏等级
		this.level = 0;
		// 开始游戏
		this.next();
	}
	// 初始化下一个俄罗斯方块
	next() {
		// 设置下一个俄罗斯方块
		const randomNextTetris = () => {
			// 随机获取一个俄罗斯方块（形状，旋转状态）
			const { shape, spinStatus } = getRandomTetris();
			// 将随机获取的俄罗斯方块设置为下一个俄罗斯方块
			this.nextTetris = new TETRIS_SHAPE_CLASS_MAP[shape](spinStatus);
		}
		// 开始游戏时设置第一个俄罗斯方块
		if (!this.nextTetris) randomNextTetris();
		// 将下一个俄罗斯方块设置为当前俄罗斯方块
		const curr = this.currentTetris = this.nextTetris;
		// 设置下一个俄罗斯方块
		randomNextTetris();
		// 初始化当前俄罗斯方块的位置（最上方中间的位置）
		const x = Math.floor(this.width / 2 - curr.matrix[0].length / 2)
		curr.setPosition(x, -2);
		// 验证当前俄罗斯方块位置初始化后，是否会产生碰撞导致 Game Over
		if (this._checkGameOver()) return;
		// 开始下落
		this.startFalling();
	}
	// 开始下落
	startFalling() {
		// 停止前一个定时器
		this.stopFalling();
		// 开始下落定时器
		this._handleFalling = setInterval(() => this.fallOneStep(), this.speed);
	}
	// 停止下落
	stopFalling() {
		// 停止当前的下落定时器
		clearInterval(this._handleFalling);
	}
	// 当前俄罗斯方块下落一格
	async fallOneStep() {
		const curr = this.currentTetris;
		let { matrix: tetrisMatrix, position: { x, y } } = curr;
		// 验证当前俄罗斯方块如果下落一格，是否会产生碰撞
		const willCollide = this._checkCollition(tetrisMatrix, { x, y: y + 1 });
		if (!willCollide) {
			// 没有碰撞，下落一格
			curr.setPosition(x, y + 1);
			// 推送渲染数据
			this.render();
		} else {
			// 产生碰撞了，停止下落
			this.stopFalling();
			// 重置当前是否是极速下落的状态
			this.rapid = false;
			// 判断是否已 Game Over
			if (this._checkGameOver(true)) return;
			// 尝试查找和消除俄罗斯方块，然后将俄罗斯方块石化到容器矩阵模型中
			await this._eliminateAndPetrify();
			// 初始化下一个俄罗斯方块
			this.next();
		}
	}
	/**
	 * 下落
	 * @param {boolean} rapid - 当前是否是极速下落的状态
	 */
	fall(rapid = true) {
		if (rapid === this.rapid) return;
		// 变更当前是否是极速下落的状态
		this.rapid = rapid;
		// 重新开始下落
		this.startFalling();
	}
	// 当前俄罗斯方块旋转一次
	spin(clockwise = true) {
		const curr = this.currentTetris;
		let { shape, spinStatus, matrix, position: { x, y } } = curr;
		// TODO: 验证是否可旋转（是否被横向阻挡，正常旋转，或左移一格）

		spinStatus = (spinStatus + (clockwise ? 1 : -1)) % 4;
		curr.setSpinStatus(spinStatus);
		// TODO: 验证当前俄罗斯方块旋转后，是否会产生碰撞
	}
	// 判断是否已 Game Over（下落过程中高度是否已超出容器高度，或当前俄罗斯方块已产生碰撞）
	_checkGameOver(falling = false) {
		const curr = this.currentTetris;
		let { matrix: tetrisMatrix, position: { x, y } } = curr;
		// 高度是否已超出容器高度，或当前俄罗斯方块已产生碰撞
		const gameover = (falling && y < 0) || this._checkCollition(tetrisMatrix, { x, y });
		if (gameover) {
			// 将游戏设置为已 Game Over
			this.gameover = true;
			// 推送渲染数据
			this.render();
		}
		return gameover;
	}
	// 验证给定的俄罗斯方块矩阵模型是否碰撞
	_checkCollition(tetrisMatrix, { x, y }) {
		const containerMatrix = this.matrix;
		// 给定俄罗斯方块矩阵模型的行数
		const yLen = tetrisMatrix.length;
		// 给定俄罗斯方块矩阵模型的列数
		const xLen = tetrisMatrix[0].length;
		// 判断：是否与容器左侧的边界碰撞
		if (x < 0) return true;
		// 判断：是否与容器右侧的边界碰撞
		if (xLen + x > this.width) return true;
		// 判断：是否与容器底部的边界碰撞
		if (yLen + y > this.height) return true;
		// 判断：是否与容器中已有的俄罗斯方块碰撞
		for (let i = 0; i < yLen && y + i >= 0; i++) {
			for (let j = 0; j < xLen; j++) {
				if (tetrisMatrix[i][j] & containerMatrix[y + i][x + j]) {
					return true;
				}
			}
		}
		return false;
	}
	// 尝试查找和消除俄罗斯方块，然后将俄罗斯方块石化到容器矩阵模型中
	async _eliminateAndPetrify() {
		const lineIndexList = this.lineIndexListToEliminate = [];
		const curr = this.currentTetris;
		const { matrix: tetrisMatrix, position: { y } } = curr;
		const containerMatrix = this.matrix;
		// 当前俄罗斯方块矩阵模型的行数
		const yLen = tetrisMatrix.length;
		for (let i = 0; i < yLen && y + i >= 0; i++) {
			// 判断是否当前行是否可消除
			const isFullLine = [ ...tetrisMatrix[i], ...containerMatrix[y + i] ].every((n) => n);
			if (isFullLine) lineIndexList.push(i);
		}
		if (lineIndexList.length) {
			// 推送渲染数据
			this.render();
			// 消除动画进行时间
			await sleep(this.durationToEliminate);
		}
		// 将当前俄罗斯方块石化到容器矩阵模型中
		this._petrifyTetrisToContainer();
		// 重置需要消除的行下标列表
		this.lineIndexListToEliminate = [];
		// 推送渲染数据
		this.render();
	}
	// 将当前俄罗斯方块石化到容器矩阵模型中（包括移除可消除的层）
	_petrifyTetrisToContainer() {
		const lineIndexList = this.lineIndexListToEliminate;
		const curr = this.currentTetris;
		const { matrix: tetrisMatrix, position: { x, y } } = curr;
		const containerMatrix = this.matrix;
		// 当前俄罗斯方块矩阵模型的行数
		const yLen = tetrisMatrix.length;
		// 当前俄罗斯方块矩阵模型的列数
		const xLen = tetrisMatrix[0].length;
		// 将当前俄罗斯方块石化到容器矩阵模型中
		for (let i = 0; i < yLen; i++) {
			for (let j = 0; j < xLen; j++) {
				containerMatrix[y + i][x + j] = tetrisMatrix[i][j];
			}
		}
		if (!lineIndexList.length) return;
		// 移除可消除的层
		lineIndexList.forEach((i) => {
			containerMatrix.splice(i, 1);
			containerMatrix.shift(new Array(xLen).fill(0));
		});
	}
	// 推送渲染数据
	render() {
		// const data = {
		// 	matrix: this.matrix,
		// 	current: this.currentTetris,
		// 	next: this.nextTetris,
		// 	gameover: this.gameover,
		// 	lineIndexListToEliminate: this.lineIndexListToEliminate,
		// };
		this.renderCallback(this);
	}
}

// 
// petrified 石化的
// eliminable 可消除的
// grid 格子
// spin 旋转
// falling rapidly 极速下落
// frozen 冻结状态