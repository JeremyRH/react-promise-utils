import { useEffect, useReducer } from 'react';
import { getPromiseDetails, PromiseStatus } from './getPromiseDetails';

export function usePromiseDetails<T>(promise: Promise<T>) {
	const [, forceRender] = useReducer((n: number) => n + 1, 0);
	const details = getPromiseDetails(promise);

	useEffect(() => {
		let isStale = false;

		// Force a rerender after promise settles.
		if (details[0] === PromiseStatus.PENDING) {
			promise.finally(() => {
				// Don't update if new promise was passed in or component unmounted.
				if (!isStale) {
					forceRender();
				}
			});
		}

		return () => {
			isStale = true;
		};
	}, [promise]);

	return details;
}
