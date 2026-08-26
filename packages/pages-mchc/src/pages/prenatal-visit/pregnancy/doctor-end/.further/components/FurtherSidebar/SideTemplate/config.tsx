import { rt_ctx } from '@lm_fe/env'
const ctx = rt_ctx
export default [
    {
        url: '/api/multiTemplate',
        fds: [
            { inputType: 'text_area', name: 'routineExam.chiefComplaint', label: '主诉', layout: '1/1' },
            { inputType: 'text_area', name: 'routineExam.phi', label: '现病史', layout: '1/1' },
            { inputType: 'text_area', name: 'routineExam.prescription', label: '处理措施', layout: '1/1' },
            { inputType: 'text_area', name: 'routineExam.advice', label: '建议措施', layout: '1/1' },
            { inputType: 'text_area', name: '2', label: '测试', layout: '1/1' },
            { inputType: 'text_area', name: 'routineExam.diagnosis', label: '初步诊断', layout: '1/1' },
            { inputType: 'text_area', name: 'gdm.inslname', label: '胰岛素方案', layout: '1/1' },
        ],
        MultiTemplate_type: [
            {
                label: '个人',
                params: { 'type': '复诊模板_个人' },
                canOperate: true
            },
            {
                label: '科室',
                params: { 'type': '复诊模板_科室' },
                canOperate: ctx.mchcEnv.user_data.groups.some(function (g) { return g.name.toLowerCase() === 'admin' })
            },
        ],
    }
]