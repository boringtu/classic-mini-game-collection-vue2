<template lang="pug">
#app
	router-view
</template>

<script>
import { KEY_ENUM } from '@/assets/js/dicts';

export default {
	mounted() {
		window.addEventListener('keydown', this.handleKeydown);
		window.addEventListener('keyup', this.handleKeyup);
	},
	beforeDestroy() {
		window.removeEventListener('keydown', this.handleKeydown);
		window.removeEventListener('keyup', this.handleKeyup);
	},
	methods: {
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
		handleKeyup(event) {
		},
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
