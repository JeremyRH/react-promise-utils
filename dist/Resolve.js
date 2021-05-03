"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
/*
Component that accepts a promise and render callback to be called when the promise is fulfilled.
Accepts an optional fallback.

Basic usage:

const [itemsP, setItemsP] = useState(() => fetchItems());
<Resolve promise={itemsP} render={(items) => (
    <ItemsList items={items} />
)} />


With fallback:

const [itemsP, setItemsP] = useState(() => fetchItems());
<Resolve
    promise={itemsP}
    fallback={(lastChildren) => (
        <SpinnerOverlay>{lastChildren}</SpinnerOverlay>
    )}
    render={(items) => (
        <ItemsList items={items} />
    )}
/>
*/
var react_1 = require("react");
var getPromiseDetails_1 = require("./getPromiseDetails");
var usePromiseDetails_1 = require("./usePromiseDetails");
var displayNoneStyle = { display: 'none' };
function Resolve(_a) {
    var promise = _a.promise, render = _a.render, fallback = _a.fallback;
    var _b = usePromiseDetails_1.usePromiseDetails(promise), promiseStatus = _b[0], resolvedValue = _b[1];
    var siblingElRef = react_1.useRef(null);
    var fulfilledRenderRef = react_1.useRef(null);
    var lastRender;
    react_1.useLayoutEffect(function () {
        var _a;
        // Store the last fulfilled render to be used if the promise is refreshed.
        if (promiseStatus === getPromiseDetails_1.PromiseStatus.FULFILLED) {
            fulfilledRenderRef.current = lastRender;
        }
        // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
        var parentEl = (_a = siblingElRef.current) === null || _a === void 0 ? void 0 : _a.parentElement;
        if (parentEl) {
            if (promiseStatus === getPromiseDetails_1.PromiseStatus.PENDING) {
                parentEl.setAttribute('aria-busy', 'true');
            }
            if (!parentEl.hasAttribute('aria-live')) {
                parentEl.setAttribute('aria-live', 'polite');
            }
        }
        return function () {
            if (parentEl) {
                parentEl.setAttribute('aria-busy', 'false');
            }
        };
    }, [promiseStatus]);
    // Let error boundaries handle errors.
    if (promiseStatus === getPromiseDetails_1.PromiseStatus.REJECTED) {
        throw resolvedValue;
    }
    if (promiseStatus === getPromiseDetails_1.PromiseStatus.PENDING) {
        // Show the fallback or last fulfilled result.
        lastRender = fallback ? fallback(fulfilledRenderRef.current) : fulfilledRenderRef.current;
    }
    else {
        lastRender = render(resolvedValue);
    }
    return (jsx_runtime_1.jsxs(jsx_runtime_1.Fragment, { children: [lastRender, jsx_runtime_1.jsx("div", { ref: siblingElRef, style: displayNoneStyle }, void 0)] }, void 0));
}
exports.default = Resolve;
