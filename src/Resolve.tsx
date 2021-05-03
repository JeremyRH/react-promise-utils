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

type ReactElement = React.ReactElement<any, any> | null;

const displayNoneStyle = { display: 'none' };

interface ResolveProps<T> {
	promise: Promise<T>;
	render: (data: T) => ReactElement;
	fallback?: (lastChildren: ReactElement) => ReactElement;
}

export default function Resolve<T>({ promise, render, fallback }: ResolveProps<T>): ReactElement {
	const [promiseStatus, resolvedValue] = usePromiseDetails(promise);
	const siblingElRef = useRef<HTMLDivElement>(null);
	const fulfilledRenderRef = useRef<ReactElement>(null);
	let lastRender: ReactElement;

	useLayoutEffect(() => {
		// Store the last fulfilled render to be used if the promise is refreshed.
		if (promiseStatus === PromiseStatus.FULFILLED) {
			fulfilledRenderRef.current = lastRender;
		}

		// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
		const parentEl = siblingElRef.current?.parentElement;
		if (parentEl) {
			if (promiseStatus === PromiseStatus.PENDING) {
				parentEl.setAttribute('aria-busy', 'true');
			}
			if (!parentEl.hasAttribute('aria-live')) {
				parentEl.setAttribute('aria-live', 'polite');
			}
		}

		return () => {
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
	} else {
		lastRender = render(resolvedValue as T);
	}

	return (
		<>
			{lastRender}
			{/* Render a display: none sibling to get a reference to its parent. This is done to keep the original parent. */}
			<div ref={siblingElRef} style={displayNoneStyle} />
		</>
	);
}
