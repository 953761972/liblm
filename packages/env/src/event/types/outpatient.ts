import { AnyObject } from "@lm_fe/utils"
import { IBaseType } from "./common"
interface I_弹窗 extends IBaseType<'弹窗'> {
    modal_name: '瘢痕子宫阴道试产表' | '子痫前期风险评估表' | '深静脉血栓高危因素孕期用药筛查表' | '高危标记' | '梅毒管理' | '专案'
}

interface I_刷新头部 extends IBaseType<'刷新头部'> { }


interface I_添加修改诊断 extends IBaseType<'添加修改诊断'> {
    diagnoses: any
}
interface I_切换医生Tab extends IBaseType<'切换医生Tab'> {
    key: string
}
interface I_复诊表单走一个 extends IBaseType<'复诊表单走一个'> {
    data: AnyObject
    keys: string[]
    action: '覆' | '插'
}


interface I_其他事件 extends IBaseType<'其他事件'> {

    data: {
        name: string
    }
}

export type IOutpatient_Event = [I_弹窗 | I_其他事件 | I_刷新头部 | I_添加修改诊断 | I_切换医生Tab | I_复诊表单走一个]