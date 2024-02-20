<template lang="pug">
.container-root
	.grid-box
</template>

<script>
export default {
	props: {
		gameData: Object,
	},
	data() {
		return {
			containerMatrix: [[]],
		};
	},
	watch: {
		gameData(gameData, oldData) {
			if (!oldData || JSON.stringify(gameData.matrix) !== JSON.stringify(oldData.matrix)) {
				this.containerMatrix = gameData.matrix;
			}
		},
	},
	computed: {
		readyMatrix() {
			const { gameData } = this;
			if (!gameData) return [[]];
			const { width, readyHeight } = gameData;
			const readyMatrix = new Array(readyHeight);
			for (let i = 0; i < readyHeight; i++) {
				readyMatrix[i] = new Array(width).fill(0);
			}
			return readyMatrix;
		},
	},
}
</script>

<style lang="sass" scoped>
.container-root
	.grid-box
		width: 500px
		height: 1100px
</style>
