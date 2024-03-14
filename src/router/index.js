import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '@/views/menu';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		component: HomeView,
	},
	{
		path: '/games/tetris',
		component: () => import('@/views/games/tetris'),
	},
	{
		path: '/games/snake',
		component: () => import('@/views/games/snake'),
	},
	{
		path: '/games/sokoban',
		component: () => import('@/views/games/sokoban'),
	},
];

const router = new VueRouter({
	mode: 'hash',
	base: process.env.BASE_URL,
	routes,
});

export default router;
