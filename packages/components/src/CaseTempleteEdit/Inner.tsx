import { mchcEnv } from '@lm_fe/env';
import { use_provoke } from '@lm_fe/provoke';
import { request } from '@lm_fe/utils';
import { MyIcon } from '@noah-libjs/components';
import { Button, Space, message } from 'antd';
import { get } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { CaseTempleteEditEmr } from 'src/CaseTempleteEditEmr';
import { defaultToolbars } from './config';
import './index.less';
import { ICaseEditProps, IFuck_Xsde } from './types';
import { load_sde } from './utils';


export default function CaseTempleteEdit(props: ICaseEditProps) {
    const { config } = use_provoke('config')
    const {
        toolbars,
        hiddenButton,
        hideSignButton,
        onChange,
        value,
        mode,
        containerProps = {},
        hidentoolbars,
        use_doctor_sign,
    } = props
    const editRef = useRef<HTMLDivElement>(null)
    const fuck_editor = useRef<IFuck_Xsde>()

    const value_cache = useRef(value)
    value_cache.current = value

    // ===================== CA电子签名 =====================
    // 复用统一的医生签名流程(本地http签名 / 扫码授权由hook内部处理)
    const { handle_cs_sign, sign_btn_disabled, sign_btn_text, sign_confirm } = use_doctor_sign('caseTemplete')
    const [signLoading, setSignLoading] = useState(false)

    // 将签名base64图片渲染到文书模板的 [{{signBase64}}] 占位符中
    const renderSignImage = (signBase64: string) => {
        const content = fuck_editor.current?.html() || '';
        const placeholder = '[{{signBase64}}]';
        if (content.indexOf(placeholder) === -1) {
            message.warning('当前文书模板未设置签名占位符[{{signBase64}}]');
            return;
        }
        const signImage = signBase64.startsWith('data:image')
            ? signBase64
            : `data:image/png;base64,${signBase64}`;
        let newContent: string
        // 占位符写在 <img src> 里时,直接替换dataURL;否则替换成<img>标签
        if (
            content.indexOf(`src="${placeholder}"`) !== -1 ||
            content.indexOf(`src='${placeholder}'`) !== -1
        ) {
            newContent = content.split(placeholder).join(signImage);
        } else {
            newContent = content.split(placeholder).join(`<img src="${signImage}" style="width:120px;height:60px"/>`);
        }
        fuck_editor.current?.html(newContent);
        message.success('电子签名成功');
        // 触发保存,将签名内容持久化
        onChange?.(newContent);
    };

    // 获取当前用户已授权的电子签名图片
    const requestCaUserImage = async () => {
        const result = (await request.get('/api/ca/queryUserImage')).data;
        return result;
    }

    const handleSignClick = async () => {
        const content = fuck_editor.current?.html() || ''
        if (content.indexOf('[{{signBase64}}]') === -1) {
            message.warning('当前文书模板未设置签名占位符[{{signBase64}}]')
            return
        }
        if (!sign_confirm()) return
        setSignLoading(true)
        try {
            // 复用统一签名hook完成CA授权(本地http签名 / 扫码授权)
            await handle_cs_sign({ title: props.title, content })
            // 授权完成后获取签名图片,渲染到占位符
            const res = await requestCaUserImage()
            const signBase64 = get(res, 'signBase64')
            if (signBase64) {
                renderSignImage(signBase64)
            } else {
                message.error('获取签名图片失败')
            }
        } catch (e) {
            message.error('签名失败')
        } finally {
            setSignLoading(false)
        }
    }
    // ===================== CA电子签名 end =====================

    if (config.模板编辑器 === 'XEMR') return <CaseTempleteEditEmr {...props} />

    useEffect(() => {
        //@ts-ignore
        window.apiToken = mchcEnv.token;
        load_sde().then(init_sde)
        return () => {

        }
    }, [])

    useEffect(() => {


        fuck_editor.current?.html(value);

        return () => {

        }
    }, [value])





    function init_sde() {

        // console.log('mode', { mode, hidentoolbars }); //模式
        // console.log(' editRef,', editRef,);
        //@ts-ignore
        fuck_editor.current = new window.SDE({
            el: editRef.current,
            mode,
            iframe_css_src: '/lib/sde/index.css', //扩展CSS
            page_start_num: 1, //页面起始页，默认为1
            //这里可以处理url，对url进行再加工。如果此时执行 isLoadAsyncData(true)，则表示代替sde自带的异步请求方法，
            ctrl_remote_handle: function (data: any) { },
            default_open_toolbar: 'sde-toolbar-tools', //默认打开的toolbar的集合，如果不填，默认使用第一个集合
            toolbars: toolbars || defaultToolbars,
        })
        console.log('gg gg', fuck_editor, containerProps)
        // console.log("sde",sde.addListener('ready'));
        //编辑器初始化完成后触发
        fuck_editor.current?.addListener('ready', function () {



            fuck_editor.current?.html(value_cache.current);
        });

        const editorElement = document.getElementsByClassName('sde-editor')[0] as HTMLDivElement;
        const { height = 0, width = 0 } = containerProps

        // editorElement.style.height = `${height - 143}px`;

        if (mode === 'STRICT') {
            const toolbarElement = document.getElementsByClassName('sde-toolbars')[0] as HTMLDivElement;
            toolbarElement.style.display = 'none';
            editorElement.style.height = `${height}px`;
        }
        if (hidentoolbars) {
            setTimeout(() => {
                const toolbarElement = document.getElementsByClassName('sde-toolbars')[0] as HTMLDivElement;
                toolbarElement.style.display = 'none';
            }, 0);
        }
    };

    function save() {


        const str = fuck_editor.current?.html();

        onChange?.(str);
    };

    function handlePrint() {
        fuck_editor.current?.execCommand('print');
    };



    return (
        <div className="case-templete-container" style={{ overflow: 'hidden auto', height: '100%', ...containerProps }}>
            <div
                className="sde-container"
                key={props.sdeKey || Math.random()}
                ref={editRef}

            ></div>
            {/* <div className="case-templete-container_actions"> */}
            {!hiddenButton && (
                <Space.Compact style={{ position: 'fixed', right: 36, bottom: 36 }}>

                    <Button
                        onClick={handleSignClick}
                        loading={signLoading}
                        disabled={sign_btn_disabled}
                        icon={<MyIcon value='HighlightOutlined' />}
                        style={hideSignButton ? { display: 'none' } : undefined}
                    >
                        {sign_btn_text || '电子签名'}
                    </Button>
                    <Button
                        onClick={handlePrint}
                        icon={<MyIcon value='PrinterOutlined' />}
                    >
                        打印
                    </Button>
                    <Button
                        type="primary"
                        onClick={save}
                        icon={<MyIcon value='SaveOutlined' />}
                    >
                        保存
                    </Button>
                </Space.Compact>

            )}
        </div>
    );
}
