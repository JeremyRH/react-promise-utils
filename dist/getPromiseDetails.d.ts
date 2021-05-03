export declare enum PromiseStatus {
    PENDING = 0,
    FULFILLED = 1,
    REJECTED = 2
}
declare type PromiseDetails<T> = readonly [PromiseStatus.PENDING, undefined] | readonly [PromiseStatus.FULFILLED, T] | readonly [PromiseStatus.REJECTED, Error];
export declare function getPromiseDetails<T>(promise: Promise<T>): PromiseDetails<T>;
export {};
