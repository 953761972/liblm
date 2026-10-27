import { mchcEnv } from "@lm_fe/env";
import { IMchc_FormDescriptions_Field } from "@lm_fe/service";
import { formatDate } from "@lm_fe/utils";

export function 诊断及指导_config(): IMchc_FormDescriptions_Field[] {

    return [

        {

            "name": "诊断及指导",

            "sort": 0,
            "fields": [
                { key: 'cervicalCancerDiagnosisAndGuidance.id', form_hidden: true },
                {
                    "key": "cervicalCancerDiagnosisAndGuidance.screeningResults__",
                    "label": "筛查结果",
                    "inputType": "MC",
                    // "inputType": "checkbox_with_single_input",
                    "inputProps": {
                        options: '正常,异常',
                        inputWidth: 256,
                        sp: [{ label: '异常', inputType: 'MA', props: { options: '外生殖器尖锐湿疣,滴虫性阴道炎,外阴阴道假丝酵母菌病,细菌性阴道病,黏液脓性宫颈炎,宫颈息肉,子宫肌瘤' } }]
                    },
                    "rules": [{ "required": true, "message": "筛查结果是必填项" }],
                    // "specialConfig": {
                    //     "type": "single", "options": [{ "value": 1, "label": "正常", "span": 4, "withInput": false }, {
                    //         "value": 2, "label": "异常", "withInput": true, "isIssue": true, "span": 4, "inputSpan": 12, "inputType": "autoComplete",
                    //         "inputOption": [
                    //             { "value": "外生殖器尖锐湿疣" },
                    //             { "value": "滴虫性阴道炎" },
                    //             { "value": "外阴阴道假丝酵母菌病" },
                    //             { "value": "细菌性阴道病" },
                    //             { "value": "黏液脓性宫颈炎" },
                    //             { "value": "宫颈息肉" },
                    //             { "value": "子宫肌瘤" }
                    //         ]
                    //     }]
                    // },
                    layout: '1/1',

                }, {
                    "key": "cervicalCancerDiagnosisAndGuidance.screeningSuggest",
                    "label": "筛查建议",
                    "inputType": "MC",
                    "rules": [{ "required": true, "message": "筛查建议是必填项" }],
                    "inputProps": { marshal: 0, "options": [{ "value": "定期检查", "label": "定期检查", "span": 4 }, { "value": "可疑", "label": "可疑", "span": 4 }, { "value": "活检", "label": "活检", "span": 4 }] },
                    layout: '1/1',

                }, {
                    "key": "cervicalCancerDiagnosisAndGuidance.checkUnit",
                    "label": "检查单位",
                    "inputType": "input",
                    "rules": [{ "required": true, "message": "检查单位是必填项" }],
                    layout: '1/3',

                }, {
                    "key": "cervicalCancerDiagnosisAndGuidance.checkDate",
                    "label": "检查日期",
                    "inputType": "DatePicker",
                    "rules": [{ "required": true, "message": "检查日期是必填项" }],
                    "inputProps": { format: formatDate.format },
                    layout: '1/3',
                }, {
                    "key": "cervicalCancerDiagnosisAndGuidance.checkDoctorName",
                    "label": "检查医生",
                    "inputType": "MA",
                    inputProps: { memorieskey: '妇保-检查医生' },
                    "required": true,
                    layout: '1/3',

                }]
        }]

}
