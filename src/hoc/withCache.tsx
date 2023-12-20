/* eslint-disable */

import React from 'react';

type ComponentType<P = {}> = React.ComponentType<P>;

// Define a new type for the additional cache prop
type WithCacheProps<P> = P & {
  cache?: string | null;
};

export function withCache<T extends ComponentType<any>>(WrappedComponent: T) {
  const cache = localStorage.getItem('mate-test');

  const ComponentWithCache: React.FC<WithCacheProps<React.ComponentProps<T>>> = (props) => {
    // @ts-ignore
    return <WrappedComponent {...props} cache={cache} />;
  };

  return ComponentWithCache;
}
