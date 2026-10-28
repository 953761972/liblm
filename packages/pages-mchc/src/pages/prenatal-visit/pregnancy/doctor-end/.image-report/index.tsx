import React from "react";
import { lazy } from "react";
import { IDoctorEnd_ImageReport_Props } from './types'
export * from './types'
const Inner = lazy(() => import('./Inner'))
export function DoctorEnd_ImageReport(props: IDoctorEnd_ImageReport_Props) {
  return <Inner {...props} />
}
