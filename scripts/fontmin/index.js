const path = require('path');
const fs = require('fs');
const Fontmin = require('fontmin');
const { fs_readdir, fs_stat } = require('./utils');

const srcPath = path.join(__dirname, '../src');
const fontsrcPath = path.join(__dirname, 'fonts/*.ttf'); // 字体源文件路径
const fontDestPath = path.join(__dirname, '../static/fonts'); // 字体输出路径
let text = '';
let textMap = {};

// 生成全部所需文字
const genAllText = async () => {
	genBasicText();
	await crawlText();
};

// 生成基本字符
const genBasicText = () => {
	for (let ascII = 32; ascII <= 126; ascII++) {
		text += String.fromCharCode(ascII);
	}
};

// 爬取所需文字
const crawlText = async () => {
	// 遍历所有文件
	const iterateOverFiles = async (filePath = srcPath) => {
		const [err, files] = await fs_readdir(filePath);
		if (err) return console.error(err);
		for (const filename of files) {
			const filedir = path.join(filePath, filename);
			const [err, stats] = await fs_stat(filedir);
			if (err) return console.error(err);
			switch (true) {
				case stats.isFile(): {
					cralFileText(filedir);
					break;
				}
				case stats.isDirectory(): {
					await iterateOverFiles(filedir);
					break;
				}
			}
		}
	};
	// 爬取当前文件所需文字
	const cralFileText = (filedir) => {
		let data;
		if (/(((?<!\.d)\.ts)|(\.js))$/.test(filedir)) {
			const temp = fs.readFileSync(filedir).toString();
			// 过滤注释内容
			data = temp.replace(
				/("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g,
				(str) => /^(\/{2,}|\/\*)/.test(str) ? '' : str,
			);
		} else if (/\.vue$/.test(filedir)) {
			const temp = fs.readFileSync(filedir).toString();
			// 只取 template 标签内的内容
			data = temp.match(/<template.*>(.*)<\/template>/is)[1];
		}
		if (!data) return;
		// 匹配所有 非单字节字符以及空白字符
		data = data.match(/[^\x00-\xff\s]/g);
		// // 匹配所有中文字符
		// data = data.match(/[\u4e00-\u9fa5]/g);
		if (!data) return;
		[...data].forEach((char) => {
			if (textMap[char]) return;
			textMap[char] = 1;
			text += char;
		});
	};
	await iterateOverFiles();
};


const main = async () => {
	await genAllText();

	// 初始化
	const fontmin = new Fontmin()
		.src(fontsrcPath)			   // 输入配置
		.use(Fontmin.glyph({ text })) // 字型提取插件
		.dest(fontDestPath);			// 输出配置

	// 执行
	fontmin.run((err, files, stream) => {
		if (err) return console.error(err);
		console.log('字体压缩完成');
		console.log('包含文字: ', text);
		console.log('文件输出目录：', fontDestPath);
	});
};

main();
