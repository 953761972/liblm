import { IMchc_Doctor_Diagnoses, IMchc_Doctor_OutpatientHeaderInfo, TIdTypeCompatible } from '@lm_fe/service';
export interface IDiagnosesTemplate {
    diagnosesList: IMchc_Doctor_Diagnoses[]
    filter_diagnoses_list: IMchc_Doctor_Diagnoses[]
    add_diag_inner(v: any): void,
    headerInfo: IMchc_Doctor_OutpatientHeaderInfo
    closeTemplate(): void
    pv_id_for_diagnose: TIdTypeCompatible
    isShowDiagnosesTemplate: boolean
    del_diagnose_item_inner?: (item: IMchc_Doctor_Diagnoses) => Promise<void>

    setDiagnosesList(v: IMchc_Doctor_Diagnoses[]): void
}
