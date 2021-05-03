const fs = require('fs');
const path = require('path');
const { exec } = require('./exec');
const packageJson = require('../package.json');

const rootDir = path.resolve(__dirname, '..');
const testDistDir = path.join(rootDir, 'tests/dist');
const tsconfig = path.join(rootDir, 'tests/tsconfig.json');
const testNodeModulesDir = path.join(rootDir, 'tests/node_modules');

(async () => {
	await Promise.all([
		fs.promises.rmdir(testDistDir, { recursive: true }),
		fs.promises.rmdir(testNodeModulesDir, { recursive: true })
	]);
	await fs.promises.mkdir(testNodeModulesDir, { recursive: true });
	await Promise.all([
		exec(`tsc --project ${tsconfig}`),
		fs.promises.symlink(path.join(rootDir, 'dist'), path.join(testNodeModulesDir, packageJson.name), 'dir')
	]);
	return fs.promises.readdir(testDistDir).then((filenames) => {
		for (const filename of filenames) {
			if (filename.endsWith('.test.js')) {
				require(path.join(testDistDir, filename));
			}
		}
	});
})();
