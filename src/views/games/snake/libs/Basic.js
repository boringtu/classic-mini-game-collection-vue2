
// 约定：
// 蛇头的标记为二进制码倒数第 1 位为 1
// 蛇身的标记为二进制码倒数第 2 位为 1
// 普通食物的标记为二进制码倒数第 3 位为 1
// 高分食物的标记为二进制码倒数第 4 位为 1

import _ from 'lodash';
import { cloneModel } from '@/libs/utils';
import { DoublyLinkedList } from '@/libs/LinkedList';
import { coordinateComparison } from './utils';
import { SIDE_TYPE_ENUM } from './consts';

/**
 * 贪吃蛇的原型类（单例）
 */
export class Snake {
	// 蛇的数据模型（双向链表结构，包含在容器矩阵模型中的位置等信息）
	_data = null;
	/**
	 * 构造函数
	 * @param {number} width - 容器宽度
	 * @param {number} height - 容器高度
	 */
	constructor({ width, height }) {
		// 初始化蛇的数据模型（蛇的初始化位置在容器矩阵模型中，水平方向居中，垂直方向下方 1 / 3 处，蛇长 3 格，蛇身垂直向下）
		const arr = [];
		for (let i = 0; i < 3; i++) {
			arr.push([
				Math.floor(width / 2 - 1),
				Math.floor(height / 3 * 2 + i - 1),
			]);
		}
		this._data = DoublyLinkedList.converts(arr, coordinateComparison);
	}
	get size() {
		const data = this._data;
		return data ? data.size() : 0;
	}
	get data() {
		return this._data;
	}
	/**
	 * 计算得出蛇前进一格的位置
	 * @return {array} 蛇前进一格的位置
	 */
	getForwardPosition() {
		const headNode = this._data.head;
		const secondNode = headNode.next;
		// 蛇头的位置
		const [ x0, y0 ] = headNode.element;
		// 第二节蛇身的位置
		const [ x1, y1 ] = secondNode.element;
		// 计算得出蛇前进一格的位置
		return [
			x0 + (x0 - x1),
			y0 + (y0 - y1),
		];
	}
	/**
	 * 计算得出蛇向左转或向右转移动一格的位置
	 * @param {SIDE_TYPE_ENUM} side - 蛇转弯的侧边类型
	 * @return {array} 蛇向左或向右移动一格的位置
	 */
	getPositionToTurn(side) {
		const toLeft = side === SIDE_TYPE_ENUM.LEFT;
		const headNode = this._data.head;
		const secondNode = headNode.next;
		// 蛇头的位置
		const [ x0, y0 ] = headNode.element;
		// 第二节蛇身的位置
		const [ x1, y1 ] = secondNode.element;
		// 计算得出蛇向左转或向右转移动一格的位置
		switch (true) {
			// 蛇当前前进方向为 水平向左
			case x0 - x1 < 0:
				return [ x0, y0 + (toLeft ? 1 : -1) ];
			// 蛇当前前进方向为 水平向右
			case x0 - x1 > 0:
				return [ x0, y0 + (toLeft ? -1 : 1) ];
			// 蛇当前前进方向为 垂直向上
			case y0 - y1 < 0:
				return [ x0 + (toLeft ? -1 : 1), y0 ];
			// 蛇当前前进方向为 垂直向下
			case y0 - y1 > 0:
				return [ x0 + (toLeft ? 1 : -1), y0 ];
			default:
				return null;
		}
	}
	/**
	 * 移动一格
	 * @param {array} position 移动一格的坐标
	 * @param {boolean} growing 是否长大一格
	 */
	move(position, growing = false) {
		const copyData = _.cloneDeep(this._data);
		// 插到链表的最前面
		copyData.insert(cloneModel(position), 0);
		// 去掉链表最后一个元素
		growing || copyData.removeAt(copyData.size() - 1);
		// 将新链表赋值为蛇的数据模型
		this._data = copyData;
	}
}

/**
 * 食物的原型类
 */
export class Food {
	// 横坐标
	_x = -1;
	// 纵坐标
	_y = -1;
	// 是否是高分食物
	_high = false;
	// 构造函数
	constructor({ x, y, high = false }) {
		this._x = x;
		this._y = y;
		this._high = high;
	}
	get position() {
		return { x: this._x, y: this._y };
	}
	get isHigh() {
		return this._high;
	}
}
