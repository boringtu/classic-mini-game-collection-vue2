import { TETRIS_SHAPE_ENUM, TETRIS_SPIN_STATUS_ENUM } from '../../libs/consts';

// 俄罗斯方块形状列表（用于统计列表）
export const STATS_CONFIG_LIST = [
	{
		shape: TETRIS_SHAPE_ENUM.T,
		spinStatus: TETRIS_SPIN_STATUS_ENUM.SPIN_0,
	},
	{
		shape: TETRIS_SHAPE_ENUM.J,
		spinStatus: TETRIS_SPIN_STATUS_ENUM.SPIN_90,
	},
	{
		shape: TETRIS_SHAPE_ENUM.L,
		spinStatus: TETRIS_SPIN_STATUS_ENUM.SPIN_90,
	},
	{
		shape: TETRIS_SHAPE_ENUM.O,
		spinStatus: TETRIS_SPIN_STATUS_ENUM.SPIN_0,
	},
	{
		shape: TETRIS_SHAPE_ENUM.S,
		spinStatus: TETRIS_SPIN_STATUS_ENUM.SPIN_0,
	},
	{
		shape: TETRIS_SHAPE_ENUM.Z,
		spinStatus: TETRIS_SPIN_STATUS_ENUM.SPIN_0,
	},
	{
		shape: TETRIS_SHAPE_ENUM.LINE,
		spinStatus: TETRIS_SPIN_STATUS_ENUM.SPIN_0,
	},
];
