import { IMchc_FormDescriptions_Field } from "@lm_fe/service";


export function 检验检查_config(): IMchc_FormDescriptions_Field[] {
    return [

        {

            "name": "检验检查",


            "fields": [
                { key: 'cervicalCancerInspection.id', form_hidden: true },
                {
                    "key": "cervicalCancerInspection.vaginalCleanliness",
                    "label": "阴道清洁度",
                    "inputType": "MC",
                    "inputProps": { marshal: 0, "options": [{ "value": 1, "label": "Ⅰ°", }, { "value": 2, "label": "Ⅱ°", }, { "value": 3, "label": "Ⅲ°", }, { "value": 4, "label": "Ⅳ°", }, { "value": 5, "label": "未查", }] },
                    layout: '1/1',
                }, {
                    "key": "cervicalCancerInspection.trichomonas",
                    "label": "滴虫",
                    "inputType": "MC",
                    "inputProps": { marshal: 0, "options": [{ "value": 1, "label": "正常", }, { "value": 2, "label": "异常", warning: true }, { "value": 3, "label": "未查", }] },
                    layout: '1/3',
                }, {
                    "key": "cervicalCancerInspection.candida",
                    "label": "假丝酵母菌",
                    "inputType": "MC",
                    "inputProps": { marshal: 0, "options": [{ "value": 1, "label": "正常", }, { "value": 2, "label": "异常", "warning": true }, { "value": 3, "label": "未查", }] },
                    layout: '1/3',

                }, {
                    "key": "cervicalCancerInspection.gardnerella",
                    "label": "加德纳菌",
                    "inputType": "MC",
                    "inputProps": { marshal: 0, "options": [{ "value": 1, "label": "正常", }, { "value": 2, "label": "异常", "warning": true }, { "value": 3, "label": "未查", }] },
                    layout: '1/3',

                }, {
                    "key": "cervicalCancerInspection.clueCell",
                    "label": "线索细胞",
                    "inputType": "MC",
                    "inputProps": { marshal: 0, "options": [{ "value": 1, "label": "正常", }, { "value": 2, "label": "异常", "warning": true }, { "value": 3, "label": "未查", }] },
                    layout: '1/3',

                }, {
                    "key": "cervicalCancerInspection.other",
                    "label": "其他",
                    "inputType": "input",
                    layout: '1/3',

                }, {
                    "key": "cervicalCancerInspection.hpv",
                    "label": "HPV",
                    "inputType": "MC",
                    "rules": [{ "required": true, "message": "HPV是必填项" }],
                    "inputProps": { marshal: 0, "options": [{ "value": 1, "label": "阴性", }, { "value": 2, "label": "阳性", "warning": true }, { "value": 3, "label": "未查", }] },
                    layout: '1/3',

                }, {
                    "key": "cervicalCancerInspection.visualObservationAfterAceticIodineStaining",
                    "label": "醋酸/碘染色后肉眼观察",
                    "inputType": "MC",
                    "rules": [{ "required": true, "message": "醋酸/碘染色后肉眼观察是必填项" }],
                    "inputProps": { marshal: 0, "options": [{ "value": 1, "label": "未见异常", }, { "value": 2, "label": "阳性", "warning": true }, { "value": 3, "label": "未查", }] },
                    layout: '1/1',

                }, {
                    "key": "cervicalCancerInspection.uterineCytology",
                    "label": "宫颈细胞学检查结果",
                    "inputType": "MC",
                    "inputProps": { marshal: 0, "options": [{ "value": 1, "label": "已查", }, { "value": 2, "label": "未查", }] },
                    layout: '1/1',

                }, {
                    "key": "cervicalCancerInspection.uterineCytologyObtainingMaterialsWay",
                    "label": "宫颈细胞取材方式",
                    "inputType": "MC",
                    "inputProps": { marshal: 0, "options": [{ "value": 1, "label": "巴氏涂片", }, { "value": 2, "label": "液基/薄层细胞学检查", }, { "value": 3, "label": "其他", }] },
                    layout: '1/1',

                }, {
                    "key": "cervicalCancerInspection.papClassification",
                    "label": "巴氏分级",
                    "inputType": "MC",
                    "inputProps": { marshal: 0, "options": [{ "value": 1, "label": "Ⅰ级", }, { "value": 2, "label": "ⅡA", }, { "value": 3, "label": "ⅡB", }, { "value": 4, "label": "Ⅲ级", }, { "value": 5, "label": "Ⅳ级", }, { "value": 6, "label": "Ⅴ级", }] },
                    layout: '1/1',

                }, {
                    "key": "cervicalCancerInspection.tbsResult",
                    "label": "TBS分类报告结果",
                    "inputType": "MC",
                    "rules": [{ "required": true, "message": "TBS分类报告结果是必填项" }],
                    "inputProps": { marshal: 0, "options": [{ "value": 1, "label": "未见异常", }, { "value": 2, "label": "异常", "warning": true }] },
                    layout: '1/1',

                }]
        },
    ]
}