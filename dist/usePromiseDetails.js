import { useEffect, useReducer } from 'react';
import { getPromiseDetails, PromiseStatus } from './getPromiseDetails';
export function usePromiseDetails(promise) {
    var _a = useReducer(function (n) { return n + 1; }, 0), forceRender = _a[1];
    var details = getPromiseDetails(promise);
    useEffect(function () {
        var isStale = false;
        // Force a rerender after promise settles.
        if (details[0] === PromiseStatus.PENDING) {
            promise.finally(function () {
                // Don't update if new promise was passed in or component unmounted.
                if (!isStale) {
                    forceRender();
                }
            });
        }
        return function () {
            isStale = true;
        };
    }, [promise]);
    return details;
}
