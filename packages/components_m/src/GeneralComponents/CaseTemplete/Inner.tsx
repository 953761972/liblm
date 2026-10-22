import { MyIcon } from '@lm_fe/components';
import { APP_CONFIG, ds, mchcMacro } from '@lm_fe/env';
import { request, sleep } from '@lm_fe/utils';
import { Button, Modal, Spin, message } from 'antd';
import { get } from 'lodash';
import React, { Component } from 'react';
import store from 'store';
import { defaultToolbars } from './config';
import './index.less';
interface IProps {
  onSave: any;
  content?: any;
  containerProps?: any;
  toolbars?: any;
  mode?: 'DESIGN' | 'EDITOR' | 'STRICT' | 'READONLY';
  hiddenButton?: boolean;
  sdeKey?: any;
  hidentoolbars?: boolean;
}
// mode
// 1. DESIGN 设计模式；
// 2. EDITOR 编辑模式；
// 3. STRICT 严格模式（表单模式）；
// 4. READONLY 只读模式；可以把整个表格的内容修改了
let loaded = false
export default class CaseTempleteEdit extends Component<IProps> {
  editRef: any;
  signPollTimer: any = null;
  signRequesting = false;

  state = {
    signModalVisible: false,
    signQrCode: '',
    signLoading: false,
  };

  clearSignPollTimer = () => {
    if (this.signPollTimer) {
      clearInterval(this.signPollTimer);
      this.signPollTimer = null;
    }
  };

  componentWillUnmount() {
    this.clearSignPollTimer();
  }

  // ===================== CA电子签名 =====================

  requestCaUserImage = async () => {
    const result = (await request.get('/api/ca/queryUserImage')).data;
    return result;
  }

  // 将签名base64图片渲染到文书模板的 [{{signBase64}}] 占位符中
  renderSignImage = (signBase64: string) => {
    const content = window.sde.html() || '';
    const placeholder = '[{{signBase64}}]';
    if (content.indexOf(placeholder) === -1) {
      message.warning('当前文书模板未设置签名占位符[{{signBase64}}]');
      return;
    }
    const signImage = signBase64.startsWith('data:image')
      ? signBase64
      : `data:image/png;base64,${signBase64}`;
    let newContent: string;
    // 占位符写在 <img src> 里时,直接替换dataURL;否则替换成<img>标签
    if (
      content.indexOf(`src="${placeholder}"`) !== -1 ||
      content.indexOf(`src='${placeholder}'`) !== -1
    ) {
      newContent = content.split(placeholder).join(signImage);
    } else {
      newContent = content.split(placeholder).join(`<img src="${signImage}" style="width:120px;height:60px"/>`);
    }
    window.sde.html(newContent);
    message.success('电子签名成功');
    // 触发保存,将签名内容持久化
    this.handleSave();
  };

  // 处理签名接口返回: 签名图片(user.signBase64) 或 待扫码授权(二维码)
  handleSignImageResult = (res: any) => {
    // 已授权: 返回用户信息,签名图片在signBase64字段
    if (get(res, 'signBase64')) {
      this.clearSignPollTimer();
      this.setState({ signModalVisible: false, signLoading: false });
      this.renderSignImage(get(res, 'signBase64'));
      return;
    }
    // 未授权: 返回CaResponseDTO,data为二维码base64,弹出让用户扫码授权
    const qrCodeBase64 = get(res, 'data');
    if (qrCodeBase64) {
      this.setState({
        signLoading: false,
        signModalVisible: true,
        signQrCode: `data:image/png;base64,${qrCodeBase64}`,
      });
      // 轮询,等待用户扫码授权
      this.clearSignPollTimer();
      this.signPollTimer = setInterval(async () => {
        if (this.signRequesting) return;
        this.signRequesting = true;
        try {
          const r = await this.requestCaUserImage();
          this.handleSignImageResult(r);
        } catch (e) {
          // 轮询失败继续等待
        } finally {
          this.signRequesting = false;
        }
      }, 2000);
      return;
    }
    // 其他失败情况
    message.error(get(res, 'msg') || '获取签名图片失败');
    this.setState({ signLoading: false, signModalVisible: false });
  }

  handleSignClick = async () => {
    const content = window.sde.html() || '';
    if (content.indexOf('[{{signBase64}}]') === -1) {
      message.warning('当前文书模板未设置签名占位符[{{signBase64}}]');
      return;
    }
    this.setState({ signLoading: true });
    try {
      const res = await this.requestCaUserImage();
      this.handleSignImageResult(res);
    } catch (e) {
      message.error('获取签名失败');
      this.setState({ signLoading: false, signModalVisible: false });
      this.clearSignPollTimer();
    }
  }

  handleSignModalCancel = () => {
    this.clearSignPollTimer();
    this.setState({ signModalVisible: false, signQrCode: '' });
  }

  // ===================== CA电子签名 end =====================

  async load_and_init() {
    if (!loaded) {
      const pp = mchcMacro.PUBLIC_PATH
      await ds([
        `${pp}lib/sde.config.js`,
        `${pp}lib/ueditor/ueditor.all.min.js`,
        `${pp}lib/ueditor/lang/zh-cn/zh-cn.js`,
        `${pp}lib/ueditor/themes/default/css/ueditor.css`,
        `${pp}lib/sde/sde-ie8-design.js`,
      ])
      loaded = true
      await sleep(1000)
    }
    this.initSDE()
  }
  componentDidMount() {
    window.apiToken = store.get(APP_CONFIG.TOKEN);
    this.load_and_init()
    // this.initSDE();
  }

  async componentDidUpdate() {
    if (this.props.content) {
      this.initSDE()

    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.content === this.props.content) {
      return false;
    }
    return true;
  }

  initSDE = () => {
    const { toolbars, content, mode, containerProps, hidentoolbars } = this.props;
    // console.log('mode', { mode, hidentoolbars }); //模式
    // console.log(' this.editRef,', this.editRef,);

    var sde = (window.sde = new window.SDE({
      el: this.editRef,
      mode,
      iframe_css_src: '/lib/sde/index.css', //扩展CSS
      page_start_num: 1, //页面起始页，默认为1
      //这里可以处理url，对url进行再加工。如果此时执行 this.isLoadAsyncData(true)，则表示代替sde自带的异步请求方法，
      ctrl_remote_handle: function (data) { },
      default_open_toolbar: 'sde-toolbar-tools', //默认打开的toolbar的集合，如果不填，默认使用第一个集合
      toolbars: toolbars || defaultToolbars,
    }));
    // console.log("sde",sde.addListener('ready'));
    //编辑器初始化完成后触发
    sde.addListener('ready', function () {
      // console.log("content",content);
      // 把content的内容显示到报卡上
      sde.html(content);
    });
    window.sde = sde;
    const editorElement = document.getElementsByClassName('sde-editor')[0];
    editorElement.style.height = `${get(containerProps, 'height') - 143}px`;
    if (mode === 'STRICT') {
      const toolbarElement = document.getElementsByClassName('sde-toolbars')[0];
      toolbarElement.style.display = 'none';
      editorElement.style.height = `${get(containerProps, 'height')}px`;
    }
    if (hidentoolbars) {
      setTimeout(() => {
        const toolbarElement = document.getElementsByClassName('sde-toolbars')[0];
        toolbarElement.style.display = 'none';
      }, 0);
    }
  };

  handleSave = () => {
    const { onSave } = this.props;
    const content = window.sde.html();
    console.log('content', content);

    onSave && onSave(content);
  };

  handlePrint = () => {
    window.sde.execCommand('print');
  };

  render() {
    const { hiddenButton } = this.props;
    const { signModalVisible, signQrCode, signLoading } = this.state;
    return (
      <div id="case-templete-container" className="case-templete-container">
        <div
          className="sde-container"
          key={this.props.sdeKey || Math.random()}
          ref={(refNode) => {
            this.editRef = refNode;
          }}
        ></div>
        {/* <div className="case-templete-container_actions"> */}
        {!hiddenButton && (
          <div className="right-bottom-btns">
            <Button
              className="case-templete-container_actions-btns"
              onClick={this.handleSignClick}
              loading={signLoading}
              icon={<MyIcon value='HighlightOutlined' />}
            >
              电子签名
            </Button>
            <Button
              className="case-templete-container_actions-btns"
              onClick={this.handlePrint}
              icon={<MyIcon value='PrinterOutlined' />}
            >
              打印
            </Button>
            <Button
              type="primary"
              className="case-templete-container_actions-btns"
              onClick={this.handleSave}
              icon={<MyIcon value='SaveOutlined' />}
            >
              保存
            </Button>
          </div>
        )}
        <Modal
          title="CA电子签名授权"
          open={signModalVisible}
          footer={null}
          onCancel={this.handleSignModalCancel}
          centered
        >
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <Spin spinning={signLoading || !signQrCode}>
              {signQrCode ? (
                <img
                  src={signQrCode}
                  alt="授权二维码"
                  style={{ width: 300, height: 300 }}
                />
              ) : (
                <div style={{ width: 300, height: 300 }} />
              )}
            </Spin>
            <p style={{ marginTop: 12, color: '#888' }}>
              请使用CA客户端APP扫描二维码完成授权,授权后将自动获取签名
            </p>
          </div>
        </Modal>
      </div>
    );
  }
}
