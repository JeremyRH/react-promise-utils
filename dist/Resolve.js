import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
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
import { useLayoutEffect, useRef } from 'react';
import { PromiseStatus } from './getPromiseDetails';
import { usePromiseDetails } from './usePromiseDetails';
var displayNoneStyle = { display: 'none' };
export default function Resolve(_a) {
    var promise = _a.promise, render = _a.render, fallback = _a.fallback;
    var _b = usePromiseDetails(promise), promiseStatus = _b[0], resolvedValue = _b[1];
    var siblingElRef = useRef(null);
    var fulfilledRenderRef = useRef(null);
    var lastRender;
    useLayoutEffect(function () {
        var _a;
        // Store the last fulfilled render to be used if the promise is refreshed.
        if (promiseStatus === PromiseStatus.FULFILLED) {
            fulfilledRenderRef.current = lastRender;
        }
        // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
        var parentEl = (_a = siblingElRef.current) === null || _a === void 0 ? void 0 : _a.parentElement;
        if (parentEl) {
            if (promiseStatus === PromiseStatus.PENDING) {
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
    if (promiseStatus === PromiseStatus.REJECTED) {
        throw resolvedValue;
    }
    if (promiseStatus === PromiseStatus.PENDING) {
        // Show the fallback or last fulfilled result.
        lastRender = fallback ? fallback(fulfilledRenderRef.current) : fulfilledRenderRef.current;
    }
    else {
        lastRender = render(resolvedValue);
    }
    return (_jsxs(_Fragment, { children: [lastRender, _jsx("div", { ref: siblingElRef, style: displayNoneStyle }, void 0)] }, void 0));
}
