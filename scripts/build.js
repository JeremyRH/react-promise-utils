const fs = require('fs');
const path = require('path');
const { exec } = require('./exec');

const distDir = path.resolve(__dirname, '../dist');
const packageJson = path.resolve(__dirname, '../package.json');
const readme = path.resolve(__dirname, '../README.md');
const tsconfig = path.resolve(__dirname, '../tsconfig.json');

fs.promises
	.rmdir(distDir, { recursive: true })
	.then(() => exec(`tsc --project ${tsconfig}`))
	.then(() =>
		Promise.all([
			fs.promises.copyFile(packageJson, path.join(distDir, 'package.json')),
			fs.promises.copyFile(readme, path.join(distDir, 'README.md'))
		])
	);
