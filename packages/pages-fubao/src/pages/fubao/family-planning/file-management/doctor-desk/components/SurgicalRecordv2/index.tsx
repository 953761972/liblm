import React, { lazy } from 'react';

const Inner = lazy(() => import('./Inner'))
export default function (props: any) {
  return <Inner {...props} />
}