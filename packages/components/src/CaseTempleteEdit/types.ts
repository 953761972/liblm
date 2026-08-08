// mode
// 1. DESIGN 设计模式；
// 2. EDITOR 编辑模式；
// 3. STRICT 严格模式（表单模式）；
// 4. READONLY 只读模式；可以把整个表格的内容修改了
export interface ICaseEditProps {
    onChange?(str?: string): void;
    value?: string;
    containerProps?: { width?: number, height?: number };
    toolbars?: any;
    mode?: 'DESIGN' | 'EDITOR' | 'STRICT' | 'READONLY';
    emr_mode?: 'design' | 'form';

    hiddenButton?: boolean;
    // 仅隐藏电子签名按钮(其余操作按钮如打印/保存正常显示)
    hideSignButton?: boolean;
    sdeKey?: any;
    hidentoolbars?: boolean;
    // 当前文书模板标题,保存时作为保存接口的ititle字段传入
    title?: string;
}

export interface IFuck_Xsde {
    execCommand(cmd: string): void,
    html(str?: string): string,
    addListener(e: string, cb: () => void): void
}