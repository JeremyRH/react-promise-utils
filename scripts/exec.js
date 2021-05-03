const { spawn } = require('child_process');

const last5Chunks = [];
let chunkIndex = 0;

function onExit(childProcess) {
	return new Promise((resolve, reject) => {
		// One failure could spread to all childProcess's stderr.
		// Store the last 5 chunks and ignore repeats.
		childProcess.stderr.on('data', (chunk) => {
			const chunkString = chunk.toString();
			if (!last5Chunks.includes(chunkString)) {
				process.stderr.write(chunk);
			}
			last5Chunks[chunkIndex] = chunkString;
			chunkIndex = (chunkIndex + 1) % 5;
		});
		childProcess.once('exit', (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject('');
			}
		});
		childProcess.once('error', reject);
	});
}

exports.exec = function (command) {
	return onExit(spawn(command, [], { stdio: ['inherit', 'inherit', 'pipe'], shell: true }));
};
