"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePromiseDetails = void 0;
var react_1 = require("react");
var getPromiseDetails_1 = require("./getPromiseDetails");
function usePromiseDetails(promise) {
    var _a = react_1.useReducer(function (n) { return n + 1; }, 0), forceRender = _a[1];
    var details = getPromiseDetails_1.getPromiseDetails(promise);
    react_1.useEffect(function () {
        var isStale = false;
        function update() {
            // Don't update if new promise was passed in or component unmounted.
            if (!isStale) {
                forceRender();
            }
        }
        // Force a rerender after promise settles.
        if (details[0] === getPromiseDetails_1.PromiseStatus.PENDING) {
            promise.then(update, update);
        }
        return function () {
            isStale = true;
        };
    }, [promise]);
    return details;
}
exports.usePromiseDetails = usePromiseDetails;
