import { lazy } from "react";
import React from 'react'
const DoctorEnd_Initial_ = lazy(() => import('./DoctorEnd_Initial'))
const VerticalIndex = lazy(() => import('./verticalIndex'))
import { IDoctorEnd_InitialProps } from './DoctorEnd_Initial'
import { use_provoke } from "@lm_fe/provoke";
export function DoctorEnd_Initial(props: IDoctorEnd_InitialProps) {
  const { 医生端_首检病历垂直风格 } = use_provoke(s => s.config)
  if (医生端_首检病历垂直风格)
    return <VerticalIndex  {...props} />

  return <DoctorEnd_Initial_  {...props} />
}