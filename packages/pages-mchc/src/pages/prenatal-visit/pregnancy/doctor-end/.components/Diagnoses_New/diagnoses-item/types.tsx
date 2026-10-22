
import { IMchc_Doctor_Diagnoses, IMchc_Doctor_OutpatientHeaderInfo } from '@lm_fe/service';

export interface IDiagnosesItem_Props {
  edit?: boolean;
  operate?: boolean;
  index: number;
  diagnose: IMchc_Doctor_Diagnoses;
  do_del_diagnose_item?: (item: IMchc_Doctor_Diagnoses,) => Promise<void>
  diagnosesList: IMchc_Doctor_Diagnoses[]
  setDiagnosesList(l: IMchc_Doctor_Diagnoses[]): void
  isShowDiagnosesTemplate: boolean
}
