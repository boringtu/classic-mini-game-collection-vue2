import _ from 'lodash';
import { Food, Snake } from './Basic';
import { cloneModel } from '@/libs/utils';
import { coordinateComparison, getRandomEmptyPosition } from './utils';
import { DIGIT_TYPE_ENUM, SIDE_TYPE_ENUM } from './consts';
import { KEY_ENUM } from '@/assets/js/dicts';

/**
 * 贪吃蛇游戏类（单例）
 */
export default class Game {
	// 容器的宽度（格数）
	width = 10;
	// 容器的高度（格数）
	height = 20;
	// 综合矩阵模型（左上角为坐标原点）
	matrix = null;
	// 蛇的实例
	snake = null;
	// 待增长的长度
	size2grow = 0;
	// 食物池
	foods = null;
	// 刷新高分食物剩余次数
	refreshCount = 10;
	// 得分
	score = 0;
	// 初始速度
	initSpeed = 500;
	// 是否已 Game Over
	gameover = false;
	// 是否已暂停
	paused = false;

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
		this.stopMoving();
		this.matrix = null;
		this.snake = null;
		this.foods = null;
		Game.instance = null;
	}
	// 当前游戏等级
	get level() {
		return Math.ceil(this.snake.data.toArray().length / 10);
	}
	// 蛇的移动速度
	get speed() {
		return this.initSpeed * 0.9 ** (this.level - 1);
	}
	// 蛇的长度
	get size() {
		const { snake } = this;
		return snake ? snake.size : 0;
	}
	// 高分食物过期时间（3 ~ 5 秒随机）
	get expirationTime() {
		return 3000 + Math.random() * 2000;
	}
	// 计算和设置综合矩阵模型
	calcMatrix() {
		const { width, height, foods, snake } = this;
		// 初始化容器矩阵模型
		const matrix = new Array(height);
		for (let i = 0; i < height; i++) {
			matrix[i] = new Array(width).fill(0);
		}
		// 追加食物数据
		foods.forEach((food) => {
			const { position: { x, y }, isHigh } = food;
			matrix[y][x] = isHigh ? DIGIT_TYPE_ENUM.HIGH : DIGIT_TYPE_ENUM.FOOD;
		});
		// 追加蛇的数据
		snake.data.toArray().forEach(([ x, y ], i) => {
			matrix[y][x] = i ? DIGIT_TYPE_ENUM.BODY : DIGIT_TYPE_ENUM.HEAD;
		});

		this.matrix = matrix;
	}
	// 重置游戏
	restart() {
		const { width, height } = this;
		// 重置待增长的长度
		this.size2grow = 0;
		// 重置食物池
		this.foods = [];
		// 重置刷新高分食物剩余次数
		this.refreshCount = 10;
		// 重置 Game Over 状态
		this.gameover = false;
		// 重置暂停状态
		this.paused = false;
		// 重置得分
		this.score = 0;
		// 实例化蛇的对象
		this.snake = new Snake({ width, height });
		// 计算和设置综合矩阵模型
		this.calcMatrix();
		// 刷新普通食物
		this.refreshFood();
		// 推送渲染数据
		this.render();
		// 开始游戏
		this.startMoving();
	}
	// 开始移动
	startMoving() {
		// 停止前一个定时器
		this.stopMoving();
		// 开始移动定时器
		this._handleMoving = setTimeout(() => this.moveOneStep(), this.speed);
	}
	// 停止下落
	stopMoving() {
		// 停止当前的下落定时器
		clearTimeout(this._handleMoving);
	}
	/**
	 * 蛇移动一格
	 * @param {Array} [pos] 蛇向左或向右移动一格的位置 可选 默认则前进一格
	 */
	moveOneStep(pos) {
		// 判断游戏是否已暂停，或已 Game Over
		if (this.paused || this.gameover) return;
		const { width, height, matrix, snake } = this;
		if (!pos) {
			// 蛇前进一格的位置
			pos = snake.getForwardPosition();
		}
		// 移动一格的坐标
		const [ x, y ] = pos;
		// 验证蛇移动一格是否会撞墙
		if (x < 0 || x >= width || y < 0 || y >= height) {
			// 产生碰撞，停止移动
			this.stopMoving();
			// 将游戏设置为已 Game Over
			this.gameover = true;
			// 推送渲染数据
			this.render();
			// 继续移动
			this.startMoving();
			return;
		}
		// 获取此格的数据
		const value = matrix[y][x];
		// 验证蛇移动一格是否会撞到自身
		if (value & DIGIT_TYPE_ENUM.BODY && !coordinateComparison(snake.data.tail.element, pos)) {
			// 产生碰撞，停止移动
			this.stopMoving();
			// 将游戏设置为已 Game Over
			this.gameover = true;
			// 推送渲染数据
			this.render();
			// 继续移动
			this.startMoving();
			return;
		}
		// 验证蛇移动一格是否是食物
		if (value & DIGIT_TYPE_ENUM.FOOD || value & DIGIT_TYPE_ENUM.HIGH) {
			// debugger;
			// 是否是高分食物
			const isHigh = value & DIGIT_TYPE_ENUM.HIGH;
			// 计算蛇需要增加的长度
			this.size2grow = isHigh ? 2 : 1;
			// 移除食物
			_.remove(this.foods, ({ position: { x: xf, y: yf } }) => xf === x && yf === y);
			if (isHigh) {
				// 高分食物，得 50 分
				this.score += 50;
				// 重新计次刷新高分食物
				this.refreshCount = 10;
				// 停止高分食物过期定时器
				clearTimeout(this._handleExpirationTimeout);
			} else {
				// 普通食物，得 10 分
				this.score += 10;
				// 刷新普通食物
				this.refreshFood();
			}
		}
		// 蛇移动一格
		this.snake.move([x, y], this.size2grow-- > 0);
		// 判断是否需要刷新高分食物
		if (--this.refreshCount === 0) {
			this.refreshHighFood();
		}
		// 推送渲染数据
		this.render();
		// 继续移动
		this.startMoving();
	}
	/**
	 * 蛇转弯（只能向相对于蛇的左边或右边转弯）
	 * @param {KEY_ENUM} key - 方向
	 */
	turn(key) {
		// 判断游戏是否已暂停，或已 Game Over
		if (this.paused || this.gameover) return;
		const { snake } = this;
		const headNode = snake.data.head;
		const secondNode = headNode.next;
		// 蛇头的位置
		const [ x0, y0 ] = headNode.element;
		// 第二节蛇身的位置
		const [ x1, y1 ] = secondNode.element;
		let side;
		switch (key) {
			// 按 UP 向上转弯
			case KEY_ENUM.W:
			case KEY_ENUM.UP: {
				if (x0 - x1 < 0) {
					// 蛇当前前进方向为 水平向左
					side = SIDE_TYPE_ENUM.RIGHT;
				} else if (x0 - x1 > 0) {
					// 蛇当前前进方向为 水平向右
					side = SIDE_TYPE_ENUM.LEFT;
				}
				break;
			}
			// 按 DOWN 向下转弯
			case KEY_ENUM.S:
			case KEY_ENUM.DOWN: {
				if (x0 - x1 < 0) {
					// 蛇当前前进方向为 水平向左
					side = SIDE_TYPE_ENUM.LEFT;
				} else if (x0 - x1 > 0) {
					// 蛇当前前进方向为 水平向右
					side = SIDE_TYPE_ENUM.RIGHT;
				}
				break;
			}
			// 按 LEFT 向左转弯
			case KEY_ENUM.A:
			case KEY_ENUM.LEFT: {
				if (y0 - y1 < 0) {
					// 蛇当前前进方向为 垂直向上
					side = SIDE_TYPE_ENUM.LEFT;
				} else if (y0 - y1 > 0) {
					// 蛇当前前进方向为 垂直向下
					side = SIDE_TYPE_ENUM.RIGHT;
				}
				break;
			}
			// 按 RIGHT 向右转弯
			case KEY_ENUM.D:
			case KEY_ENUM.RIGHT: {
				if (y0 - y1 < 0) {
					// 蛇当前前进方向为 垂直向上
					side = SIDE_TYPE_ENUM.RIGHT;
				} else if (y0 - y1 > 0) {
					// 蛇当前前进方向为 垂直向下
					side = SIDE_TYPE_ENUM.LEFT;
				}
				break;
			}
		}
		if (!side) return;
		// 移动一格的坐标
		const pos = snake.getPositionToTurn(side);
		// 蛇移动一格
		this.moveOneStep(pos);
		// 继续移动
		this.startMoving();
	}
	// 刷新普通食物
	refreshFood() {
		// 随机获取的空闲位置
		const [ x, y ] = getRandomEmptyPosition(this.matrix);
		// 实例化食物对象
		const food = new Food({ x, y });
		// 向食物池中添加随机位置的食物
		this.foods.push(food);
	}
	// 刷新高分食物
	refreshHighFood() {
		// 随机获取的空闲位置
		const [ x, y ] = getRandomEmptyPosition(this.matrix);
		// 实例化食物对象
		const food = new Food({ x, y, high: true });
		// 向食物池中添加随机位置的高分食物
		this.foods.push(food);
		// 开始高分食物过期定时器
		this._handleExpirationTimeout = setTimeout(() => {
			// 从食物池中移除高分食物
			_.remove(this.foods, ({ isHigh }) => isHigh);
			// 重新计次刷新高分食物
			this.refreshCount = 10;
			// 推送渲染数据
			this.render();
		}, this.expirationTime);
	}
	/**
	 * 暂停游戏
	 */
	pause() {
		// 如果已经 Game Over，则重新开始游戏
		if (this.gameover) return this.restart();
		// 如果当前是已暂停状态，则恢复游戏
		if (this.paused) {
			// 设置暂停状态为正常游戏状态
			this.paused = false;
			// 继续移动
			this.startMoving();
		} else {
			// 设置暂停状态为暂停游戏状态
			this.paused = true;
			// 停止下落
			this.stopMoving();
		}
		// 推送渲染数据
		this.render();
	}
	// 推送渲染数据
	render() {
		// 计算和设置综合矩阵模型
		this.calcMatrix();
		// 推送渲染数据
		const data = {
			width: this.width,
			height: this.height,
			matrix: cloneModel(this.matrix),
			score: this.score,
			level: this.level,
			size: this.snake.data.size(),
			gameover: this.gameover,
			paused: this.paused,
			snake: this.snake,
			foods: this.foods,
		};
		this.renderCallback(data);
	}
}
