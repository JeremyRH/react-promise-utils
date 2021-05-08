"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePromiseState = void 0;
var react_1 = require("react");
function useLatestRef(value) {
    var ref = react_1.useRef(value);
    react_1.useLayoutEffect(function () {
        ref.current = value;
    });
    return ref;
}
function usePromiseState(asyncFn, initialArgs) {
    var promiseRef = react_1.useRef();
    // Ref used here to allow updating asyncFn without refreshing the promise.
    var asyncFnRef = useLatestRef(asyncFn);
    var _a = react_1.useState(function () {
        var args = (initialArgs || []);
        promiseRef.current = asyncFn.apply(undefined, args);
        return promiseRef.current;
    }), promise = _a[0], setPromise = _a[1];
    var refreshPromsie = react_1.useCallback(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        promiseRef.current = asyncFnRef.current.apply(undefined, args);
        setPromise(promiseRef.current);
        return promiseRef.current;
    }, []);
    var isCurrent = react_1.useCallback(function (p) { return p === promiseRef.current; }, []);
    return [promise, refreshPromsie, isCurrent];
}
exports.usePromiseState = usePromiseState;
