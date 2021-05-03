import { strict as assert } from 'assert';
import { create } from 'react-test-renderer';
import { PromiseStatus } from 'react-promise-utils/getPromiseDetails';
import { usePromiseDetails } from 'react-promise-utils/usePromiseDetails';

assert.equal(typeof usePromiseDetails, 'function');

function ComponentUsingHook({ promise }: { promise: Promise<any> }) {
	const details = usePromiseDetails(promise);
	return <pre>{JSON.stringify(details)}</pre>;
}

async function assertPromiseRendered(promise: Promise<unknown>, expected: ReturnType<typeof usePromiseDetails>) {
	const renderer = create(<ComponentUsingHook promise={promise} />);

	assert.deepEqual(renderer.toJSON(), {
		type: 'pre',
		props: {},
		children: [JSON.stringify([PromiseStatus.PENDING, undefined])]
	});

	await new Promise((resolve) => setTimeout(resolve, 1));

	assert.deepEqual(renderer.toJSON(), {
		type: 'pre',
		props: {},
		children: [JSON.stringify(expected)]
	});
}

// Fulfilled.
assertPromiseRendered(Promise.resolve(1), [PromiseStatus.FULFILLED, 1]);

// Rejected.
(() => {
	const error = new Error('usePromiseDetails rejected promise test');
	assertPromiseRendered(Promise.reject(error), [PromiseStatus.REJECTED, error]);
})();

// Update promise before it settles.
(async () => {
	const slowPromise = new Promise((resolve) => setTimeout(resolve, 1, 'slow'));
	const fastPromise = Promise.resolve('fast');

	// Slow promise should resolve last.
	let resolvedLast;
	slowPromise.then((v) => resolvedLast = v);
	fastPromise.then((v) => resolvedLast = v);

	// Use slow promise first.
	const renderer = create(<ComponentUsingHook promise={slowPromise} />);

	// Update with fast promise.
	renderer.update(<ComponentUsingHook promise={fastPromise} />);

	// Wait for all to settle.
	await new Promise((resolve) => setTimeout(resolve, 2));

	// Assert slow promise was settled last.
	assert.equal(resolvedLast, 'slow');

	// Assert fast promise is used in component.
	assert.deepEqual(renderer.toJSON(), {
		type: 'pre',
		props: {},
		children: [JSON.stringify([PromiseStatus.FULFILLED, 'fast'])]
	});
})();
