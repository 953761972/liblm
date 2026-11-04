import { IMchc_FormDescriptions_Field_Nullable } from '@lm_fe/service'

const pregnancyCourseAttendanceOptions = [
    { value: '无', label: '无', exclusive: true },
    { value: '孕产期保健', label: '孕产期保健' },
    { value: '生产分娩', label: '生产分娩' },
    { value: '产后康复', label: '产后康复' },
    { value: '围产期心理健康', label: '围产期心理健康' },
    { value: '婴儿护理', label: '婴儿护理' },
    { value: '母乳喂养', label: '母乳喂养' },
    { value: '围产期营养', label: '围产期营养' },
    { value: '常见染色体病', label: '常见染色体病' },
    { value: '唐筛', label: '唐筛' },
    { value: '无创', label: '无创' },
    { value: '羊穿', label: '羊穿' },
]

export const 其他补充信息_config = () => {
    const config: IMchc_FormDescriptions_Field_Nullable = {
        name: '其他补充信息',
        children: [
            {
                key: 'pregnancyInfo.birthCertificate',
                label: '出生证明资料',
                inputType: 'MC',
                inputProps: {
                    options: [
                        { value: '已提交', label: '已提交' },
                        { value: '未提交', label: '未提交' },
                    ],
                    marshal: 0,
                },
                layout: '1/3',
            },
            {
                key: 'pregnancyInfo.hasPerinatalLicense',
                label: '是否有准生证',
                inputType: 'MC',
                inputProps: {
                    options: [
                        { value: '有', label: '有' },
                        { value: '无', label: '无' },
                    ],
                    marshal: 0,
                },
                layout: '1/3',
            },
            {
                key: 'pregnancyInfo.perinatalLicenseNumber',
                label: '准生证号',
                inputType: 'input',
                inputProps: { placeholder: '请输入准生证号' },
                layout: '1/3',
            },
            {
                key: 'pregnancyInfo.pregnancyCourseAttendance',
                label: '孕教课听课情况',
                inputType: 'MC',
                inputProps: {
                    type: 'multiple',
                    options: pregnancyCourseAttendanceOptions,
                    marshal: 0,
                },
                layout: '1/1',
            },
            {
                key: 'pregnancyInfo.followUpSurvey',
                label: '随访问卷分数登记',
                inputType: 'MC',
                inputProps: {
                    options: [
                        { value: '合格', label: '合格' },
                        { value: '不合格', label: '不合格' },
                    ],
                    marshal: 0,
                },
                layout: '1/3',
            },
            {
                key: 'pregnancyInfo.followUpSurveyScore',
                label: '随访问卷分数',
                inputType: 'input',
                inputProps: { placeholder: '请输入随访问卷分数' },
                layout: '1/3',
            },
            {
                key: 'pregnancyInfo.appointmentConductorSituation',
                label: '预约导乐/陪伴情况',
                inputType: 'MC',
                inputProps: {
                    options: [
                        { value: '已预约', label: '已预约' },
                        { value: '未预约', label: '未预约' },
                    ],
                    marshal: 0,
                },
                layout: '1/3',
            },
            {
                key: 'pregnancyInfo.outpatientResultScan',
                label: '外院结果是否扫描',
                inputType: 'MC',
                inputProps: {
                    options: [
                        { value: '已扫描', label: '已扫描' },
                        { value: '未扫描', label: '未扫描' },
                    ],
                    marshal: 0,
                },
                layout: '1/3',
            },
            {
                key: 'pregnancyInfo.inpatientRegistrationDate',
                label: '入院交表日期',
                inputType: 'single_date_picker',
                inputProps: { placeholder: '请选择入院交表日期' },
                layout: '1/3',
            },
            {
                key: 'pregnancyInfo.designatedDeliveryHospital',
                label: '定点分娩医院',
                inputType: 'input',
                inputProps: { placeholder: '请输入定点分娩医院' },
                layout: '1/3',
            },
        ],
    }
    return config
}
