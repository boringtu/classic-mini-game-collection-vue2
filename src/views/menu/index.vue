<template lang="pug">
.root
	h1
		span.num {{ list.length }}
		span IN
		span.num 1
	h2
		span PUSH
		span.key UP
		span.key DOWN
		span.key SEL
		span.key START
		span KEY
	ul
		li(
			v-for="item, i in list"
			:key="i"
		)
			Icon.arrow(v-if="activeIndex === i" name="arrow-right")
			span {{ formatGameName(item.name, i) }}
			span.cname {{ item.cname }}
</template>

<script>
import Icon from '@/components/Icon';
import { KEY_ENUM } from '@/assets/js/dicts';

export default {
    components: {
		Icon,
	},
    data() {
        return {
            list: require('./config.json'),
            activeIndex: 0,
        };
    },
	mounted() {
		window.addEventListener('keydown', this.handleKeydown);
		window.addEventListener('keyup', this.handleKeyup);
	},
	beforeDestroy() {
		window.removeEventListener('keydown', this.handleKeydown);
		window.removeEventListener('keyup', this.handleKeyup);
	},
    methods: {
		// 格式化游戏名称
        formatGameName(name, index) {
            let num = index + 1;
            num = num > 9 ? num : '0' + num;
            return `${num}.${name.toLocaleUpperCase()}`;
        },
		handleKeydown(event) {
			console.log(event.keyCode);
			switch (event.keyCode) {
				// 按 UP 切换到上一个游戏选项
				case KEY_ENUM.W:
				case KEY_ENUM.UP: {
					let i = this.activeIndex - 1;
					if (i < 0) i = this.list.length - 1;
					this.activeIndex = i;
					break;
				}
				// 按 SELECT 或 DOWN 切换到下一个游戏选项
				case KEY_ENUM.SELECT:
				case KEY_ENUM.S:
				case KEY_ENUM.DOWN: {
					let i = this.activeIndex + 1;
					if (i >= this.list.length) i = 0;
					this.activeIndex = i;
					break;
				}
				// 按 START 开始选中的游戏
				case KEY_ENUM.START: {
					const item = this.list[this.activeIndex];
					this.$router.push(item.path);
				}
			}
		},
		handleKeyup(event) {
		},
    },
};
</script>

<style lang="sass" scoped>
.root
	// filter: invert(1) hue-rotate(180deg)
	background-color: #000
	position: fixed
	top: 0
	right: 0
	bottom: 0
	left: 0
	display: flex
	flex-direction: column
	align-items: center
	padding-top: 20px
	font-family: "8bit-cn"
	font-size: 20px
	h1
		margin-top: 36px
		span
			color: #f2a43a
			+ span
				margin-left: 12px
			&.num
				color: #fff
	h2
		margin-top: 36px
		span
			color: #86bed9
			+ span
				margin-left: 16px
			&.key
				color: #eb974c
	ul
		margin-top: 36px
		width: 500px
		li
			position: relative
			color: #91df5b
			text-align: left
			padding-left: 36px
			+ li
				margin-top: 12px
			.arrow
				position: absolute
				top: 50%
				transform: translateY(-50%)
				left: 0
				font-size: 20px
			span
				vertical-align: middle
				&.cname
					font-family: "8bit"
					margin-left: 12px
					color: #333
</style>
