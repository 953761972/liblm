import { IMchc_Doctor_Diagnoses, IMchc_Doctor_OutpatientHeaderInfo, TIdTypeCompatible } from '@lm_fe/service';
import './index.less';
export interface IDiagnosesprops {

  setDiagnosesList(list: IMchc_Doctor_Diagnoses[]): void,
  headerInfo: IMchc_Doctor_OutpatientHeaderInfo
  diagnosesList: IMchc_Doctor_Diagnoses[]
  // isShowDiagnosesTemplatets: boolean
  isAllPregnancies: boolean
  page: '' | 'return'
  pv_id_for_diagnose?: any
  serialNo: string






  // isAllPregnancies,
  // diagnosesList = [],
  // headerInfo,
  // saveHeaderInfo,
  // setDiagnosesList,
  // changeSyphilis,
  // page,
  // serialNo,

}
