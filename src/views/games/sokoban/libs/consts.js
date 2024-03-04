// 持久化存储当前关卡数
export const STORATE_LEVEL_KEY = 'sokoban_level';

// 标识位枚举
export const DIGIT_TYPE_ENUM = {
	EMPTY: 0, // 00000000 空闲
	FLOOR: 1, // 00000001 地板
	WALL: 2, // 00000010 墙
	BOX: 4, // 00000100 箱子
	POINT: 8, // 00001000 目标位置
	WORKER: 16, // 00010000 人
};
