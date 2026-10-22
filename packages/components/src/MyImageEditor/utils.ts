import _fabric from 'fabric';


type InterfaceType = typeof _fabric.fabric
export type RealCanvas = Canvas
export type RealType = InterfaceType & { EraserBrush: InterfaceType['PencilBrush'] }
export type RealEventCb<T extends globalThis.Event = globalThis.Event> = (e: IEvent<T>) => void
export type RealListenCbs = {
    drop: RealEventCb<MouseEvent>
    'mouse:down': RealEventCb<MouseEvent>
    'mouse:move': RealEventCb<MouseEvent>
    'mouse:up': RealEventCb<MouseEvent>
    'mouse:over': RealEventCb<MouseEvent>
    'mouse:out': RealEventCb<MouseEvent>
    'object:added': RealEventCb
}



import { Canvas, ICanvasOptions, IEvent } from 'fabric/fabric-impl';
import { mchcEnv } from '@lm_fe/env';
import { FormInstance } from 'antd';


export const real_fabric = () => (window.fabric) as unknown as RealType


export const default_legends = [
    {
        img: mchcEnv.gs(_ => _.lm_imgs.mie['img1.png']),
        width: 331,
        height: 144,
        label: '女性外生殖器'
    },
    {
        img: mchcEnv.gs(_ => _.lm_imgs.mie['img2.png']),
        width: 305,
        height: 213,
        label: '子宫'
    },
    {
        img: mchcEnv.gs(_ => _.lm_imgs.mie['img3.png']),
        width: 68,
        height: 67,
        label: '细菌'
    },
    {
        img: mchcEnv.gs(_ => _.lm_imgs.mie['img4.png']),
        width: 52,
        height: 59,
        label: '宫颈癌病毒'
    },
    {
        img: mchcEnv.gs(_ => _.lm_imgs.mie['img5.png']),
        width: 70,
        height: 70,
        label: '阴道滴虫'
    }
]
export interface IMyImageEditorProps {
    legends?: typeof default_legends
    value?: string,
    form?: FormInstance
    canvasOptions?: Partial<ICanvasOptions>
    onChange?(v: string): void
    on_save?(c?: Canvas): void
}

export const MyImageEditorEvents = {
    save: 'mie:save',
    create: 'mie:create'
}

export function event_process(con: RealCanvas, __events: RealListenCbs) {
    con.on('drop', __events.drop)
        .on('mouse:down', __events['mouse:down'])
        .on('mouse:move', __events['mouse:move'])
        .on('mouse:up', __events['mouse:up'])
        .on('mouse:over', __events['mouse:over'])
        .on('mouse:out', __events['mouse:out'])
        .on('object:added', __events['object:added'])
    return () => {
        con.off('drop', __events.drop as any)
            .off('mouse:down', __events['mouse:down'] as any)
            .off('mouse:move', __events['mouse:move'] as any)
            .off('mouse:up', __events['mouse:up'] as any)
            .off('mouse:over', __events['mouse:over'] as any)
            .off('mouse:out', __events['mouse:out'] as any)
            .off('object:added', __events['object:added'] as any)
    }
}