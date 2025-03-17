import { useAsyncFn, useMount } from "react-use";
import { FunctionReturningPromise } from "react-use/lib/misc/types";
import { DependencyList } from "react";

export function useAsyncWithRefresh<T extends FunctionReturningPromise>(
  fn: T,
  deps?: DependencyList,
) {
  const [{ loading, value, error }, refresh] = useAsyncFn(fn, deps);

  useMount(refresh);

  return {
    loading,
    value,
    error,
    refresh,
  };
}
