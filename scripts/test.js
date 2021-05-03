const fs = require('fs');
const path = require('path');
const { exec } = require('./exec');

const distDir = path.resolve(__dirname, '../tests/dist');
const tsconfig = path.resolve(__dirname, '../tests/tsconfig.json');

fs.promises
	.rmdir(distDir, { recursive: true })
	.then(() => {
		return exec(`tsc --project ${tsconfig}`);
	})
	.then(() => {
		fs.promises.readdir(distDir).then((filenames) => {
			for (const filename of filenames) {
				if (filename.endsWith('.test.js')) {
					require(path.join(distDir, filename));
				}
			}
		});
	});
