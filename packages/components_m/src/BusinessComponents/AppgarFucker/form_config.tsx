import { rt_ctx } from "@lm_fe/env";
import { defineFormConfig } from "@lm_fe/service";
const ctx = rt_ctx
export default defineFormConfig([
  {
    label: 'Apgar评分',
    children: [
      {
        label: '时间',
        key: 'apgarTitle1',
        inputType: 'node',
        layout: '1/4',
        inputProps: { node: '1分钟' },
        isNewRow: 1
      },
      {
        label: '',
        key: 'apgarTitle2',
        inputType: 'node',
        layout: '1/4',
        inputProps: { node: '5分钟' },
      },
      {
        label: '',
        key: 'apgarTitle3',
        inputType: 'node',
        layout: '1/4',
        inputProps: { node: '10分钟' },
      },
      {
        label: '肤色',
        key: 'apgar1Skincolor',
        inputType: 'input_number',
        layout: '1/4',
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar1Skincolor = v || 0
          var apgar1Breath = form.getFieldValue('apgar1Breath') || 0
          var apgar1Muscletension = form.getFieldValue('apgar1Muscletension') || 0
          var apgar1Reflex = form.getFieldValue('apgar1Reflex') || 0
          var apgar1Heartrate = form.getFieldValue('apgar1Heartrate') || 0
          var apgar1 = apgar1Skincolor + apgar1Breath + apgar1Muscletension + apgar1Reflex + apgar1Heartrate
          form.setFieldsValue({ apgar1: apgar1 })
        },
        isNewRow: 1
      },
      {
        label: '',
        key: 'apgar5Skincolor',
        inputType: 'input_number',
        layout: '1/4',
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar5Skincolor = v || 0
          var apgar5Breath = form.getFieldValue('apgar5Breath') || 0
          var apgar5Muscletension = form.getFieldValue('apgar5Muscletension') || 0
          var apgar5Reflex = form.getFieldValue('apgar5Reflex') || 0
          var apgar5Heartrate = form.getFieldValue('apgar5Heartrate') || 0
          var apgar5 = apgar5Skincolor + apgar5Breath + apgar5Muscletension + apgar5Reflex + apgar5Heartrate
          form.setFieldsValue({ apgar5: apgar5 })
        },
      },
      {
        label: '',
        key: 'apgar10Skincolor',
        inputType: 'input_number',
        layout: '1/4',
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar10Skincolor = v || 0
          var apgar10Breath = form.getFieldValue('apgar10Breath') || 0
          var apgar10Muscletension = form.getFieldValue('apgar10Muscletension') || 0
          var apgar10Reflex = form.getFieldValue('apgar10Reflex') || 0
          var apgar10Heartrate = form.getFieldValue('apgar10Heartrate') || 0
          var apgar10 = apgar10Skincolor + apgar10Breath + apgar10Muscletension + apgar10Reflex + apgar10Heartrate
          form.setFieldsValue({ apgar10: apgar10 })
        },
      },
      {
        label: '呼吸',
        key: 'apgar1Breath',
        inputType: 'input_number',
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar1Skincolor = form.getFieldValue('apgar1Skincolor') || 0
          var apgar1Breath = v || 0
          var apgar1Muscletension = form.getFieldValue('apgar1Muscletension') || 0
          var apgar1Reflex = form.getFieldValue('apgar1Reflex') || 0
          var apgar1Heartrate = form.getFieldValue('apgar1Heartrate') || 0
          var apgar1 = apgar1Skincolor + apgar1Breath + apgar1Muscletension + apgar1Reflex + apgar1Heartrate
          form.setFieldsValue({ apgar1: apgar1 })
        },
        layout: '1/4',

        isNewRow: 1
      },
      {
        label: '',
        key: 'apgar5Breath',
        inputType: 'input_number',
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar5Skincolor = form.getFieldValue('apgar5Skincolor') || 0
          var apgar5Breath = v || 0
          var apgar5Muscletension = form.getFieldValue('apgar5Muscletension') || 0
          var apgar5Reflex = form.getFieldValue('apgar5Reflex') || 0
          var apgar5Heartrate = form.getFieldValue('apgar5Heartrate') || 0
          var apgar5 = apgar5Skincolor + apgar5Breath + apgar5Muscletension + apgar5Reflex + apgar5Heartrate
          form.setFieldsValue({ apgar5: apgar5 })
        },
        layout: '1/4',

      },
      {
        label: '',
        key: 'apgar10Breath',
        inputType: 'input_number',
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar10Skincolor = form.getFieldValue('apgar10Skincolor') || 0
          var apgar10Breath = v || 0
          var apgar10Muscletension = form.getFieldValue('apgar10Muscletension') || 0
          var apgar10Reflex = form.getFieldValue('apgar10Reflex') || 0
          var apgar10Heartrate = form.getFieldValue('apgar10Heartrate') || 0
          var apgar10 = apgar10Skincolor + apgar10Breath + apgar10Muscletension + apgar10Reflex + apgar10Heartrate
          form.setFieldsValue({ apgar10: apgar10 })
        },
        layout: '1/4',

      },
      {
        label: '肌张力',
        key: 'apgar1Muscletension',
        inputType: 'input_number',
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar1Skincolor = form.getFieldValue('apgar1Skincolor') || 0
          var apgar1Breath = form.getFieldValue('apgar1Breath') || 0
          var apgar1Muscletension = v || 0
          var apgar1Reflex = form.getFieldValue('apgar1Reflex') || 0
          var apgar1Heartrate = form.getFieldValue('apgar1Heartrate') || 0
          var apgar1 = apgar1Skincolor + apgar1Breath + apgar1Muscletension + apgar1Reflex + apgar1Heartrate
          form.setFieldsValue({ apgar1: apgar1 })
        },
        layout: '1/4',

        isNewRow: 1
      },
      {
        label: '',
        key: 'apgar5Muscletension',
        inputType: 'input_number',
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar5Skincolor = form.getFieldValue('apgar5Skincolor') || 0
          var apgar5Breath = form.getFieldValue('apgar5Breath') || 0
          var apgar5Muscletension = v || 0
          var apgar5Reflex = form.getFieldValue('apgar5Reflex') || 0
          var apgar5Heartrate = form.getFieldValue('apgar5Heartrate') || 0
          var apgar5 = apgar5Skincolor + apgar5Breath + apgar5Muscletension + apgar5Reflex + apgar5Heartrate
          form.setFieldsValue({ apgar5: apgar5 })
        },
        layout: '1/4',

      },
      {
        label: '',
        key: 'apgar10Muscletension',
        inputType: 'input_number',
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar10Skincolor = form.getFieldValue('apgar10Skincolor') || 0
          var apgar10Breath = form.getFieldValue('apgar10Breath') || 0
          var apgar10Muscletension = v || 0
          var apgar10Reflex = form.getFieldValue('apgar10Reflex') || 0
          var apgar10Heartrate = form.getFieldValue('apgar10Heartrate') || 0
          var apgar10 = apgar10Skincolor + apgar10Breath + apgar10Muscletension + apgar10Reflex + apgar10Heartrate
          form.setFieldsValue({ apgar10: apgar10 })
        },
        layout: '1/4',

      },
      {
        label: '反射',
        key: 'apgar1Reflex',
        inputType: 'input_number',

        layout: '1/4',
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar1Skincolor = form.getFieldValue('apgar1Skincolor') || 0
          var apgar1Breath = form.getFieldValue('apgar1Breath') || 0
          var apgar1Muscletension = form.getFieldValue('apgar1Muscletension') || 0
          var apgar1Reflex = v || 0
          var apgar1Heartrate = form.getFieldValue('apgar1Heartrate') || 0
          var apgar1 = apgar1Skincolor + apgar1Breath + apgar1Muscletension + apgar1Reflex + apgar1Heartrate
          form.setFieldsValue({ apgar1: apgar1 })
        },
        isNewRow: 1
      },
      {
        label: '',
        key: 'apgar5Reflex',
        inputType: 'input_number',

        layout: '1/4',
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar5Skincolor = form.getFieldValue('apgar5Skincolor') || 0
          var apgar5Breath = form.getFieldValue('apgar5Breath') || 0
          var apgar5Muscletension = form.getFieldValue('apgar5Muscletension') || 0
          var apgar5Reflex = v || 0
          var apgar5Heartrate = form.getFieldValue('apgar5Heartrate') || 0
          var apgar5 = apgar5Skincolor + apgar5Breath + apgar5Muscletension + apgar5Reflex + apgar5Heartrate
          form.setFieldsValue({ apgar5: apgar5 })
        },
      },
      {
        label: '',
        key: 'apgar10Reflex',
        inputType: 'input_number',

        layout: '1/4',
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar10Skincolor = form.getFieldValue('apgar10Skincolor') || 0
          var apgar10Breath = form.getFieldValue('apgar10Breath') || 0
          var apgar10Muscletension = form.getFieldValue('apgar10Muscletension') || 0
          var apgar10Reflex = v || 0
          var apgar10Heartrate = form.getFieldValue('apgar10Heartrate') || 0
          var apgar10 = apgar10Skincolor + apgar10Breath + apgar10Muscletension + apgar10Reflex + apgar10Heartrate
          form.setFieldsValue({ apgar10: apgar10 })
        },
      },
      {
        label: '心率',
        key: 'apgar1Heartrate',
        inputType: 'input_number',
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar1Skincolor = form.getFieldValue('apgar1Skincolor') || 0
          var apgar1Breath = form.getFieldValue('apgar1Breath') || 0
          var apgar1Muscletension = form.getFieldValue('apgar1Muscletension') || 0
          var apgar1Reflex = form.getFieldValue('apgar1Reflex') || 0
          var apgar1Heartrate = v || 0
          var apgar1 = apgar1Skincolor + apgar1Breath + apgar1Muscletension + apgar1Reflex + apgar1Heartrate
          form.setFieldsValue({ apgar1: apgar1 })
        },
        layout: '1/4',

        isNewRow: 1
      },
      {
        label: '',
        key: 'apgar5Heartrate',
        inputType: 'input_number',
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar5Skincolor = form.getFieldValue('apgar5Skincolor') || 0
          var apgar5Breath = form.getFieldValue('apgar5Breath') || 0
          var apgar5Muscletension = form.getFieldValue('apgar5Muscletension') || 0
          var apgar5Reflex = form.getFieldValue('apgar5Reflex') || 0
          var apgar5Heartrate = v || 0
          var apgar5 = apgar5Skincolor + apgar5Breath + apgar5Muscletension + apgar5Reflex + apgar5Heartrate
          form.setFieldsValue({ apgar5: apgar5 })
        },
        layout: '1/4',

      },
      {
        label: '',
        key: 'apgar10Heartrate',
        inputType: 'input_number',
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar10Skincolor = form.getFieldValue('apgar10Skincolor') || 0
          var apgar10Breath = form.getFieldValue('apgar10Breath') || 0
          var apgar10Muscletension = form.getFieldValue('apgar10Muscletension') || 0
          var apgar10Reflex = form.getFieldValue('apgar10Reflex') || 0
          var apgar10Heartrate = v || 0
          var apgar10 = apgar10Skincolor + apgar10Breath + apgar10Muscletension + apgar10Reflex + apgar10Heartrate
          form.setFieldsValue({ apgar10: apgar10 })
        },
        layout: '1/4',

      },
      {
        label: '总分',
        key: 'apgar1',
        inputType: 'input_number',
        layout: '1/4',
        inputProps: { disabled: true },
        isNewRow: 1
      },
      {
        label: '',
        key: 'apgar5',
        inputType: 'input_number',
        layout: '1/4',
        inputProps: { disabled: true },
      },
      {
        label: '',
        key: 'apgar10',
        inputType: 'input_number',
        layout: '1/4',
        inputProps: { disabled: true },
      },
    ]
  },
  {
    label: 'Apgar评分(1分钟评分)',
    children: [
      {
        label: '总分',
        key: 'apgar1',
        inputType: 'input_number',
        layout: '1/4',
        inputProps: { disabled: true },
        isNewRow: 1
      },
      {
        label: '肤色',
        key: 'apgar1Skincolor',
        inputType: 'MC',
        inputProps: { marshal: 0, options: [{ value: 0, label: '全身青紫或苍白' }, { value: 1, label: '躯体红润，肢体青紫' }, { value: 2, label: '全身红润' },] },
        layout: '1/2',
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar1Skincolor = v || 0
          var apgar1Breath = form.getFieldValue('apgar1Breath') || 0
          var apgar1Muscletension = form.getFieldValue('apgar1Muscletension') || 0
          var apgar1Reflex = form.getFieldValue('apgar1Reflex') || 0
          var apgar1Heartrate = form.getFieldValue('apgar1Heartrate') || 0
          var apgar1 = apgar1Skincolor + apgar1Breath + apgar1Muscletension + apgar1Reflex + apgar1Heartrate
          form.setFieldsValue({ apgar1: apgar1 })
        },
        isNewRow: 1
      },
      {
        label: '得分',
        inputProps: { disabled: true },
        key: 'apgar1Skincolor',
        inputType: 'input_number',
        layout: '1/4',
      },
      {
        label: '呼吸',
        key: 'apgar1Breath',
        inputType: 'MC',
        inputProps: { marshal: 0, options: [{ value: 0, label: '无' }, { value: 1, label: '慢或不规则' }, { value: 2, label: '正常，哭声响' },] },
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar1Skincolor = form.getFieldValue('apgar1Skincolor') || 0
          var apgar1Breath = v || 0
          var apgar1Muscletension = form.getFieldValue('apgar1Muscletension') || 0
          var apgar1Reflex = form.getFieldValue('apgar1Reflex') || 0
          var apgar1Heartrate = form.getFieldValue('apgar1Heartrate') || 0
          var apgar1 = apgar1Skincolor + apgar1Breath + apgar1Muscletension + apgar1Reflex + apgar1Heartrate
          form.setFieldsValue({ apgar1: apgar1 })
        },
        layout: '1/2',

        isNewRow: 1
      },
      {
        label: '得分',
        inputProps: { disabled: true },
        key: 'apgar1Breath',
        inputType: 'input_number',
        layout: '1/4',
      },
      {
        label: '肌张力',
        key: 'apgar1Muscletension',
        inputType: 'MC',
        inputProps: { marshal: 0, options: [{ value: 0, label: '四肢松弛' }, { value: 1, label: '四肢略弯曲' }, { value: 2, label: '四肢活动' },] },
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar1Skincolor = form.getFieldValue('apgar1Skincolor') || 0
          var apgar1Breath = form.getFieldValue('apgar1Breath') || 0
          var apgar1Muscletension = v || 0
          var apgar1Reflex = form.getFieldValue('apgar1Reflex') || 0
          var apgar1Heartrate = form.getFieldValue('apgar1Heartrate') || 0
          var apgar1 = apgar1Skincolor + apgar1Breath + apgar1Muscletension + apgar1Reflex + apgar1Heartrate
          form.setFieldsValue({ apgar1: apgar1 })
        },
        layout: '1/2',

        isNewRow: 1
      },
      {
        label: '得分',
        inputProps: { disabled: true },
        key: 'apgar1Muscletension',
        inputType: 'input_number',
        layout: '1/4',
      },
      {
        label: '反射',
        key: 'apgar1Reflex',
        inputType: 'MC',
        inputProps: { marshal: 0, options: [{ value: 0, label: '无' }, { value: 1, label: '皱眉' }, { value: 2, label: '喷嚏或哭' },] },

        layout: '1/2',
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar1Skincolor = form.getFieldValue('apgar1Skincolor') || 0
          var apgar1Breath = form.getFieldValue('apgar1Breath') || 0
          var apgar1Muscletension = form.getFieldValue('apgar1Muscletension') || 0
          var apgar1Reflex = v || 0
          var apgar1Heartrate = form.getFieldValue('apgar1Heartrate') || 0
          var apgar1 = apgar1Skincolor + apgar1Breath + apgar1Muscletension + apgar1Reflex + apgar1Heartrate
          form.setFieldsValue({ apgar1: apgar1 })
        },
        isNewRow: 1
      },
      {
        label: '得分',
        inputProps: { disabled: true },
        key: 'apgar1Reflex',
        inputType: 'input_number',
        layout: '1/4',
      },
      {
        label: '心率',
        key: 'apgar1Heartrate',
        inputType: 'MC',
        inputProps: { marshal: 0, options: [{ value: 0, label: '无' }, { value: 1, label: '<100次/分' }, { value: 2, label: '>100次/分' },] },
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar1Skincolor = form.getFieldValue('apgar1Skincolor') || 0
          var apgar1Breath = form.getFieldValue('apgar1Breath') || 0
          var apgar1Muscletension = form.getFieldValue('apgar1Muscletension') || 0
          var apgar1Reflex = form.getFieldValue('apgar1Reflex') || 0
          var apgar1Heartrate = v || 0
          var apgar1 = apgar1Skincolor + apgar1Breath + apgar1Muscletension + apgar1Reflex + apgar1Heartrate
          form.setFieldsValue({ apgar1: apgar1 })
        },
        layout: '1/2',

        isNewRow: 1
      },
      {
        label: '得分',
        inputProps: { disabled: true },
        key: 'apgar1Heartrate',
        inputType: 'input_number',
        layout: '1/4',
      },
    ]
  },
  {
    label: 'Apgar评分(5分钟评分)',
    children: [
      {
        label: '总分',
        key: 'apgar5',
        inputType: 'input_number',
        layout: '1/4',
        inputProps: { disabled: true },
        isNewRow: 1
      },
      {
        label: '肤色',
        key: 'apgar5Skincolor',
        inputType: 'MC',
        inputProps: { marshal: 0, options: [{ value: 0, label: '全身青紫或苍白' }, { value: 1, label: '躯体红润，肢体青紫' }, { value: 2, label: '全身红润' },] },
        layout: '1/2',
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar5Skincolor = v || 0
          var apgar5Breath = form.getFieldValue('apgar5Breath') || 0
          var apgar5Muscletension = form.getFieldValue('apgar5Muscletension') || 0
          var apgar5Reflex = form.getFieldValue('apgar5Reflex') || 0
          var apgar5Heartrate = form.getFieldValue('apgar5Heartrate') || 0
          var apgar5 = apgar5Skincolor + apgar5Breath + apgar5Muscletension + apgar5Reflex + apgar5Heartrate
          form.setFieldsValue({ apgar5: apgar5 })
        },
        isNewRow: 1
      },
      {
        label: '得分',
        inputProps: { disabled: true },
        key: 'apgar5Skincolor',
        inputType: 'input_number',
        layout: '1/4',
      },
      {
        label: '呼吸',
        key: 'apgar5Breath',
        inputType: 'MC',
        inputProps: { marshal: 0, options: [{ value: 0, label: '无' }, { value: 1, label: '慢或不规则' }, { value: 2, label: '正常，哭声响' },] },
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar5Skincolor = form.getFieldValue('apgar5Skincolor') || 0
          var apgar5Breath = v || 0
          var apgar5Muscletension = form.getFieldValue('apgar5Muscletension') || 0
          var apgar5Reflex = form.getFieldValue('apgar5Reflex') || 0
          var apgar5Heartrate = form.getFieldValue('apgar5Heartrate') || 0
          var apgar5 = apgar5Skincolor + apgar5Breath + apgar5Muscletension + apgar5Reflex + apgar5Heartrate
          form.setFieldsValue({ apgar5: apgar5 })
        },
        layout: '1/2',

        isNewRow: 1
      },
      {
        label: '得分',
        inputProps: { disabled: true },
        key: 'apgar5Breath',
        inputType: 'input_number',
        layout: '1/4',
      },
      {
        label: '肌张力',
        key: 'apgar5Muscletension',
        inputType: 'MC',
        inputProps: { marshal: 0, options: [{ value: 0, label: '四肢松弛' }, { value: 1, label: '四肢略弯曲' }, { value: 2, label: '四肢活动' },] },
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar5Skincolor = form.getFieldValue('apgar5Skincolor') || 0
          var apgar5Breath = form.getFieldValue('apgar5Breath') || 0
          var apgar5Muscletension = v || 0
          var apgar5Reflex = form.getFieldValue('apgar5Reflex') || 0
          var apgar5Heartrate = form.getFieldValue('apgar5Heartrate') || 0
          var apgar5 = apgar5Skincolor + apgar5Breath + apgar5Muscletension + apgar5Reflex + apgar5Heartrate
          form.setFieldsValue({ apgar5: apgar5 })
        },
        layout: '1/2',

        isNewRow: 1
      },
      {
        label: '得分',
        inputProps: { disabled: true },
        key: 'apgar5Muscletension',
        inputType: 'input_number',
        layout: '1/4',
      },
      {
        label: '反射',
        key: 'apgar5Reflex',
        inputType: 'MC',
        inputProps: { marshal: 0, options: [{ value: 0, label: '无' }, { value: 1, label: '皱眉' }, { value: 2, label: '喷嚏或哭' },] },

        layout: '1/2',
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar5Skincolor = form.getFieldValue('apgar5Skincolor') || 0
          var apgar5Breath = form.getFieldValue('apgar5Breath') || 0
          var apgar5Muscletension = form.getFieldValue('apgar5Muscletension') || 0
          var apgar5Reflex = v || 0
          var apgar5Heartrate = form.getFieldValue('apgar5Heartrate') || 0
          var apgar5 = apgar5Skincolor + apgar5Breath + apgar5Muscletension + apgar5Reflex + apgar5Heartrate
          form.setFieldsValue({ apgar5: apgar5 })
        },
        isNewRow: 1
      },
      {
        label: '得分',
        inputProps: { disabled: true },
        key: 'apgar5Reflex',
        inputType: 'input_number',
        layout: '1/4',
      },
      {
        label: '心率',
        key: 'apgar5Heartrate',
        inputType: 'MC',
        inputProps: { marshal: 0, options: [{ value: 0, label: '无' }, { value: 1, label: '<100次/分' }, { value: 2, label: '>100次/分' },] },
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar5Skincolor = form.getFieldValue('apgar5Skincolor') || 0
          var apgar5Breath = form.getFieldValue('apgar5Breath') || 0
          var apgar5Muscletension = form.getFieldValue('apgar5Muscletension') || 0
          var apgar5Reflex = form.getFieldValue('apgar5Reflex') || 0
          var apgar5Heartrate = v || 0
          var apgar5 = apgar5Skincolor + apgar5Breath + apgar5Muscletension + apgar5Reflex + apgar5Heartrate
          form.setFieldsValue({ apgar5: apgar5 })
        },
        layout: '1/2',

        isNewRow: 1
      },
      {
        label: '得分',
        inputProps: { disabled: true },
        key: 'apgar5Heartrate',
        inputType: 'input_number',
        layout: '1/4',
      },
    ]
  },
  {
    label: 'Apgar评分(10分钟评分)',
    children: [
      {
        label: '总分',
        key: 'apgar10',
        inputType: 'input_number',
        layout: '1/4',
        inputProps: { disabled: true },
        isNewRow: 1
      },
      {
        label: '肤色',
        key: 'apgar10Skincolor',
        inputType: 'MC',
        inputProps: { marshal: 0, options: [{ value: 0, label: '全身青紫或苍白' }, { value: 1, label: '躯体红润，肢体青紫' }, { value: 2, label: '全身红润' },] },
        layout: '1/2',
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar10Skincolor = v || 0
          var apgar10Breath = form.getFieldValue('apgar10Breath') || 0
          var apgar10Muscletension = form.getFieldValue('apgar10Muscletension') || 0
          var apgar10Reflex = form.getFieldValue('apgar10Reflex') || 0
          var apgar10Heartrate = form.getFieldValue('apgar10Heartrate') || 0
          var apgar10 = apgar10Skincolor + apgar10Breath + apgar10Muscletension + apgar10Reflex + apgar10Heartrate
          form.setFieldsValue({ apgar10: apgar10 })
        },
        isNewRow: 1
      },
      {
        label: '得分',
        inputProps: { disabled: true },
        key: 'apgar10Skincolor',
        inputType: 'input_number',
        layout: '1/4',
      },
      {
        label: '呼吸',
        key: 'apgar10Breath',
        inputType: 'MC',
        inputProps: { marshal: 0, options: [{ value: 0, label: '无' }, { value: 1, label: '慢或不规则' }, { value: 2, label: '正常，哭声响' },] },
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar10Skincolor = form.getFieldValue('apgar10Skincolor') || 0
          var apgar10Breath = v || 0
          var apgar10Muscletension = form.getFieldValue('apgar10Muscletension') || 0
          var apgar10Reflex = form.getFieldValue('apgar10Reflex') || 0
          var apgar10Heartrate = form.getFieldValue('apgar10Heartrate') || 0
          var apgar10 = apgar10Skincolor + apgar10Breath + apgar10Muscletension + apgar10Reflex + apgar10Heartrate
          form.setFieldsValue({ apgar10: apgar10 })
        },
        layout: '1/2',

        isNewRow: 1
      },
      {
        label: '得分',
        inputProps: { disabled: true },
        key: 'apgar10Breath',
        inputType: 'input_number',
        layout: '1/4',
      },
      {
        label: '肌张力',
        key: 'apgar10Muscletension',
        inputType: 'MC',
        inputProps: { marshal: 0, options: [{ value: 0, label: '四肢松弛' }, { value: 1, label: '四肢略弯曲' }, { value: 2, label: '四肢活动' },] },
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar10Skincolor = form.getFieldValue('apgar10Skincolor') || 0
          var apgar10Breath = form.getFieldValue('apgar10Breath') || 0
          var apgar10Muscletension = v || 0
          var apgar10Reflex = form.getFieldValue('apgar10Reflex') || 0
          var apgar10Heartrate = form.getFieldValue('apgar10Heartrate') || 0
          var apgar10 = apgar10Skincolor + apgar10Breath + apgar10Muscletension + apgar10Reflex + apgar10Heartrate
          form.setFieldsValue({ apgar10: apgar10 })
        },
        layout: '1/2',

        isNewRow: 1
      },
      {
        label: '得分',
        inputProps: { disabled: true },
        key: 'apgar10Muscletension',
        inputType: 'input_number',
        layout: '1/4',
      },
      {
        label: '反射',
        key: 'apgar10Reflex',
        inputType: 'MC',
        inputProps: { marshal: 0, options: [{ value: 0, label: '无' }, { value: 1, label: '皱眉' }, { value: 2, label: '喷嚏或哭' },] },

        layout: '1/2',
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar10Skincolor = form.getFieldValue('apgar10Skincolor') || 0
          var apgar10Breath = form.getFieldValue('apgar10Breath') || 0
          var apgar10Muscletension = form.getFieldValue('apgar10Muscletension') || 0
          var apgar10Reflex = v || 0
          var apgar10Heartrate = form.getFieldValue('apgar10Heartrate') || 0
          var apgar10 = apgar10Skincolor + apgar10Breath + apgar10Muscletension + apgar10Reflex + apgar10Heartrate
          form.setFieldsValue({ apgar10: apgar10 })
        },
        isNewRow: 1
      },
      {
        label: '得分',
        inputProps: { disabled: true },
        key: 'apgar10Reflex',
        inputType: 'input_number',
        layout: '1/4',
      },
      {
        label: '心率',
        key: 'apgar10Heartrate',
        inputType: 'MC',
        inputProps: { marshal: 0, options: [{ value: 0, label: '无' }, { value: 1, label: '<100次/分' }, { value: 2, label: '>100次/分' },] },
        processLocal: function (v, form) {
          if (ctx.utils.isNil(v) || !form) return
          var apgar10Skincolor = form.getFieldValue('apgar10Skincolor') || 0
          var apgar10Breath = form.getFieldValue('apgar10Breath') || 0
          var apgar10Muscletension = form.getFieldValue('apgar10Muscletension') || 0
          var apgar10Reflex = form.getFieldValue('apgar10Reflex') || 0
          var apgar10Heartrate = v || 0
          var apgar10 = apgar10Skincolor + apgar10Breath + apgar10Muscletension + apgar10Reflex + apgar10Heartrate
          form.setFieldsValue({ apgar10: apgar10 })
        },
        layout: '1/2',

        isNewRow: 1
      },
      {
        label: '得分',
        inputProps: { disabled: true },
        key: 'apgar10Heartrate',
        inputType: 'input_number',
        layout: '1/4',
      },
    ]
  },
])