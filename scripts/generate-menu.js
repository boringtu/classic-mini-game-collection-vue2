/* 自动生成 @/views/menu/config.json */
const fs = require("fs");
const path = require("path");
const os = require("os");

const args = require("minimist")(process.argv.slice(2));

if (args.w || args.watch) {
	const chokidar = require("chokidar");

	const files2Watching = './src/views/games/*/config.js';

	// 监听指定目录下的文件变动
	const watcher = chokidar.watch(files2Watching, { persistent: true });
	watcher.on("change", (path) => {
		console.log("games config file changed, generating @/views/menu/config.json...");
		fn(path.replace(/\\/g, '/'));
	});
}

fn();

function fn(modifiedFilePath) {
	if (modifiedFilePath) {
		delete require.cache[require.resolve("../" + modifiedFilePath)];
	}
	const cwd = process.cwd().replace(/\\/g, '/');
	const dirname = __dirname.replace(/\\/g, '/');

	const directory = "src/views/games";
	const configName = "config.js";

	const list = [];

	const currPath = path.join(cwd, `${ directory }/`).replace(/\\/g, '/');
	const dirs = fs.readdirSync(currPath);
	dirs.forEach((dir) => {
		const filePath = path.join(currPath, dir).replace(/\\/g, '/');
		const stats = fs.statSync(filePath);
		if (!stats.isDirectory()) return;
		const configPath = path.join(filePath, configName).replace(/\\/g, '/');
		if (!fs.existsSync(configPath)) return;
		const config = {
			...require(configPath),
			path: '/games/' + dir,
		};
		list.push(config);
	});

	// 根据每个游戏的权重（weight）排序
	list.sort((a, b) => a.weight - b.weight);

	const data = JSON.stringify(list, null, '\t');
	fs.writeFileSync(path.join(dirname, "../src/views/menu/config.json").replace(/\\/g, '/'), data);
	console.log("The file @/views/menu/config.json is generated.");
};
