import { mchcEnv, mchcLogger } from "@lm_fe/env";
import { load_src, request, sleep } from "@lm_fe/utils";
import { MyIcon } from '@noah-libjs/components';
import { Button, Space, message } from 'antd';
import { get } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { ICaseEditProps } from "src/CaseTempleteEdit/types";
import { IFuck_Xemr } from "./types";
import { get_editor_frame, load_xemr } from "./utils";



export default function CaseTempleteEditEmr(props: ICaseEditProps) {
  const {
      toolbars,
      // value = demo_text,
      value = '',
      onChange,
      containerProps,
      hidentoolbars,
      hideSignButton,
      title,
      use_doctor_sign,
  } = props

  const fuck_editor = useRef<IFuck_Xemr>()
  const value_cache = useRef(value)
  value_cache.current = value

  // 将当前模板的title设置进X-EMR编辑器,保存时作为保存接口的ititle字段
  const syncEmrTitle = () => {
    if (title && fuck_editor.current) {
      try {
        // X-EMR编辑器有setTitle方法,保存接口ititle字段来自getTitle()
        // @ts-ignore
        fuck_editor.current?.setTitle?.(title)
      } catch (e) {
        mchcLogger.warn('设置X-EMR文书标题失败', { e, title })
      }
    }
  }

  // ===================== CA电子签名 =====================
  // 复用统一的医生签名流程(本地http签名 / 扫码授权由hook内部处理)
  const { handle_cs_sign, sign_btn_disabled, sign_btn_text, sign_confirm } = use_doctor_sign('caseTemplete')
  const [signLoading, setSignLoading] = useState(false)

  // 将签名base64图片渲染到文书模板的 [{{signBase64}}] 占位符中
  const renderSignImage = (signBase64: string) => {
    const content = fuck_editor.current?.getHtml() || '';
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
    fuck_editor.current?.loadHtml(newContent);
    syncEmrTitle()
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
    const content = fuck_editor.current?.getHtml() || ''
    if (content.indexOf('[{{signBase64}}]') === -1) {
      message.warning('当前文书模板未设置签名占位符[{{signBase64}}]')
      return
    }
    if (!sign_confirm()) return
    setSignLoading(true)
    try {
      // 复用统一签名hook完成CA授权(本地http签名 / 扫码授权)
      //await handle_cs_sign({ title, content })
      // 授权完成后获取签名图片,渲染到占位符
      const res = await requestCaUserImage()
      const signBase64 = get(res, 'signBase64')
      if (signBase64) {
        renderSignImage(signBase64)
      } else {
        message.error('获取签名图片失败')
      }
      await save()
    } catch (e) {
      message.error('签名失败')
    } finally {
      setSignLoading(false)
    }
  }
  // ===================== CA电子签名 end =====================

  useEffect(() => {

    load_xemr()
      .then(editor => {
        fuck_editor.current = editor

        mchcLogger.log('fuck_editor', fuck_editor.current)
        init_emr()
      })

    return () => {

    }
  }, [])
  useEffect(() => {
    try {
      fuck_editor.current?.loadHtml(value);
      syncEmrTitle()
    } catch (e) {
      message.warning('加载文档发生错误')
      mchcLogger.warn('加载文档发生错误', { e, value })
    }


    return () => {

    }
  }, [value])




  function init_emr() {
    if (!fuck_editor.current) {
      return;
    }

    let option = {
      license:
        'xxxxx', //授权字符串
      baseUrl: mchcEnv.gs(_ => _.lm_libs["X-EMR"]["/"]), //基本URL
      saveUrl: '/doc/', //保存URL
      pdfUrl: 'https://www.x-emr.cn/pdf/post', //pdf生成服务
      mode: emr_mode, //form:表单模式，design:设计模式
      scale: 1, //缩放比例
      container: '#editor_el', //编辑器容器对象ID
      toolbar: {
        file: true, //显示文件
        edit: true, //显示编辑
        insert: true, //显示插入
        expression: true, //显示表达式
        table: true, //显示表格
        revision: true, //显示修订
        view: false, //显示查看
        print: false, //显示打印
        import: false, //显示导入
        export: false, //显示导出
        develop: false, //显示开发工具
        help: false, //显示帮助
      },
      statusbar: false, //是否显示状态栏
      dictionary: false && [
        //知识库
      ],
    };
    fuck_editor.current.init(option);


    fuck_editor.current.loadHtml(value_cache.current);
    syncEmrTitle()

    let _emreditor = get_editor_frame()
    load_src({
      type: 'text/css',
      text: `
            body {
              background-image: none !important;
          }
      `},
      _emreditor?.contentWindow?.document.head
    )



    if (!value_cache.current)
      fuck_editor.current.execCommand('new')
  };


  async function save() {
    try {
      // 保存前将当前模板的title同步到编辑器,作为保存接口的ititle字段
      syncEmrTitle()
      // 将文书的预览内容存起来
      const _pv = await prepare_preview()

      let documentElement = _pv?.contentWindow?.document!

      let previewHTML = documentElement.querySelector('.preview')?.innerHTML ?? ''
      mchcLogger.log('previewHTML', { previewHTML }, fuck_editor.current?.getHtml())
      onChange?.(fuck_editor.current?.getHtml()!);
    } catch (e) {
      mchcEnv.warning('发生错误')
      mchcLogger.warn('发生错误', e)
    }

  };






  const { hiddenButton, emr_mode = 'design' } = props;
  async function prepare_preview() {
    if (!fuck_editor.current) return
    fuck_editor.current.execCommand('preview')
    await sleep(1000)
    // let _emr_el = get_editor_frame()

    let _pv = document.getElementById('_printview') as HTMLIFrameElement
    let doc_el = _pv?.contentDocument!
    doc_el.querySelectorAll('text').forEach(element => element.remove()); // 删除该死的授权许可
    doc_el.querySelectorAll('.page-mask').forEach(element => element.remove()); // 删除该死的mask
    doc_el.querySelectorAll('.pagebreaker').forEach(element => element.remove()); // 删除该死的pagebreaker
    // _pv.hidden = true
    // _emr_el.style.display = 'block'

    return _pv
  }


  async function print() {
    try {
      const _pv = await prepare_preview()
      _pv?.contentWindow?.print()
    } catch (e) {
      mchcEnv.warning('发生错误')
      mchcLogger.warn('发生错误', e)
    }
    // let previewHTML = documentElement.querySelector('.preview')?.innerHTML
    // onChange && onChange(value, previewHTML);
  }
  return (
    <>
      <div id="editor_el" style={{ overflow: 'hidden auto', height: '100%', ...containerProps }}></div>
      {!hiddenButton && (
        <Space.Compact style={{ position: 'fixed', right: 36, bottom: 36 }}>
          <Button
            type="primary"
            onClick={handleSignClick}
            loading={signLoading}
            disabled={sign_btn_disabled}
            icon={<MyIcon value='HighlightOutlined' />}
            style={hideSignButton ? { display: 'none' } : undefined}
          >
            {sign_btn_text || '电子签名'}
          </Button>
          <Button
            type="primary"
            onClick={save}
          >
            保存
          </Button>
          <Button
            type="primary"
            onClick={print}
          >
            打印
          </Button>
        </Space.Compact>
      )}
    </>
  );

}
