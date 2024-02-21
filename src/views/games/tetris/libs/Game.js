import { sleep } from '@/libs/utils';
import { TETRIS_SHAPE_CLASS_MAP } from './Basic';
import { cloneModel, getRandomTetris, spinMatrix } from './utils';
import { TETRIS_SHAPE_ENUM, TETRIS_SHAPE_MATRIX } from './consts';

/**
 * 俄罗斯方块游戏类（单例）
 */
export default class Game {
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
		if (!Game.instance) {
			Game.instance = new Game(renderCallback);
		}
		return Game.instance;
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
		Game.instance = null;
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
		// 重置极速下落状态
		this.rapid = false;
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
		// 推送渲染数据
		this.render();
		// 开始下落
		this.startFalling();
	}
	// 开始下落
	startFalling() {
		// 停止前一个定时器
		this.stopFalling();
		// 开始下落定时器
		// console.log('speed: ', this.speed);
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
			// 尝试查找和消除俄罗斯方块，然后将当前俄罗斯方块石化到容器矩阵模型中
			await this._eliminateAndPetrify();
			// 初始化下一个俄罗斯方块
			this.next();
		}
	}
	/**
	 * 移动当前俄罗斯方块（只能横向移动）
	 * @param {boolean} toLeft 是否向左移动
	 */
	move(toLeft = false) {
		const curr = this.currentTetris;
		let { matrix: tetrisMatrix, position: { x, y } } = curr;
		const toX = toLeft ? x - 1 : x + 1;
		// 验证当前俄罗斯方块是否可以向指定方向横向移动
		const willCollide = this._checkCollition(tetrisMatrix, { x: toX, y });
		if (willCollide) return;
		curr.setPosition(toX, y);
		// 推送渲染数据
		this.render();
	}
	/**
	 * 主动触发下落，同时改变降落速度
	 * @param {boolean} rapid - 当前是否是极速下落的状态
	 */
	fall(rapid = false) {
		this.setRapid(rapid);
		// 立即下落一格
		this.fallOneStep();
	}
	// 改变降落速度（主动极速下落，或者按当前等级默认速度下落）
	setRapid(rapid) {
		// 变更当前是否是极速下落的状态
		this.rapid = rapid;
		// 重新开始下落
		this.startFalling();
	}
	// 当前俄罗斯方块旋转一次
	async spin(clockwise = true) {
		const curr = this.currentTetris;
		let { shape, spinStatus, matrix: tetrisMatrix, position: { x, y } } = curr;
		const [ originX, originY ] = [ x, y ];
		if (shape === TETRIS_SHAPE_ENUM.O) return;
		spinStatus = (spinStatus + (clockwise ? 1 : -1) + 4) % 4;
		// 验证是否可旋转（是否被横向阻挡，正常旋转，或左移一格）
		const replicaMatrix = spinMatrix(TETRIS_SHAPE_MATRIX[shape], spinStatus);
		let willCollide = true;
		for (let times = 1; times <= 4; times++) {
			willCollide = this._checkCollition(replicaMatrix, { x, y });
			if (times === 1) {
				// 第 1 次尝试（原地旋转）
				if (willCollide) {
					// 会产生碰撞，左移 1 格 再试
					x--;
					continue;
				} else {
					// 不会产生碰撞，正常旋转
					curr.setSpinStatus(spinStatus);
					// 推送渲染数据
					this.render();
					break;
				}
			} else if (times === 2) {
				// 第 2 次尝试（旋转后左移 1 格）
				if (willCollide) {
					// 会产生碰撞
					if (shape === TETRIS_SHAPE_ENUM.LINE) {
						// 如果是线型方块，再左移 1 格 再试
						x--;
						continue;
					} else {
						// 如果不是线型方块，跳过第 3 次尝试，回原位并后退一格，进行第 4 次尝试
						times++;
						x = originX;
						y = originY - 1;
						continue;
					}
				} else {
					// 不会产生碰撞，正常旋转
					curr.setSpinStatus(spinStatus);
					curr.setPosition(x, y);
					// 推送渲染数据
					this.render();
					break;
				}
			} else if (times === 3 && shape === TETRIS_SHAPE_ENUM.LINE) {
				// 第 3 次尝试（旋转后左移 2 格）（只针对线型方块）
				if (willCollide) {
					// 会产生碰撞，则不可旋转
					return;
				} else {
					// 不会产生碰撞，正常旋转
					curr.setSpinStatus(spinStatus);
					curr.setPosition(x, y);
					// 推送渲染数据
					this.render();
					break;
				}
			} else if (times === 4) {
				// 第 4 次尝试（回原位并后退一格）
				if (willCollide) {
					// 会产生碰撞，直接 Game Over
					this.gameover = true;
					// 推送渲染数据
					this.render();
					return;
				} else {
					// 不会产生碰撞，则按目前的旋转状态和位置开始尝试消除和石化流程
					curr.setSpinStatus(spinStatus);
					curr.setPosition(x, y);
					// 尝试查找和消除俄罗斯方块，然后将当前俄罗斯方块石化到容器矩阵模型中
					await this._eliminateAndPetrify();
					// 初始化下一个俄罗斯方块
					this.next();
					break;
				}
			}
		}
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
	// 尝试查找和消除俄罗斯方块，然后将当前俄罗斯方块石化到容器矩阵模型中
	async _eliminateAndPetrify() {
		const lineIndexList = this.lineIndexListToEliminate = [];
		const curr = this.currentTetris;
		const { matrix: tetrisMatrix, position: { x, y } } = curr;
		const containerMatrix = this.matrix;
		// 当前俄罗斯方块矩阵模型的行数
		const yLen = tetrisMatrix.length;
		// 当前俄罗斯方块矩阵模型的列数
		const xLen = tetrisMatrix[0].length;
		for (let i = 0; i < yLen && y + i >= 0; i++) {
			const currentLine = cloneModel(containerMatrix[y + i]);
			for (let j = 0; j < xLen; j++) {
				currentLine[x + j] |= tetrisMatrix[i][j];
			}
			// 判断是否当前行是否可消除
			const isFullLine = currentLine.every((n) => n);
			if (isFullLine) lineIndexList.push(y + i);
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
				containerMatrix[y + i][x + j] |= tetrisMatrix[i][j];
			}
		}
		if (!lineIndexList.length) return;
		// 移除可消除的层
		lineIndexList.forEach((i) => {
			containerMatrix.splice(i, 1);
			containerMatrix.unshift(new Array(xLen).fill(0));
		});
	}
	// 推送渲染数据
	render() {
		const data = {
			width: this.width,
			height: this.height,
			readyHeight: this.readyHeight,
			matrix: cloneModel(this.matrix),
			currentTetris: this.currentTetris,
			nextTetris: this.nextTetris,
			level: this.level,
			maxSpeed: this.maxSpeed,
			rapid: this.rapid,
			gameover: this.gameover,
			lineIndexListToEliminate: this.lineIndexListToEliminate,
			durationToEliminate: this.durationToEliminate,
		};
		this.renderCallback(data);
	}
}

// 
// petrified 石化的
// eliminable 可消除的
// grid 格子
// spin 旋转
// falling rapidly 极速下落
// frozen 冻结状态