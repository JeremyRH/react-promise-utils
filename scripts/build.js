const fs = require('fs');
const path = require('path');
const { exec } = require('./exec');

const distDir = path.resolve(__dirname, '../dist');
const packageJson = path.resolve(__dirname, '../package.json');
const tsconfig = path.resolve(__dirname, '../tsconfig.json');

fs.promises
	.rmdir(distDir, { recursive: true })
	.then(() => exec(`tsc --project ${tsconfig}`))
	.then(() => fs.promises.copyFile(packageJson, path.join(distDir, 'package.json')));
