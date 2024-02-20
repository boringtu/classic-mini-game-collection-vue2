// 俄罗斯方块等级颜色列表
export const TETRIS_LEVEL_COLOR_LIST = [
	'#bababa', // Level 0
	'#b55631', // Level 1
	'#a77d29', // Level 2
	'#3141e6', // Level 3
	'#e7a441', // Level 4
	'#e280ef', // Level 5
	'#70bc3d', // Level 6
	'#3a8480', // Level 7
	'#6649ed', // Level 8
	'#67a877', // Level 9
];

// 俄罗斯方块形状枚举
export const TETRIS_SHAPE_ENUM = {
	LINE: 0,
	T: 1,
	S: 2,
	Z: 3,
	L: 4,
	J: 5,
	O: 6,
};

// 俄罗斯方块形状默认颜色枚举
export const TETRIS_SHAPE_COLOR_ENUM = {
	[TETRIS_SHAPE_ENUM.LINE]: TETRIS_LEVEL_COLOR_LIST[1],
	[TETRIS_SHAPE_ENUM.T]: TETRIS_LEVEL_COLOR_LIST[2],
	[TETRIS_SHAPE_ENUM.S]: TETRIS_LEVEL_COLOR_LIST[6],
	[TETRIS_SHAPE_ENUM.Z]: TETRIS_LEVEL_COLOR_LIST[7],
	[TETRIS_SHAPE_ENUM.L]: TETRIS_LEVEL_COLOR_LIST[5],
	[TETRIS_SHAPE_ENUM.J]: TETRIS_LEVEL_COLOR_LIST[4],
	[TETRIS_SHAPE_ENUM.O]: TETRIS_LEVEL_COLOR_LIST[3],
};

// 俄罗斯方块形状矩阵模型字典
export const TETRIS_SHAPE_MATRIX = {
	[TETRIS_SHAPE_ENUM.LINE]: [
		[ 1, 1, 1, 1 ],
	],
	[TETRIS_SHAPE_ENUM.T]: [
		[ 0, 1, 0 ],
		[ 1, 1, 1 ],
	],
	[TETRIS_SHAPE_ENUM.S]: [
		[ 0, 1, 1 ],
		[ 1, 1, 0 ],
	],
	[TETRIS_SHAPE_ENUM.Z]: [
		[ 1, 1, 0 ],
		[ 0, 1, 1 ],
	],
	[TETRIS_SHAPE_ENUM.L]: [
		[ 1, 0 ],
		[ 1, 0 ],
		[ 1, 1 ],
	],
	[TETRIS_SHAPE_ENUM.J]: [
		[ 0, 1 ],
		[ 0, 1 ],
		[ 1, 1 ],
	],
	[TETRIS_SHAPE_ENUM.O]: [
		[ 1, 1 ],
		[ 1, 1 ],
	],
}

// 俄罗斯方块旋转状态枚举（值为顺时针旋转 90° 的次数）
export const TETRIS_SPIN_STATUS_ENUM = {
	SPIN_0: 0,
	SPIN_90: 1,
	SPIN_180: 2,
	SPIN_270: 3,
};

// 消除类型枚举（一次性消除的行数）
export const ELIMINATION_TYPE_ENUM = {
	SINGLE: 1, // 一次性消除 1 行
	DOUBLE: 2, // 一次性消除 2 行
	TRIPLE: 3, // 一次性消除 3 行
	QUADRA: 4, // 一次性消除 4 行
};
export const ELIMINATION_TYPE_DICT = {
	[ELIMINATION_TYPE_ENUM.SINGLE]: 'SINGLE',
	[ELIMINATION_TYPE_ENUM.DOUBLE]: 'DOUBLE',
	[ELIMINATION_TYPE_ENUM.TRIPLE]: 'TRIPLE',
	[ELIMINATION_TYPE_ENUM.QUADRA]: 'QUADRA',
};
