import { IMchc_TableConfig, TIdTypeCompatible } from "@lm_fe/service";
import { MutableRefObject } from "react";

export interface ICaseReport {
  id?: any
  modType?: 1 | 2 | 3 | 4
}
export interface ICaseTpl { name: string, code: string }
export interface IRenderContentProps {
  config?: IMchc_TableConfig
  activeItem: IDataItem
  activeItemCache: MutableRefObject<IDataItem | undefined>
}

export type IDataItem = Partial<{
  "id": number | null,
  "code": string,
  "name": string,
  "state": number,
  "filler": "超级管理员",
  "fillerTitle": null,
  "filledDate": "2026-09-07",
  "admissionId": number,
  "pregnancyId": number,
  "neonateOrder": 1
  modType: 1 | 2 | 3 | 4
}>
export type IDetailItem = Partial<{
  "id": 70,
  "code": "IC_HBV_REGISTER",
  "name": "乙肝感染孕产妇及所生新生儿个案登记卡（保密）",
  "state": 1,
  "filler": "超级管理员",
  "auditor": null,
  "fillerTitle": null,
  "filledDate": "2026-11-04",
  "neonateOrder": 1,
  "patientNo": null,
  "admissionId": null,
  "pregnancyId": null,
  "adIcBirthDefect": null,
  "adIcChildDeath": null,
  "adIcMaternalDeath": null,
  "icHbvRegister": {
    "id": 62,
    "name": null,
    "idNO": null,
    "dob": null,
    "age": null,
    "ethnic": null,
    "lmp": null,
    "education": null,
    "occupation": null,
    "gravidity": null,
    "parity": null,
    "childrenNum": null,
    "maritalStatus": null,
    "telephone": null,
    "residenceAddress": null,
    "permanentResidenceAddress": null,
    "hbvDna": null,
    "useMedicine": null,
    "useMedicineNote": null,
    "medicine": null,
    "medicineNote": null,
    "labourDate": null,
    "labourWeek": null,
    "labourType": null,
    "labourPlace": null,
    "labourPlaceNote": null,
    "labourOrganization": null,
    "neonateName": null,
    "neonateGender": null,
    "neonateWeight": null,
    "neonateHeight": null,
    "neonateDob": null,
    "neonateDeath": null,
    "neonateDeathNote": null,
    "neonateDeathTime": null,
    "firstHbv": null,
    "firstHbvNote": null,
    "firstHbvDate": null,
    "firstHbvType": null,
    "firstHbvDosage": null,
    "firstHbvDosageNote": null,
    "hbig": null,
    "hbigNote": null,
    "hbigDate": null,
    "hbigDosage": null,
    "hbigDosageNote": null,
    "icHbvExams": [],
    "reportOrganization": null,
    "reportDoctor": null,
    "reportTelephone": null,
    "reportDate": null,
    "reportNote": null
  },
  "icHbvFollow": null,
  "icHivChild": null,
  "icHivPatient": null,
  "icSyphilisChild": null,
  "icSyphilisPatient": null
}>