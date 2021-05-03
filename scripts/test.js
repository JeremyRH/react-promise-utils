const fs = require('fs');
const path = require('path');
const { exec } = require('./exec');
const packageJson = require('../package.json');

const rootDir = path.resolve(__dirname, '..');
const testDistDir = path.join(rootDir, 'tests/dist');
const tsconfig = path.join(rootDir, 'tests/tsconfig.json');
const builtPackageSymlinkDir = path.join(rootDir, `node_modules/${packageJson.name}`);

(async () => {
	await Promise.all([
		fs.promises.rmdir(testDistDir, { recursive: true }),
		// Create a symlink to the built files in node_modules to emulate real usage of this lib.
		await fs.promises.symlink(path.join(rootDir, 'dist'), builtPackageSymlinkDir, 'dir').catch(() => {})
	]);

	// Build the test files.
	await exec(`tsc --project ${tsconfig}`);

	// Run the built test files.
	return fs.promises.readdir(testDistDir).then((filenames) => {
		for (const filename of filenames) {
			if (filename.endsWith('.test.js')) {
				require(path.join(testDistDir, filename));
			}
		}
	});
})();
