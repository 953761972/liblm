import React, { lazy } from "react";
import { ICaseReport } from "./types";

const Inner = lazy(() => import('./Inner'))
export function DoctorEnd_CaseReport(props: ICaseReport) {
  return <Inner {...props} />
}