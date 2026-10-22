
import { defineFormConfig, IMchc_FormDescriptions_Field } from "@lm_fe/service"
export const mlUltrasounds_fd = (conf: IMchc_FormDescriptions_Field = {}, name = 'mlUltrasounds') => {
    return defineFormConfig([
        {
            ...conf,
            label: '中晚孕超声',
            name,
            inputType: 'MyEditTable',
            inputProps: {
                marshal: 0,
                formDescriptions: [
                    { label: '孕周', name: 'gestationalWeek', inputType: 'MA' },
                    { label: '胎儿', name: 'fetal', inputType: 'MA', inputProps: { options: '1,2,3,4,5,6,7,8' } },
                    { label: 'BPD(mm)', name: 'bpd', inputType: 'input_number' },
                    { label: 'HC(mm)', name: 'hc', inputType: 'input_number' },
                    { label: 'AC(mm)', name: 'ac', inputType: 'input_number' },
                    { label: 'HL(mm)', name: 'hl', inputType: 'input_number' },
                    { label: 'FL(mm)', name: 'fl', inputType: 'input_number' },
                    { label: 'AFV(mm)', name: 'afv', inputType: 'input_number' },
                    { label: 'EFW(g)', name: 'efw', inputType: 'input_number' },
                    { label: '脐血流', name: 'ubf', inputType: 'input_number' },
                    { label: '其他异常', name: 'note', inputType: 'MA' },
                ]
            }
        }
    ]).__lazy_config[0]
}