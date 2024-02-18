import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '@/views/menu';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'home',
		component: HomeView,
	},
	{
		path: '/games',
		children: [
			{
				path: 'tetris',
				component: () => import('@/views/games/tetris'),
			},
		],
	},
	// {
	// 	path: '/games',
	// 	name: 'about',
	// 	// route level code-splitting
	// 	// this generates a separate chunk (about.[hash].js) for this route
	// 	// which is lazy-loaded when the route is visited.
	// 	component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
	// },
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
});

export default router;
