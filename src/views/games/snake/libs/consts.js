// 标识位枚举
export const DIGIT_TYPE_ENUM = {
	// 空闲
	EMPTY: 0, // 00000000
	// 蛇头
	HEAD: 1, // 00000001
	// 蛇身
	BODY: 2, // 00000010
	// 普通食物
	FOOD: 4, // 00000100
	// 高分食物
	HIGH: 8, // 00001000
};

// 贪吃蛇侧边类型枚举
export const SIDE_TYPE_ENUM = {
	LEFT: 'left',
	RIGHT: 'right',
}
