# react-promise-utils
Minimalist utils for handling loading states and async values in React.

## Quick Example
```sh
npm install react-promise-utils
```

```tsx
import Resolve from 'react-promise-utils/Resolve';

function MyComponent() {
  const [itemsPromise, setItemsPromise] = useState(() => fetchItems());

  <Resolve promise={itemsPromise} render={(items) => (
    <ItemsList items={items} />
  )} />
}
```

## \<Resolve> Component
A wrapper component abstacting common data fetching patterns.
- Preserves last rendered elements while new data is fetched.
- Prevents slow responses from clobbering new ones.
- Tries to help with [ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions).

Props:
```ts
interface ResolveProps<T> {
  // Any promise.
  promise: Promise<T>;

  // Callback with single parameter: the resolved value of the promise.
  render: (data: T) => ReactElement;

  // Optional. Callback with single parameter:
  // last rendered React element from `props.render` or `null` if nothing was rendered yet.
  fallback?: (lastChildren: ReactElement) => ReactElement;
}
```

Example:
```tsx
import Resolve from 'react-promise-utils/Resolve';

function MyComponent() {
  const [itemsPromise, setItemsPromise] = useState(() => fetchItems());

  <Resolve
    promise={itemsPromise}
    fallback={(lastChildren) => (
      <SpinnerOverlay>{lastChildren}</SpinnerOverlay>
    )}
    render={(items) => (
      <ItemsList items={items} />
    )}
  />
}
```

Notes:
- `render` and `fallback` should be regular functions, not React elements or components.

## usePromiseDetails
A React hook to inspect the state of a promise (pending, fulfilled, rejected).

Example:
```tsx
import { PromiseStatus } from 'react-promise-utils/getPromiseDetails';
import { usePromiseDetails } from 'react-promise-utils/usePromiseDetails';

function MyComponent() {
  const [itemsPromise, setItemsPromise] = useState(() => fetchItems());
  const [itemsPromiseStatus, itemsOrError] = usePromiseDetails(itemsPromise);

  if (itemsPromiseStatus === PromiseStatus.PENDING) {
    return <Spinner />;
  }

  if (itemsPromiseStatus === PromiseStatus.REJECTED) {
    return <Error error={itemsOrError} />;
  }

  // PromiseStatus.FULFILLED
  return <ItemsList items={itemsOrError} />;
}
```

Notes:
- A promise will always be PENDING the first time it's inspected, even if it has already settled. The status will be updated in the next iteration of the event loop.
- When a promise state is PENDING, the 2nd item in the tuple is undefined: `[PromiseStatus.PENDING, undefined]`.

## getPromiseDetails
A function to read the state of a promise.

Example:
```tsx
import { getPromiseDetails, PromiseStatus } from 'react-promise-utils/getPromiseDetails';

const itemsPromise = fetchItems();

// Useless example, don't copy this.
const intervalId = window.setInterval(() => {
  const [itemsPromiseStatus, items] = getPromiseDetails(itemsPromise);

  if (itemsPromiseStatus === PromiseStatus.REJECTED) {
    window.clearInterval(intervalId);
  }

  if (itemsPromiseStatus === PromiseStatus.FULFILLED) {
    window.clearInterval(intervalId);
    console.log(items);
  }
}, 200);
```

Notes:
- Does not use React.
- A promise will always be PENDING the first time it's inspected, even if it has already settled. The status will be updated in the next iteration of the event loop.
- When a promise state is PENDING, the 2nd item in the tuple is undefined: `[PromiseStatus.PENDING, undefined]`.
