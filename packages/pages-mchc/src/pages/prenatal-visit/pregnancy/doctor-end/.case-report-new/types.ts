import { TIdTypeCompatible } from "@lm_fe/service";

export interface ICaseReport {
  id?: TIdTypeCompatible
  caseType?: 'pregnancyId' | 'admissionId'
}
export interface ICaseTpl { title: string, code: string }
export type IDataItem = Partial<{
  "id": number | null,
  "code": string,
  "name": string,
  "state": 1,
  "filler": "超级管理员",
  "fillerTitle": null,
  "filledDate": "2026-09-07",
  "admissionId": null,
  "neonateOrder": 1
}>