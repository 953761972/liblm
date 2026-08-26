import { mchcEnv, otherOptions, rt_ctx } from "@lm_fe/env";
import { conceive_mode_conf, mlUltrasounds_fd, not_yes_input, pressure_fd } from "@lm_fe/pages";
import { defineFormConfig, IMchc_FormDescriptions_Field_Nullable } from '@lm_fe/service';
import { form_config_家族史 } from "../../common";
import { 个人史_pack } from "../../nurse-end/archival-information/form/个人史";
import { 孕产史_config } from "../../nurse-end/archival-information/form/孕产史";
import { 门诊_胎儿_form } from "../../utils";
const ctx = rt_ctx
const React = ctx.React
const 现病史_conf = defineFormConfig(
  [
    {
      key: 'presentHistory.id',
      form_hidden: true,
    },
    {
      key: "presentHistory.pregnancyId",
      form_hidden: true
    },
    {
      key: "presentHistory.prenatalVisitId",
      form_hidden: true
    },
    {
      key: 'presentHistory.sureEddModify',
      inputType: 'MS',
      label: '修改过预产期-B超',
      form_hidden: true,
      inputProps: { options: '否,是', marshal: 0 },
    },
    {
      "key": "presentHistory.lmp",
      "label": "末次月经",
      "inputType": "date",
      layout: '1/6',
      form_hidden: () => ctx.props.less,
      processLocal(lmp, f) {
        if (lmp && f) {
          var values = f.getFieldsValue()
          var sureEddModify = ctx.utils.get(values, 'presentHistory.sureEddModify')
          var conceiveMode = ctx.utils.get(values, 'presentHistory.conceiveMode.value')
          var ntExams = ctx.utils.expect_array<{ checkdate: string, menopause: string }>(values.ntExams)
          var nfExams = ctx.utils.expect_array<{ checkdate: string, menopause: string }>(values.nfExams)
          const calc_edd = ctx.utils.cal_edd_by_lmp(lmp)

          values.presentHistory.edd = calc_edd
          if (conceiveMode !== 1 && !sureEddModify) {
            values.presentHistory.sureEdd = calc_edd
            ctx.utils.safeExec(ctx.props.fuck_sureEdd, calc_edd)
          }
          values.ntExams = ntExams.map(_ => {
            return ctx.utils.set(_, 'menopause', _.checkdate ? ctx.utils.menopauseWeek(_.checkdate, lmp) : '')
          })
          values.nfExams = nfExams.map(_ => {
            return ctx.utils.set(_, 'menopause', _.checkdate ? ctx.utils.menopauseWeek(_.checkdate, lmp) : '')
          })
          f.setFieldsValue(values)
        }
      }
    }, {
      "key": "presentHistory.edd",
      "label": "预产期-日期",
      form_hidden: () => ctx.props.less,
      "inputType": "date",
      layout: '1/6',

    }, {
      "key": "presentHistory.sureEdd",
      "label": "预产期-B超",
      form_hidden: () => ctx.props.less,
      "inputType": "date",
      processLocal(v, f) {
        if (!f) return
        f.setFieldValue('presentHistory.sureEddModify', 1)
        ctx.utils.safeExec(ctx.props.fuck_sureEdd, v)
      },
      required: true,
      layout: '1/6',

    },
    {
      "key": "presentHistory.fetalcount",
      "label": "胎数",
      form_hidden: () => ctx.props.less,
      "inputType": "select",
      "inputProps": { 'marshal': 0, 'options': '1,2,3,4,5,6' },

      layout: '1/6',

    },

    {

      "key": "presentHistory.sac",
      "label": "孕囊",

      "inputType": "input",


      "inputProps": { 'type': 'number', 'unit': '个' },
      layout: '1/6',


    },
    {


      "key": "presentHistory.yolksac",
      "label": "卵黄囊",

      "inputType": "input",


      "inputProps": { 'type': 'number', 'unit': '个' },
      layout: '1/6',


    },
    conceive_mode_conf({
      "key": "presentHistory.conceiveMode",
      form_hidden: () => ctx.props.less,
      processLocal(v, f) {
        ctx.utils.safeExec(ctx.props.fuck_conceive, v)

      }
    }),
    {
      "key": "presentHistory.chiefcomplaint",
      "label": "主诉",
      form_hidden: () => ctx.props.less,

      "inputType": "textareaWithTemplate",
      isNewRow: 1,
      "inputProps": {
        rows: 2,
        "TemplateTextarea_type": [
          {
            "title": "科室",
            "type": 16,
            depid: 2
          },
          {
            "title": "个人",
            "type": 17
          }
        ]
      },
      layout: '1/2',

    }, {
      "key": "presentHistory.presentHistoryNote",
      "label": "现病史",
      form_hidden: () => ctx.props.less,

      "inputType": "textareaWithTemplate",
      "inputProps": {
        rows: 2,
        "TemplateTextarea_type": [
          {
            "title": "科室",
            "type": 8,
            depid: 2
          },
          {
            "title": "个人",
            "type": 9
          }
        ]
      },
      layout: '1/2',

    },
    { inputType: 'title', title: 'NT检查' },
    {
      "key": "presentHistory.ntExams",
      inputType: 'ArrayPanel',
      processRemote(v, f) { return ctx.utils.isEmpty(v) ? [{}] : v },

      inputProps: {
        on_row_value_change(arr, idx, changed, form) {
          if (!form) return
          const values = form.getFieldsValue()
          const presentHistory = ctx.utils.get(values, 'presentHistory')

          var lmp = ctx.utils.get(values, 'presentHistory.lmp')
          var checkdate = ctx.utils.get<string>(changed, 'checkdate')
          if (lmp && checkdate) {
            arr[idx] = ctx.utils.set(arr[idx], 'menopause', ctx.utils.menopauseWeek(checkdate, lmp))
            presentHistory.ntExams = arr
            form.setFieldValue('presentHistory', presentHistory)
          }

        },
        marshal: 0,
        targetLabelCol: 2,
        formDescriptions: [
          { label: '检查日期', name: 'checkdate', inputType: 'DatePicker', props: {}, layout: '1/6' },
          { label: '停经', name: 'menopause', inputType: 'MA', props: { suffix: '周' }, layout: '1/6' },
          { label: 'CRL', name: 'crl', inputType: 'input_number', props: { suffix: 'mm' }, layout: '1/6' },
          {
            label: 'NT', name: 'nt', inputType: 'input_number', props: { suffix: 'mm' },
            layout: '1/6',
            tip: 'NT的正常范围值是0~3mm',
            checkWarn: function (v) { return v > 3; },

          },
          { label: '如孕', name: 'gestationalWeek', inputType: 'MA', props: { suffix: '周' }, layout: '1/6' },

        ]

      },
      layout: '1/1',

    },
    { inputType: 'title', title: 'NF检查' },

    {
      "key": "presentHistory.nfExams",
      inputType: 'ArrayPanel',
      processRemote(v, f) { return ctx.utils.isEmpty(v) ? [{}] : v },
      inputProps: {
        marshal: 0,
        targetLabelCol: 2,
        on_row_value_change(arr, idx, changed, form) {
          if (!form) return
          const values = form.getFieldsValue()
          const presentHistory = ctx.utils.get(values, 'presentHistory')

          var lmp = ctx.utils.get(values, 'presentHistory.lmp')
          var checkdate = ctx.utils.get<string>(changed, 'checkdate')
          if (lmp && checkdate) {
            arr[idx] = ctx.utils.set(arr[idx], 'menopause', ctx.utils.menopauseWeek(checkdate, lmp))
            presentHistory.nfExams = arr
            form.setFieldValue('presentHistory', presentHistory)
          }
        },
        formDescriptions: [
          { label: '检查日期', name: 'checkdate', inputType: 'DatePicker', props: {}, layout: '1/6' },
          { label: '停经', name: 'menopause', inputType: 'MA', props: { suffix: '周' }, layout: '1/6' },
          { label: 'BPD', name: 'bpd', inputType: 'input_number', props: { suffix: 'mm' }, layout: '1/6' },
          {
            label: 'NF', name: 'nf', inputType: 'input_number', props: { suffix: 'mm' }, layout: '1/6',
            tip: 'NF的正常范围值是0~3mm',
            checkWarn: function (v) {
              return v > 3;
            },
          },
          { label: '如孕', name: 'gestationalWeek', inputType: 'MA', props: { suffix: '周' }, layout: '1/6' },

        ]
      },
    },
    mlUltrasounds_fd({}, 'presentHistory.mlUltrasounds')
  ]
)

const 其他病史_conf = defineFormConfig(
  [
    { name: 'id', form_hidden: true },
    {
      "key": "menarche",
      "label": "初潮",

      "inputType": "InputNumber",
      required: true,
      "inputProps": { 'unit': '岁' },
      layout: '1/3',
    }, {
      "key": "menstrualCycle",
      "label": "月经周期",

      "inputType": "InputNumber",
      required: true,
      "inputProps": { 'unit': '天' },
      layout: '1/3',

    }, {
      "key": "menstrualPeriod",
      "label": "月经持续天数",

      "inputType": "InputNumber",
      required: true,
      "inputProps": {},
      layout: '1/3',

    }, {
      "key": "menstrualVolume",
      "label": "经量",
      disabled_check: true,
      "inputType": "MA",
      required: true,
      "inputProps": { 'options': '多,中,少' },
      layout: '1/3',

    },
    {
      "key": "maritalYears",
      "label": "结婚年龄",

      "inputType": "InputNumber",

      "inputProps": {},
      layout: '1/3',
    },
    {
      "key": "maritalStatus",
      "label": "婚姻史",

      "inputType": "MC",
      required: true,
      "inputProps": { 'options': otherOptions['maritalStatusOptions'], marshal: 0 },
      layout: '1/3',

    },
    // {
    //   "key": "dysmenorrhea__",
    //   "label": "痛经",

    //   "inputType": "MC",
    //   required: true,
    //   "inputProps": { options: get_无有option() },
    //   layout: '1/3',

    // },
    not_yes_input('dysmenorrhea', '痛经'),


    {
      "key": "nearRelation",
      "label": "近亲结婚",

      "inputType": "MC",
      required: true,
      "inputProps": { 'options': otherOptions['nyOptions'], marshal: 0 },

      layout: '1/3',

    },
    {
      inputType: 'check_invert_button',
      layout: '1/3',

    },
    {
      label: '个人史',
      children: 个人史_pack(true, true)
    },

    form_config_家族史()
  ]
)


function get_无option2(suffix?: string) {
  const options: ICommonOption[] = [
    { value: 1, label: '无' },
    { value: 2, label: '有', warning: true, suffix },
  ]
  return options
}

function get_正常option2(suffix?: string) {
  const options: ICommonOption[] = [
    { value: 1, label: '正常' },
    { value: 2, label: '其他', warning: true, suffix },
  ]
  return options
}

function get_触及option2(suffix?: string) {
  const options: ICommonOption[] = [
    { value: 1, label: '未触及' },
    { value: 2, label: '触及', warning: true, suffix },
  ]
  return options
}
const 体格检查_conf = defineFormConfig(
  [
    { name: 'id', form_hidden: true },

    {
      "label": "基本体检",
      children: [
        // {
        //   "key": "physicalBaseExam.MyPressure1__",
        //   "label": "血压-首测",
        //   "inputType": "MyPressure",
        //   "inputProps": { 'unit': 'mmHg', marshal: 2 },
        //   layout: '1/3',

        // },

        // {
        //   "key": "physicalBaseExam.MyPressure2__",
        //   "label": "血压-二测",
        //   "inputType": "MyPressure",
        //   "inputProps": { 'unit': 'mmHg', marshal: 2 },
        //   layout: '1/3',

        // }, {
        //   "key": "physicalBaseExam.MyPressure3__",
        //   "label": "血压-三测",
        //   "inputType": "MyPressure",
        //   "inputProps": { 'unit': 'mmHg', marshal: 2 },
        //   layout: '1/3',

        // },

        pressure_fd(
          { label: '血压首测', isNewRow: true, layout: '1/3', },
          { name: 'physicalBaseExam.systolic', },
          { name: 'physicalBaseExam.diastolic', }
        ),
        pressure_fd(
          { label: '血压二测', layout: '1/3', },
          { name: 'physicalBaseExam.systolic2', },
          { name: 'physicalBaseExam.diastolic2', }
        ),
        pressure_fd(
          { label: '血压三测', layout: '1/3', },
          { name: 'physicalBaseExam.systolic3', },
          { name: 'physicalBaseExam.diastolic3', }
        ),


        {
          "key": "physicalBaseExam.pulse",
          "label": "脉搏",
          "inputType": "InputNumber",
          required: true,
          "inputProps": { 'unit': '次/分' },
          layout: '1/3',

        },
        {
          "key": "physicalBaseExam.preheight",
          "label": "身高",
          "inputType": "InputNumber",
          required: true,
          "inputProps": { 'unit': 'cm' },
          processLocal: function (v, form) {
            if (form) {
              const values = form.getFieldsValue();
              const weight = ctx.utils.get<number>(values, 'physicalBaseExam.weight');
              const preweight = ctx.utils.get<number>(values, 'physicalBaseExam.preweight');

              form.setFieldsValue({
                physicalBaseExam: {
                  bmi: ctx.utils.calc_bmi(weight, v),
                  preBmi: ctx.utils.calc_bmi(preweight, v),

                }
              })
            }
          },
          layout: '1/3',

        }, {
          "key": "physicalBaseExam.weight",
          "label": "现体重",
          "inputType": "InputNumber",
          "inputProps": { 'unit': 'kg' },
          layout: '1/3',
          processLocal: function (v, form) {
            if (form) {
              const values = form.getFieldsValue();
              const height = ctx.utils.get<number>(values, 'physicalBaseExam.preheight');

              form.setFieldsValue({
                physicalBaseExam: {
                  bmi: ctx.utils.calc_bmi(v, height),
                }
              })
            }
          },
        },

        {
          "key": "physicalBaseExam.bmi",
          "label": "BMI",
          "inputType": "input",
          "inputProps": { 'unit': 'kg/㎡', 'disabled': true },
          layout: '1/3',
        },

        {
          "key": "physicalBaseExam.preweight",
          "label": "孕前体重",
          "inputType": "InputNumber",
          required: true,
          "inputProps": { 'unit': 'kg' },
          layout: '1/3',
          processLocal: function (v, form) {
            if (form) {
              const values = form.getFieldsValue();
              const height = ctx.utils.get<number>(values, 'physicalBaseExam.preheight');

              form.setFieldsValue({
                physicalBaseExam: {
                  preBmi: ctx.utils.calc_bmi(v, height),
                }
              })
            }
          },

        },
        {
          "key": "physicalBaseExam.preBmi",
          "label": "孕前BMI",
          "inputType": "input",
          "inputProps": { 'unit': 'kg/㎡', 'disabled': true },
          layout: '1/3',
        },
      ]
    },
    {
      "label": "内科检查",
      children: [
        {
          "key": "physicalgeneralExam.heartrate",
          "label": "心率",
          "inputType": "InputNumber",
          "inputProps": { 'unit': '次/分' },
          layout: '1/3'
        },
        not_yes_input('physicalgeneralExam.skin', '皮肤黏膜', { inputProps: { options: get_正常option2() } }, {}, 2),
        not_yes_input('physicalgeneralExam.thyroid', '甲状腺', { inputProps: { options: get_正常option2() } }, {}, 2),
        not_yes_input('physicalgeneralExam.breast', '乳房乳腺', { inputProps: { options: get_正常option2() } }, {}, 2),
        not_yes_input('physicalgeneralExam.respiratory', '呼吸音', { inputProps: { options: get_正常option2() } }, {}, 2),
        not_yes_input('physicalgeneralExam.rales', '呼吸音', { inputProps: { options: get_无option2() } }, {}, 2),
        not_yes_input('physicalgeneralExam.heartrhythm', '心律', {
          inputProps: {
            options: [
              { value: 1, label: '齐' },
              { value: 2, label: '不齐', warning: true, },
            ]
          }
        }, {}, 2),


        not_yes_input('physicalgeneralExam.murmurs', '杂音', { inputProps: { options: get_无option2() } }, {}, 2),
        not_yes_input('physicalgeneralExam.liver', '肝脏', { inputProps: { options: get_触及option2() } }, {}, 2),
        not_yes_input('physicalgeneralExam.spleen', '脾脏', { inputProps: { options: get_触及option2() } }, {}, 2),

        not_yes_input('physicalgeneralExam.spine', '脊柱', { inputProps: { options: get_正常option2() } }, {}, 2),
        not_yes_input('physicalgeneralExam.physiologicalreflection', '生理反射', { inputProps: { options: get_正常option2() } }, {}, 2),
        not_yes_input('physicalgeneralExam.pathologicalreflection', '病理反射', { inputProps: { options: get_正常option2() } }, {}, 2),


        {
          key: "physicalgeneralExam.edema",
          "label": "下肢水肿",
          "inputType": "MC",
          inputProps: {
            options: mchcEnv.get_other_options('edemaOptions'),
            marshal: 0
          },
          layout: '1/3',

        },
        {
          inputType: 'check_invert_button',
          layout: '1/3',

        },
        {
          "key": "physicalgeneralExam.otherNote",
          "label": "其他",
          "inputType": "input",
          layout: '2/3',
        }
      ]
    },]
);
const 专科检查_conf = defineFormConfig(
  [
    {
      // "key": "gynecologicalFetusExam",
      "label": "胎儿信息",
      // "inputType": "array-custom",
      // "inputProps": { 'header_label': true, 'array_title': '胎儿', 'config': [{ 'name': 'id', 'key': '.id', 'label': 'id', 'input_type': 'input', 'hidden': true, 'span': 5 }, { 'name': 'fetalHeartRate', 'key': '.fetalHeartRate', 'label': '胎心率', 'input_type': 'input', 'span': 5, 'input_props': { 'type': 'number', 'unit': 'bpm' } }, { 'name': 'fetalPosition', 'key': '.fetalPosition', 'label': '位置', 'input_type': 'select', 'span': 5, 'input_props': { 'options': 'positonOptions' } }, { 'name': 'position', 'key': '.position', 'label': '胎方位', 'input_type': 'MA', 'span': 5, 'input_props': { 'options': 'fetalPositonOptions' } }, { 'name': 'presentation', 'key': '.presentation', 'label': '先露', 'input_type': 'select', 'span': 5, 'input_props': { 'options': 'presentationOptions' } }] },
      // layout: '1/4',
      children: [
        {
          ...门诊_胎儿_form,
          name: 'gynecologicalFetusExam',
        }
      ]
    },
    {

      "label": "产科检查",
      children: [
        {
          "key": "gynecologicalMotherExam.fundalHeight",
          "label": "宫高",
          "inputType": "InputNumber",
          "inputProps": { 'unit': 'cm', },
          layout: '1/4',
        }, {
          "key": "gynecologicalMotherExam.waistHip",
          "label": "腹围",
          "inputType": "InputNumber",
          "inputProps": { 'unit': 'cm', },
          layout: '1/4',
        }, {
          "key": "gynecologicalMotherExam.engagement",
          "label": "衔接",
          "inputType": "select",


          "inputProps": { 'options': mchcEnv.get_other_options('engagementOptions'), marshal: 0 },
          layout: '1/4',


        },
      ]
    },
    {
      "label": "妇科检查",
      children: [
        {
          "key": "gynecologicalMotherExam.vulva",
          "label": "外阴",
          "inputType": "MA",
          "inputProps": { 'options': '未见异常,-' },
          layout: '1/4',
        }, {
          "key": "gynecologicalMotherExam.vagina",
          "label": "阴道",
          "inputType": "MA",
          "inputProps": { 'options': '未见异常,-' },
          layout: '1/4',
        }, {
          "key": "gynecologicalMotherExam.cervix",
          "label": "宫颈",
          "inputType": "MA",
          "inputProps": { 'options': '未见异常,-' },
          layout: '1/4',
        }, {
          "key": "gynecologicalMotherExam.uterus",
          "label": "子宫",
          "inputType": "MA",
          "inputProps": { 'options': '未见异常,-' },
          layout: '1/4',
          "isNewRow": 1,
        }, {
          "key": "gynecologicalMotherExam.adnexa",
          "label": "附件",
          "inputType": "MA",
          "inputProps": { 'options': '未见异常,-' },
          layout: '1/4',
        },
        {
          "label": "一键勾选",
          "inputType": "check_invert_button",
          layout: "1/4",
        }
      ]
    },
    { name: 'id', form_hidden: true }
  ]
);
const prefix = 'labExam.'
const 检验检查_conf = defineFormConfig(
  [
    {
      "key": "syncBtn",
      "label": "同步数据",
      "inputType": "MyButton"
    },
    {
      "label": "血型",
      collapsed: false,
      "children": [
        {
          "key": prefix + "type",
          "form_hidden": true,
        },
        {
          "key": prefix + "version",
          "form_hidden": true,
        },
        {
          "key": prefix + "relationId",
          "form_hidden": true,
        },
        {
          "key": prefix + "id",
          "form_hidden": true,
        },
        {
          "key": prefix + "bg",
          "label": "女方血型",
          "inputType": "MA",
          "inputProps": {

            "options": [
              {
                "label": "A",
                "value": "A"
              },
              {
                "label": "B",
                "value": "B"
              },
              {
                "label": "AB",
                "value": "AB"
              },
              {
                "label": "O",
                "value": "O"
              }
            ],
          },
          "span": 3,
          "isNewRow": 1
        },
        {
          "key": prefix + "rh",
          "label": "RH",
          "inputType": "MA",
          "inputProps": {

            "options": [
              {
                "label": "阴性(-)",
                "value": "阴性(-)"
              },
              {
                "label": "阳性(+)",
                "value": "阳性(+)",
                warning: true,
              }
            ]
          },
          "span": 3,
        },
        {
          "key": prefix + "partnerBg",
          "label": "男方血型",
          "inputType": "MA",
          "inputProps": {

            "options": [
              {
                "label": "A",
                "value": "A"
              },
              {
                "label": "B",
                "value": "B"
              },
              {
                "label": "AB",
                "value": "AB"
              },
              {
                "label": "O",
                "value": "O"
              }
            ],
            "marshal": 0,
            "placeholder": "ABO血型",
          },
          "span": 3,
        },
        {
          "key": prefix + "partnerRh",
          "label": "RH",
          "inputType": "MA",
          "inputProps": {

            "marshal": 0,
            "options": [
              {
                "label": "阴性(-)",
                "value": "阴性(-)"
              },
              {
                "label": "阳性(+)",
                "value": "阳性(+)"
              }
            ],
            "style": {
              "marginLeft": "-1px"
            }
          },
          "span": 3,
        },
      ]
    },
    {
      "label": "血常规",
      collapsed: false,
      "children": [
        {
          "key": prefix + "hb",
          "label": "女方Hb",
          "inputType": "input",
          "inputProps": {

          },
          "span": 3,
          "isNewRow": 1
        },
        {
          "key": prefix + "mcv",
          "label": "MCV",
          "inputType": "input",
          "inputProps": {

          },
          "span": 3,
        },
        {
          "key": prefix + "mch",
          "inputProps": {

          },
          "label": "MCH",
          "inputType": "input",
          "span": 3,
        },
        {
          "key": prefix + "hbep",
          "label": "电泳",
          "inputType": "MC",
          "inputProps": {

            "options": [
              {
                "label": "正常",
                "value": "正常"
              },
              {
                "label": "异常",
                "value": "异常",
                "inputType": "MA",
                "warning": true,
                "props": {
                  "width": 120
                }
              },
            ],
            "marshal": 1
          },
          "span": 5,
        },
        {
          "key": prefix + "gene",
          "label": "基因检测",
          "inputType": "MC",
          "inputProps": {

            "options": [
              {
                "label": "正常",
                "value": "正常"
              },
              {
                "label": "异常",
                "value": "异常",
                "warning": true,
                "inputType": "MA",
                "props": {
                  "width": 120
                }
              },
            ],
            "marshal": 1
          },
          "span": 5,
        },
        {
          "key": prefix + "thalassemia",
          "label": "地贫",
          "form_hidden": true,
          "inputType": "MA",
          "inputProps": {

            "marshal": 0,
            "options": [
              {
                "label": "正常",
                "value": "正常"
              },
              {
                "label": "异常",
                "value": "异常",
                "warning": true,
              },
              {
                "label": "未查",
                "value": "未查"
              }
            ],
            "style": {
              "marginLeft": "-1px"
            }
          },
          "span": 3,
        },
        {
          "key": prefix + "partnerHb",
          "label": "男方Hb",
          inputProps: {

          },
          "inputType": "input",
          "span": 3,
          "isNewRow": 1
        },
        {
          "key": prefix + "partnerMcv",
          inputProps: {

          },
          "label": "MCV",
          "inputType": "input",
          "span": 3,
        },
        {
          "key": prefix + "partnerMch",
          inputProps: {

          },
          "label": "MCH",
          "inputType": "input",
          "span": 3,
        },
        {
          "key": prefix + "partnerHbep",
          "label": "电泳",
          "inputType": "MC",
          "inputProps": {

            "options": [
              {
                "label": "正常",
                "value": "正常"
              },
              {
                "label": "异常",
                "value": "异常",
                "inputType": "MA",
                "warning": true,
                "props": {
                  "width": 120
                }
              },
            ],
            "marshal": 1
          },
          "span": 5,
        },
        {
          "key": prefix + "partnerGene",
          "label": "基因检测",
          "inputType": "MC",
          "inputProps": {

            "options": [
              {
                "label": "正常",
                "value": "正常"
              },
              {
                "label": "异常",
                "value": "异常",
                "inputType": "MA",
                "warning": true,
                "props": {
                  "width": 120
                }
              },
            ],
            "marshal": 1
          },
          "span": 5,
        }
      ]
    },
    {
      "label": "传染病",
      collapsed: false,
      "children": [
        {
          "key": prefix + "hbsag",
          "label": "HBsAg",
          "inputType": "MA",
          "inputProps": {

            "options": [
              {
                "label": "阴性",
                "value": "阴性"
              },
              {
                "label": "阳性",
                "value": "阳性",
                "warning": true
              },
              {
                "label": "未查",
                "value": "未查"
              }
            ],
          },
          "span": 3,
        },
        {
          "key": prefix + "hbvDna",
          "label": "HBV_DNA",
          "inputType": "input",
          "span": 3,
          "inputProps": {
          }
        },
        {
          "key": prefix + "hiv",
          "label": "HIV",
          "inputType": "MA",
          "inputProps": {

            "options": [
              {
                "label": "阴性",
                "value": "阴性"
              },
              {
                "label": "阳性",
                "value": "阳性"
              },
              {
                "label": "未查",
                "value": "未查"
              }
            ],
          },
          "span": 3,
        },
        {
          "key": prefix + "tppa",
          "label": "TPPA",
          "inputType": "MA",
          "inputProps": {

            "options": [
              {
                "label": "阴性",
                "value": "阴性"
              },
              {
                "label": "阳性",
                "value": "阳性"
              },
              {
                "label": "未查",
                "value": "未查"
              }
            ],
          },
          "span": 3,
        },
        {
          "key": prefix + "trust",
          "label": "TRUST",
          "inputType": "MA",
          "inputProps": {

            "options": [
              {
                "label": "阴性",
                "value": "阴性"
              },
              {
                "label": "阳性",
                "value": "阳性"
              },
              {
                "label": "未查",
                "value": "未查"
              }
            ],
          },
          "span": 3,
        },
        {
          "key": prefix + "hcv",
          "label": "丙肝",
          "inputType": "MA",
          "inputProps": {

            "options": [
              {
                "label": "阴性",
                "value": "阴性"
              },
              {
                "label": "阳性",
                "value": "阳性"
              },
              {
                "label": "未查",
                "value": "未查"
              }
            ],
          },
          "span": 3,
        },
        {
          "key": prefix + "partnerAmy",
          "label": "男方艾梅乙",
          "inputType": "MC",
          "inputProps": {

            type: 'multiple',
            "options": [
              {
                "label": "全阴性",
                "value": "全阴性",
                exclusive: true,
              },
              {
                "label": "HIV+",
                "value": "HIV+",
                "warning": true
              },
              {
                "label": "梅毒+",
                "value": "梅毒+",
                "warning": true
              },
              {
                "label": "乙肝+",
                "value": "乙肝+",
                "warning": true
              }
            ],
            "marshal": 1
          },
          "isNewRow": true,
          "span": 8,
        }
      ]
    },
    {
      "label": "优生",
      collapsed: false,
      "children": [
        {
          "key": prefix + "downsScreenEarly",
          "label": "早唐",
          "inputType": "MA",
          "inputProps": {

            "options": [

              {
                "label": "低风险",
                "value": "低风险"
              },
              {
                "label": "低风险",
                "value": "低风险"
              },
              {
                "label": "临界风险",
                "value": "临界风险"
              },
              {
                "label": "高风险",
                "value": "高风险"
              }
            ]
          },
          "isNewRow": false,
          "span": 3,
        },
        {
          "key": prefix + "downsScreenMiddle",
          "label": "中唐",
          "inputType": "MA",
          "inputProps": {

            "options": [
              {
                "label": "结果已出",
                "value": "结果已出",
              },
              {
                "label": "低风险",
                "value": "低风险"
              },
              {
                "label": "临界风险",
                "value": "临界风险"
              },
              {
                "label": "高风险",
                "value": "高风险"
              }
            ]
          },
          "span": 3,
        },
        {
          "key": prefix + "nipt",
          "label": "无创DNA",
          "inputType": "MA",
          "inputProps": {

            "width": 80,
            "options": [
              {
                "label": "低风险",
                "value": "低风险"
              },
              {
                "label": "临界风险",
                "value": "临界风险"
              },
              {
                "label": "高风险",
                "value": "高风险"
              }
            ]
          },
          "span": 3,
        },
        {
          "key": prefix + "ultrasonic2",
          "label": "小排畸",
          "inputType": "MC",
          "inputProps": {

            "options": [
              {
                "label": "结果已出",
                "value": "结果已出",
                "inputType": "MA",
                exclusive: true,
                "props": {
                  "width": 150
                }
              },
              {
                "label": "正常",
                "value": "正常"
              },
              {
                "label": "异常",
                "value": "异常",
                "inputType": "MA",
                "warning": true,
                "props": {
                  "width": 150
                }
              },
            ],
            "marshal": 1
          },
          "span": 6,
        },
        {
          "key": prefix + "ultrasonic4",
          "label": "大排畸",
          "inputType": "MC",
          "inputProps": {

            "options": [
              {
                "label": "结果已出",
                "value": "结果已出",
                exclusive: true,
                "inputType": "MA",
                "props": {
                  "width": 150
                }
              },
              {
                "label": "正常",
                "value": "正常"
              },
              {
                "label": "异常",
                "value": "异常",
                "inputType": "MA",
                "warning": true,
                "props": {
                  "width": 150
                }
              },
            ],
            "marshal": 1
          },
          "span": 6,
        }
      ]
    },
    {
      "label": "其他",
      collapsed: false,
      "children": [
        {
          "key": prefix + "tsh",
          "label": "TSH",
          "span": 3,
          "inputProps": {

          },
          "inputType": "input"
        },
        {
          "key": prefix + "ft4",
          "label": "FT4",
          "span": 3,
          "inputProps": {

          },
          "inputType": "input"
        },
        {
          "key": prefix + "ft3",
          "label": "FT3",
          "span": 3,
          "inputProps": {

          },
          "inputType": "input"
        },
        {
          "key": prefix + "cruor",
          "label": "凝血",
          "inputType": "MC",
          "inputProps": {

            "options": [
              {
                "label": "正常",
                "value": "正常"
              },
              {
                "label": "异常",
                "value": "异常",
                "inputType": "input",
                "warning": true,
                "props": {
                  "style": {
                    "width": 150
                  }
                }
              },
            ],
            "marshal": 1
          },
          "span": 6,
        },
        {
          "key": prefix + "alt",
          "label": "ALT",
          "span": 3,
          "inputProps": {

          },
          "isNewRow": true,
          "inputType": "input"
        },
        {
          "key": prefix + "ast",
          "label": "AST",
          "span": 3,
          "inputProps": {

          },
          "inputType": "input"
        },
        {
          "key": prefix + "cr",
          "label": "肌酐",
          "span": 3,
          "inputProps": {

          },
          "inputType": "input"
        },
        {
          "key": prefix + "ua",
          "label": "尿酸",
          "span": 3,
          "inputProps": {

          },
          "inputType": "input"
        },
        {
          "key": prefix + "pro",
          "label": "尿蛋白",
          "inputType": "input",
          "inputProps": {

          },
          "span": 3,
        },
        {
          "key": prefix + "fbg",
          "label": "空腹血糖",
          "inputType": "input",
          "isNewRow": true,
          "inputProps": {

          },
          "span": 3,
        },
        {
          "key": prefix + "ogtt0",
          "label": "OGTT-0H",
          "inputType": "input",
          "isNewRow": false,
          "inputProps": {

          },
          "span": 3,
        },
        {
          "key": prefix + "ogtt1",
          "label": "OGTT-1H",
          "inputType": "input",
          "inputProps": {

          },
          "span": 3,
        },
        {
          "key": prefix + "ogtt2",
          "label": "OGTT-2H",
          "inputProps": {

          },
          "inputType": "input",
          "span": 3,
        },
        {
          "key": prefix + "gbs",
          "label": "GBS",
          "inputProps": {

          },
          "isNewRow": true,
          "inputType": "input",
          "span": 3,
        },
        {
          "key": prefix + "sf",
          "label": "铁蛋白",
          "inputProps": {

          },
          "inputType": "input",
          "span": 3,
        }
      ]
    }
  ]
);
const 诊断处理_conf = defineFormConfig(
  [
    { key: 'diagnosisAndAdvice.id', form_hidden: true },
    { key: 'diagnosisAndAdvice.serialNo', form_hidden: true },
    {
      "key": "diagnosisAndAdvice.advice.disclosure",
      "label": "病情告知",
      "inputType": "textareaWithTemplate",
      "isActive": mchcEnv.is('广州市八'),
      "inputProps": {
        rows: 6,
        "TemplateTextarea_type": [
          { "title": "科室", "type": 18 },
          { "title": "个人", "type": 19 }
        ]
      },
      layout: '1/1',

    },
    // {
    //     "key": "advice.prescription",
    //     "label": "处理措施",
    //     "inputType": "textareaWithTemplate",
    //     'required': true,
    //     "inputProps": { 'minRows': 2, 'maxRows': 5, 'title': '处理措施模板', 'departmentTempalteType': 6, 'personalTempalteTType': 7, 'departmentId': 2, 'showAdvise': true },
    //     layout: '1/1',
    // },

    {
      "key": "diagnosisAndAdvice.advice.prescription",
      "label": "处理措施",
      "inputType": "textareaWithTemplate",
      layout: '1/1',
      "inputProps": {
        "TemplateTextarea_type": [
          { "title": "科室", "type": 6, "depid": 2 },
          { "title": "个人", "type": 7 },

        ]
      }
    },

    {
      "key": "diagnosisAndAdvice.advice.exam",
      "label": "辅助检查",
      "inputType": "textareaWithTemplate",
      // "inputProps": { 'minRows': 2, 'maxRows': 5, 'title': '辅助检查模板', 'departmentTempalteType': 13, 'personalTempalteTType': 14, 'departmentId': 2 },
      "inputProps": {
        "TemplateTextarea_type": [
          { "title": "科室", "type": 13, "depid": 2 },
          { "title": "个人", "type": 14 },
        ]
      },
      "isActive": !mchcEnv.is('广州市八'),
      layout: '1/1',
    },


    {
      "label": "下次复诊",
      "layout": "2/3",
      "inputType": "straw",
      "children": [
        {
          "key": "diagnosisAndAdvice.advice.appointmentType",
          "inputType": "MS",
          "isActive": !mchcEnv.is('广州市八'),
          'required': true,
          "inputProps": { 'uniqueKey': 'PrenatalVisit.appointmentType', marshal: 0 },
        },
        {
          "key": "diagnosisAndAdvice.advice.appointmentCycle",

          "inputType": "MS",
          "inputProps": { 'options': ctx.mchcEnv.get_other_options('appointmentCycleOptions'), marshal: 0 },
        },
        {
          "key": "diagnosisAndAdvice.advice.appointmentDate",
          "inputType": "date",
        },
        {
          "key": "diagnosisAndAdvice.advice.appointmentPeriod",
          "inputType": "MS",
          "isActive": !mchcEnv.is('广州市八'),
          "inputProps": { 'options': ctx.mchcEnv.get_other_options('appointmentPeriodOptions'), marshal: 0 },
        },
      ]
    },


    {
      "key": "diagnosisAndAdvice.advice.visitDate",
      "label": "初诊日期",
      "inputType": "date",
      "isNewRow": 1,
      layout: '1/3',
    },
    {
      "key": "diagnosisAndAdvice.advice.doctorName",
      "label": "初诊医生",
      "inputType": "input",
      showDeps(f) {
        return !!ctx.utils.getSearchParamsAll().serialNo || !!f.getFieldValue('serialNo')
      },
      "inputProps": { 'disabled': true },
      layout: '1/3',
    }
  ]
);


async function check_config() {

  let 既往史_pack = (await import('../../nurse-end/archival-information/form/既往史')).既往史_pack
  return 既往史_pack(true, true)
}

async function get_既往史_config() {
  const config: IMchc_FormDescriptions_Field_Nullable[] = [
    // { name: '', key: '', label: '疾病史', header_label: true, just_header: true, inputType: '' },
    { name: 'id', form_hidden: true },
    ...await check_config(),

    {
      "key": "既往史一键勾选",
      "label": "一键勾选",
      "inputType": "check_invert_button",
      layout: '1/3',
    },
  ];
  return config
}
export default async function get_config() {
  const config: IMchc_FormDescriptions_Field_Nullable[] = [
    {
      key: 'id',
      form_hidden: true,
    },
    {
      key: 'pregnancyId',
      form_hidden: true,
    },
    {
      key: 'prenatalVisitId',
      form_hidden: true,
    },
    {

      label: '现病史',

      children: 现病史_conf.__lazy_config
    },
    {

      label: '既往史',

      children: await get_既往史_config()
    },
    {

      label: '其他病史',

      children: 其他病史_conf.__lazy_config
    },
    孕产史_config(),
    {

      label: '体格检查',

      children: 体格检查_conf.__lazy_config
    },
    {

      label: '专科检查',

      children: 专科检查_conf.__lazy_config
    },
    {

      label: '检验检查',

      children: 检验检查_conf.__lazy_config
    },
    {

      label: '诊断处理',

      children: 诊断处理_conf.__lazy_config
    },
  ];
  return config
}

