import { mchcEnv } from "@lm_fe/env";
import { IMchc_FormDescriptions_Field } from "@lm_fe/service";

export function 体格检查_config(): IMchc_FormDescriptions_Field[] {
    return [
        {
            "moduleName": "cervical-carcinoma-screening",
            "name": "体格检查",
            "flag": "妇女保健-宫颈癌筛查-体格检查",
            "sort": 0,
            "fields": [
                { key: 'womenHealthcarePhysicalExamination.id', form_hidden: true },
                {
                    "key": "womenHealthcarePhysicalExamination.weight",
                    "label": "体重(kg)",
                    "inputType": "input_number",
                    "rules": [{ "required": true, "message": "体重(kg)是必填项" }],
                    layout: "1/3",
                }, {
                    "key": "womenHealthcarePhysicalExamination.height",
                    "label": "身高(cm)",
                    "inputType": "input_number",
                    "rules": [{ "required": true, "message": "身高(cm)是必填项" }],
                    layout: "1/3",
                }, {
                    "key": "womenHealthcarePhysicalExamination.bmi",
                    "label": "BMI",
                    "inputType": "input_with_range",
                    "rules": [{ "required": true, "message": "BMI是必填项" }],
                    "specialConfig": { "tip": "BMI的正常范围值是18.5~24.9kg/㎡", "min": 18.5, "max": 24.9 },
                    "inputProps": { "placeholder": "请输入BMI", "disabled": true },
                    layout: "1/3",
                }, {
                    "key": "womenHealthcarePhysicalExamination.MyPressure__",
                    "label": "血压(mmHg)",
                    "inputType": "MyPressure",
                    "rules": [{ "required": true, "message": "血压(mmHg)是必填项" }],
                    layout: "1/3",

                }, {
                    "key": "womenHealthcarePhysicalExamination.heartRate",
                    "label": "心率(次/分钟)",
                    "inputType": "input_number",
                    "rules": [{ "required": true, "message": "心率(次/分钟)是必填项" }],
                    layout: "1/3",

                }]
        },
    ]
}