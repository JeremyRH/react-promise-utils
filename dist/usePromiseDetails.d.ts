import { PromiseStatus } from './getPromiseDetails';
export declare function usePromiseDetails<T>(promise: Promise<T>): readonly [PromiseStatus.PENDING, undefined] | readonly [PromiseStatus.REJECTED, Error] | readonly [PromiseStatus.FULFILLED, T];
