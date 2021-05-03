"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPromiseDetails = exports.PromiseStatus = void 0;
var PromiseStatus;
(function (PromiseStatus) {
    PromiseStatus[PromiseStatus["PENDING"] = 0] = "PENDING";
    PromiseStatus[PromiseStatus["FULFILLED"] = 1] = "FULFILLED";
    PromiseStatus[PromiseStatus["REJECTED"] = 2] = "REJECTED";
})(PromiseStatus = exports.PromiseStatus || (exports.PromiseStatus = {}));
var detailsKey = Symbol();
function getPromiseDetails(promise) {
    var statefulPromise = promise;
    if (statefulPromise.hasOwnProperty(detailsKey)) {
        return statefulPromise[detailsKey];
    }
    statefulPromise[detailsKey] = [PromiseStatus.PENDING, undefined];
    promise.then(function (resolvedValue) {
        statefulPromise[detailsKey] = [PromiseStatus.FULFILLED, resolvedValue];
    }, function (error) {
        statefulPromise[detailsKey] = [PromiseStatus.REJECTED, error];
    });
    return statefulPromise[detailsKey];
}
exports.getPromiseDetails = getPromiseDetails;
