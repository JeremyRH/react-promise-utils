import { useCallback, useLayoutEffect, useRef, useState } from 'react';

function useLatestRef<T>(value: T) {
	const ref = useRef(value);

	useLayoutEffect(() => {
		ref.current = value;
	});

	return ref;
}

export function usePromiseState<T, Args extends any[]>(asyncFn: (...args: Args) => Promise<T>, initialArgs?: Args) {
	const promiseRef = useRef<Promise<T>>();
	// Ref used here to allow updating asyncFn without refreshing the promise.
	const asyncFnRef = useLatestRef(asyncFn);
	const [promise, setPromise] = useState(() => {
		const args = (initialArgs || []) as Args;
		promiseRef.current = asyncFn.apply(undefined, args);
		return promiseRef.current;
	});
	const refreshPromsie = useCallback((...args: Args) => {
		promiseRef.current = asyncFnRef.current.apply(undefined, args);
		setPromise(promiseRef.current);
		return promiseRef.current;
	}, []);
	const isCurrent = useCallback((p: Promise<T>) => p === promiseRef.current, []);

	return [promise, refreshPromsie, isCurrent] as const;
}
