export enum PromiseStatus {
	PENDING,
	FULFILLED,
	REJECTED
}

type PromiseDetails<T> =
	| readonly [PromiseStatus.PENDING, undefined]
	| readonly [PromiseStatus.FULFILLED, T]
	| readonly [PromiseStatus.REJECTED, Error];

const detailsKey = Symbol();

export function getPromiseDetails<T>(promise: Promise<T>): PromiseDetails<T> {
	const statefulPromise = promise as Promise<T> & { [detailsKey]: PromiseDetails<T> };

	if (statefulPromise.hasOwnProperty(detailsKey)) {
		return statefulPromise[detailsKey];
	}

	statefulPromise[detailsKey] = [PromiseStatus.PENDING, undefined];

	promise.then(
		(resolvedValue) => {
			statefulPromise[detailsKey] = [PromiseStatus.FULFILLED, resolvedValue];
		},
		(error: Error) => {
			statefulPromise[detailsKey] = [PromiseStatus.REJECTED, error];
		}
	);

	return statefulPromise[detailsKey];
}
