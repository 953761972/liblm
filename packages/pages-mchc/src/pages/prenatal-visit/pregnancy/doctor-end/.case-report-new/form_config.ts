import { rt_ctx } from "@lm_fe/env";
import { defineFormConfig } from "@lm_fe/service";
const ctx = rt_ctx
export default defineFormConfig([
    {
        "key": "id",
        "form_hidden": true
    },
    {
        "key": "pregnancyId",
        "form_hidden": true
    },
    {
        "key": "admissionId",
        "form_hidden": true
    },
    {
        "key": "way",
        "form_hidden": true
    },
    {
        "key": "neonateOrder",
        "form_hidden": true
    },
    {
        "title": "登记卡",
        "key": "name",
        "inputProps": {
            "disabled": true
        },
        "layout": "1/3"
    },
    {
        "title": "编码",
        "key": "code",
        "inputProps": {
            "disabled": true
        },
        "form_hidden": true,
        "layout": "1/3"
    },
    {
        "title": "状态",
        "inputType": "MS",
        "key": "state",
        "inputProps": {
            "marshal": 0,
            "options": "未提交,已提交,驳回,已审核,已上报",
            "disabled": true
        },
        "layout": "1/3"
    },
    {
        "title": "类型",
        "inputType": "MS",
        "key": "modType",
        "inputProps": {
            "marshal": 0,
            "options": "门诊,住院,妇保",
            "disabled": true
        },
        "layout": "1/3"
    },
    {
        "inputType": "straw",
        span: 3,
        inputProps: {
            style: { position: 'fixed', right: 60, bottom: 30, zIndex: 1 },
        },
        children: [
            {
                "inputType": "MyButton",
                "inputProps": {
                    "btn_text": "删除",
                    danger: true,
                    "on_btn_click": function (e, form) {
                        if (form) {
                            var values = form.getFieldsValue();
                            if (!values.id)
                                return ctx.mchcEvent.emit('custom_msg', { type: 'case-report-refresh', data: null })

                            if (confirm('确定删除吗？')) {
                                ctx.request.delete(`/api/ic/delete/${values.id}`)
                                    .then(() => {
                                        ctx.mchcEvent.emit('custom_msg', { type: 'case-report-refresh', data: null })
                                    })
                            }
                        }
                    }
                },
            },
            {
                "title": "",
                "inputType": "MyButton",
                "inputProps": {
                    "btn_text": "同步基本信息",
                    "on_btn_click": function (e, form) {
                        if (form) {
                            var values = form.getFieldsValue();

                            ctx.request.get('/api/ic/getBaseInfo', {
                                params: {
                                    pregnancyId: ctx.utils.single_id(ctx.props),
                                    name: values.code
                                }
                            }).then(function (e) { form.setFieldsValue({ icSyphilisPatient: e.data }) })

                        }
                    }
                },
            },
            {
                "inputType": "MyButton",
                "disabledDeps": {
                    "id": function (e) { return !e }
                },
                "inputProps": {
                    "btn_text": "打印",
                    "on_btn_click": function (e, form) {
                        if (form) {
                            var values = form.getFieldsValue();
                            ctx.print(
                                {
                                    url: '/api/ic/pdf-preview', data: {
                                        resource: 'adIndividualCaseCard',
                                        template: values.code,
                                        id: values.id
                                    }
                                })
                        }
                    }
                },
            },
            {
                "inputType": "MyButton",
                "disabledDeps": {
                    "state": function (e) { return e > 1 }
                },
                "inputProps": {
                    "btn_text": "保存",
                    "on_btn_click": function (e, form) {
                        if (form) {
                            var values = form.getFieldsValue();
                            ctx.request.post('/api/ic/saveForm', values).then(res => {
                                ctx.mchcEvent.emit('custom_msg', { type: 'case-report-refresh', data: res.data })
                            })

                        }
                    }
                },
            },
            {
                "inputType": "MyButton",
                "disabledDeps": {
                    "state": function (e) { return e > 2 }
                },
                "inputProps": {
                    "btn_text": "提交",
                    "on_btn_click": function (e, form) {
                        if (form) {
                            var values = form.getFieldsValue();
                            ctx.utils.set_dirty(values, 'state', 2)
                            ctx.request.post('/api/ic/submitForm', values).then(res => {
                                ctx.mchcEvent.emit('custom_msg', { type: 'case-report-refresh', data: res.data })
                            })

                        }
                    }
                },
            },

        ]
    },
    {
        "title": "一、基本信息",
        "children": [
            {
                "key": "icSyphilisPatient.id",
                "label": "id",
                "inputType": "input",
                "hidden": true,
                "form_hidden": true,
                "layout": "1/3"
            },
            {
                "key": "icSyphilisPatient.name",
                "label": "姓名",
                "inputType": "input",
                "layout": "1/3"
            },
            {
                "key": "icSyphilisPatient.idNO",
                "label": "身份证号",
                "inputType": "input",
                "layout": "1/3"
            },
            {
                "key": "icSyphilisPatient.dob",
                "label": "出生日期",
                "inputType": "single_date_picker",
                "layout": "1/3"
            },
            {
                "key": "icSyphilisPatient.age",
                "label": "年龄",
                "inputType": "input_number",
                "layout": "1/3"
            },
            {
                "key": "icSyphilisPatient.ethnic",
                "label": "民族",
                "inputType": "MS",
                "inputProps": {
                    "uniqueKey": "民族s"
                },
                "layout": "1/3"
            },
            {
                "key": "icSyphilisPatient.education",
                "label": "文化程度",
                "inputType": "MS",
                "inputProps": {
                    "uniqueKey": "文化程度s"
                },
                "layout": "1/3"
            },
            {
                "key": "icSyphilisPatient.occupation",
                "label": "职业",
                "inputType": "MS",
                "inputProps": {
                    "uniqueKey": "职业s"
                },
                "layout": "1/3"
            },
            {
                "key": "icSyphilisPatient.gravidity",
                "label": "孕次",
                "inputType": "input_number",
                "layout": "1/3"
            },
            {
                "key": "icSyphilisPatient.parity",
                "label": "产次",
                "inputType": "input_number",
                "layout": "1/3"
            },
            {
                "key": "icSyphilisPatient.childrenNum",
                "label": "现有子女数",
                "inputType": "input_number",
                "layout": "1/3"
            },
            {
                "key": "icSyphilisPatient.maritalStatus",
                "label": "婚姻状况",
                "inputType": "MS",
                "inputProps": {
                    "uniqueKey": "婚姻"
                },
                "layout": "1/3"
            },
            {
                "key": "icSyphilisPatient.residenceAddress",
                "label": "现住址",
                "inputType": "MyAddress",
                "layout": "1/1"
            },
            {
                "key": "icSyphilisPatient.permanentResidenceAddress",
                "label": "户口所在地",
                "inputType": "MyAddress",
                "layout": "1/1"
            },
            {
                "key": "icSyphilisPatient.telephone",
                "label": "手机号码",
                "inputType": "input",
                "layout": "1/3"
            },
            {
                "label": "既往不良妊娠结局",
                "span": 24,
                "inputProps": {
                    "size": "small"
                },
                "inputType": "straw",
                "children": [
                    {
                        "key": "icSyphilisPatient.adversePregnancy",
                        "inputType": "MC",
                        "inputProps": {
                            "marshal": 0,
                            "width": 90,
                            "options": [
                                {
                                    "value": 1,
                                    "label": "无"
                                },
                                {
                                    "value": 2,
                                    "label": "自然流产"
                                },
                                {
                                    "value": 3,
                                    "label": "死胎死产"
                                },
                                {
                                    "value": 4,
                                    "label": "早产"
                                },
                                {
                                    "value": 5,
                                    "label": "出生缺陷"
                                },
                                {
                                    "value": 6,
                                    "label": "其他"
                                }
                            ]
                        }
                    },
                    {
                        "key": "icSyphilisPatient.adversePregnancyNote",
                        "inputType": "input",
                        "inputProps": {
                            "width": 120
                        },
                        "showDeps": {
                            "icSyphilisPatient.adversePregnancy": function (e) { return e > 1 }
                        }
                    }
                ]
            },
            {
                "key": "icSyphilisPatient.lmp",
                "label": "本次妊娠末次月经时间",
                "isNewRow": true,
                "inputType": "single_date_picker",
                "span": 8
            },
            {
                "key": "icSyphilisPatient.edd",
                "label": "预产期",
                "inputType": "single_date_picker",
                "span": 8
            },
            {
                "key": "icSyphilisPatient.gestationalWeek",
                "label": "初检孕周",
                "inputType": "input",
                "span": 8
            }
        ]
    },
])