<template lang="pug">
#app
	router-view
	Loading(v-if="loading")
</template>

<script>
import Vue from 'vue';
import Loading from '@/components/Loading';
import { KEY_ENUM } from '@/assets/js/dicts';

export default {
	components: {
		Loading,
	},
	data() {
		return {
			// loading 动画状态
			loading: false,
		};
	},
	provide() {
		return {
			// 开始 loading（除本组件与 Loading 组件外，其它组件只允许调用此方法开始 Loading）
			startLoading: this.startLoading,
			// 设置 loading 状态（只允许在本组件与 Loading 组件内使用）
			setLoading: (v) => this.loading = v,
			// 获取 loading 状态
			getLoading: () => this.loading,
		};
	},
	created() {
		// 将 App 实例挂载到 Vue.prototype 上，以便其他地方可以直接访问 App 实例
		Vue.prototype.$app = this;
	},
	mounted() {
		window.addEventListener('keydown', this.handleKeydown);
		// window.addEventListener('keyup', this.handleKeyup);
	},
	beforeDestroy() {
		window.removeEventListener('keydown', this.handleKeydown);
		// window.removeEventListener('keyup', this.handleKeyup);
	},
	methods: {
		// 开始 loading（除本组件与 Loading 组件外，其它组件只允许调用此方法开始 Loading）
		startLoading() {
			this.loading = true;
		},
		handleKeydown(event) {
			console.log(event.keyCode);
			switch (event.keyCode) {
				// 按 RESET 回到游戏菜单页面
				case KEY_ENUM.RESET: {
					this.$router.push('/');
					break;
				}
			}
		},
		// handleKeyup(event) {
		// },
	},
};
</script>

<style lang="scss">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

nav {
	padding: 30px;

	a {
		font-weight: bold;
		color: #2c3e50;

		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
</style>
