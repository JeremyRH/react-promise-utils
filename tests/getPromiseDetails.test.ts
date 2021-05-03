import { strict as assert } from 'assert';
import { getPromiseDetails, PromiseStatus } from 'react-promise-utils/getPromiseDetails';

assert.equal(typeof getPromiseDetails, 'function');

// Fulfilled promise.
(async () => {
	const willFulfill = Promise.resolve(1);
	assert.deepEqual(getPromiseDetails(willFulfill), [PromiseStatus.PENDING, undefined]);
	assert.equal(await willFulfill, 1);
	assert.deepEqual(getPromiseDetails(willFulfill), [PromiseStatus.FULFILLED, 1]);
})();

// Rejected promise.
(async () => {
	const error = new Error('getPromiseDetails rejected promise test');
	const willReject = Promise.reject(error);
	assert.deepEqual(getPromiseDetails(willReject), [PromiseStatus.PENDING, undefined]);

	let rejectedError;
	try {
		await willReject;
	} catch (err) {
		rejectedError = err;
	}
	assert.equal(rejectedError, error);

	assert.deepEqual(getPromiseDetails(willReject), [PromiseStatus.REJECTED, error]);
})();

// Promises not seen before are always pending initially.
(async () => {
	const willFulfill = Promise.resolve(1);
	await willFulfill;
	assert.deepEqual(getPromiseDetails(willFulfill), [PromiseStatus.PENDING, undefined]);
})();
