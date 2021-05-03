/// <reference types="react" />
declare type ReactElement = React.ReactElement<any, any> | null;
interface ResolveProps<T> {
    promise: Promise<T>;
    render: (data: T) => ReactElement;
    fallback?: (lastChildren: ReactElement) => ReactElement;
}
export default function Resolve<T>({ promise, render, fallback }: ResolveProps<T>): ReactElement;
export {};
