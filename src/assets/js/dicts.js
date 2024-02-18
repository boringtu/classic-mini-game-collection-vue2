// 模拟手柄布局按键枚举
export const KEY_ENUM = {
	'RESET': 27, // esc
	'W': 87, // w
	'S': 83, // s
	'A': 65, // a
	'D': 68, // d
	'UP': 38, // up
	'DOWN': 40, // down
	'LEFT': 37, // left
	'RIGHT': 39, // right
	'SELECT': 71, // g
	'START': 72, // h
	'B': 74, // j
	'A': 75, // k
	'TURBO_B': 85, // u
	'TURBO_A': 73, // i
};
// 手柄按键名称字典
export const KEY_DICT = {
	[KEY_ENUM.RESET]: 'RESET',
	[KEY_ENUM.W]: 'UP',
	[KEY_ENUM.S]: 'DOWN',
	[KEY_ENUM.A]: 'LEFT',
	[KEY_ENUM.D]: 'RIGHT',
	[KEY_ENUM.UP]: 'UP',
	[KEY_ENUM.DOWN]: 'DOWN',
	[KEY_ENUM.LEFT]: 'LEFT',
	[KEY_ENUM.RIGHT]: 'RIGHT',
	[KEY_ENUM.SELECT]: 'SELECT',
	[KEY_ENUM.START]: 'START',
	[KEY_ENUM.B]: 'B',
	[KEY_ENUM.A]: 'A',
	[KEY_ENUM.TURBO_B]: 'TURBO B',
	[KEY_ENUM.TURBO_A]: 'TURBO A',
};
