
import { ICommonOption, otherOptions } from '@lm_fe/env';
import { not_yes_input } from '@lm_fe/pages';
import { defineFormConfig } from '@lm_fe/service';
import { form_config_家族史 } from 'src/pages/prenatal-visit/pregnancy/common';
import { 个人史_pack } from 'src/pages/prenatal-visit/pregnancy/nurse-end/archival-information/form/个人史';



export default defineFormConfig(
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
  ]);
