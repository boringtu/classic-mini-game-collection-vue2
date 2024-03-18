const fs = require('fs');

module.exports.fs_readdir = (filePath) => {
	return new Promise((resolve) => {
		fs.readdir(filePath, (err, files) => {
			if (err) return reject([err]);
			resolve([null, files]);
		});
	});
};

module.exports.fs_stat = (filedir) => {
	return new Promise((resolve) => {
		fs.stat(filedir, (err, stats) => {
			if (err) return reject([err]);
			resolve([null, stats]);
		});
	});
};
