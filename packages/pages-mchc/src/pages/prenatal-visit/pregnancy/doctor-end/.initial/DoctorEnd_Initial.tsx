// import CheckAndCancelButton from '@/components/GeneralComponents/CheckAndCancelButton'; //一键选择&一键取消
import { MyIcon, MyLazyComponent } from '@lm_fe/components_m';
import { Form, FormInstance } from 'antd';
// import { getBMI, getGesWeek, menopauseWeek } from '@/utils/formula';
import { mchcEvent, mchcUtils } from '@lm_fe/env';
import { mchcModal__ } from '@lm_fe/pages';
import { use_provoke } from '@lm_fe/provoke';
import { IMchc_Doctor_FirstVisitDiagnosisOutpatient, IMchc_Doctor_OutpatientHeaderInfo, TIdType, TIdTypeCompatible } from '@lm_fe/service';
import { Button, Space, Tabs, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import JYJC from './components/JianYanJianCha';
import QTBS from './components/QiTaBingshi';
import TGJC from './components/TiGeJianCha';
import XBS from './components/XianBingShi';
import YBBS from './components/YiBanBingShi';
import YCS from './components/YunChanShi';
import ZDCL from './components/ZhenDuanChuLi';
import ZKJC from './components/ZhuanKeJianCha';
import './index.less';
const single_id = mchcUtils.single_id
const tabContents = [XBS, YBBS, QTBS, YCS, TGJC, ZKJC, JYJC, ZDCL];
export interface IDoctorEnd_InitialProps {
  diagnosis_addon_btns?: (data?: IMchc_Doctor_FirstVisitDiagnosisOutpatient) => React.ReactNode
  diagnosis_before_submit?: (submit: (values: any) => Promise<void>, data?: IMchc_Doctor_FirstVisitDiagnosisOutpatient, form?: FormInstance) => Promise<void>

  headerInfo: IMchc_Doctor_OutpatientHeaderInfo


  // setDiagnosesList(l: IMchc_Doctor_Diagnoses[]): void
  // diagnosesList: IMchc_Doctor_Diagnoses[]

  id?: TIdType



}
const allTabs = tabContents.map((tab, i) => ({
  key: `tab-${i}`,
  title: tab.Title,
  className: tab.ClassName,
  Content: tab,
}));
function DoctorEnd_Initial(props: IDoctorEnd_InitialProps) {

  const {
    headerInfo,
    id,


  } = props;
  const sys_theme = use_provoke(s => s.sys_theme)


  const pregnancyId = single_id(props);




  const [cur_step, set_cur_step] = useState(allTabs[0].key)
  const forms = useRef(Array(10).fill(0).map(_ => Form.useForm()[0]))

  const [disabled_save, set_disabled_save] = useState(false)

  useEffect(() => {


    const rm = mchcEvent.on_rm('my_form', async (e) => {


    })
    return () => {
      rm()
    }
  }, [id])



  function cal_next_tab(key: string,) {
    const idx = allTabs.findIndex((item) => item.key === key);
    if (idx === -1 || idx === allTabs.length) return
    return allTabs[idx + 1]
  }
  function cal_next_step(key: string,) {
    return cal_next_tab(key)?.key
  }

  async function handleSubmit() {
    if (cur_step == 'tab-7') return
    const tab = allTabs.filter((item: any) => item.key === cur_step)[0];

    const idx = Number(tab.key.slice(-1))

    if (tab.Content.tmp) {

      try {
        const form = forms.current[idx]
        // console.log('gg', '111')

        if (form) {
          const a = await form.validateFields()
          // console.log('gg', { fieldChange, a })

          form.submit()


        }
      } catch (e) {
        message.destroy();
        message.error('请完善表单项！!');
      }
      return
    }

  }






  function handlePrint(resource = 'prenatalVisit', id?: TIdTypeCompatible) {


    const visitId = id || pregnancyId;

    mchcModal__.open('print_modal', {
      modal_data: {
        requestData: {
          url: '/api/pdf-preview',
          resource: resource || 'prenatalVisit',
          template: '',
          version: '',
          note: '',
          id: visitId,
        }
      }
    })
  }



  const saveBtnTxt = disabled_save ? '无权限保存' : `保存`

  return (
    <div className="prenatal-visit-main_initial">
      <Tabs
        style={{ background: sys_theme.bg_color }}
        type="card"
        activeKey={cur_step}
        className="prenatal-visit-main_initial-tabs"
        onChange={(_next) => {
          set_cur_step(_next)
        }}
      >
        {allTabs.map(({ key, title, Content, className }: any, idx) => {
          const isFunc = Content.tmp

          const optionNode = <Space className="prenatal-visit-main_initial-btns">
            <Button size="large" onClick={() => handlePrint('prenatalVisit', undefined)}>
              <MyIcon value='PrinterOutlined' />    打印档案
            </Button>
            <Button size="large" type="primary" disabled={disabled_save} onClick={() => handleSubmit(key)}>
              <MyIcon value='SaveOutlined' />      {saveBtnTxt}
            </Button>
            {cur_step != 'tab-7' && (
              <Button size="large" type="primary" onClick={() => {
                // handleSubmit('', true)
                const _next = cal_next_step(cur_step)
                if (_next) {
                  set_cur_step(_next)
                }
              }}>
                <MyIcon value='ArrowRightOutlined' /> 下一页
              </Button>
            )}
          </Space>

          const node = cur_step == 'tab-7' ? (
            <ZDCL
              diagnosis_before_submit={props.diagnosis_before_submit}
              diagnosis_addon_btns={props.diagnosis_addon_btns}
              disabled_save={disabled_save}
              active={key === cur_step}
              form={forms.current[idx]}
              handlePrint={handlePrint}
              headerInfo={headerInfo}

            />
          ) : null
          return (
            <Tabs.TabPane
              key={key}
              tab={title}
            >
              <div className={className}>

                <MyLazyComponent size='middle'>
                  {isFunc ? <Content disabled_save={disabled_save} set_disabled_save={set_disabled_save} active={key === cur_step} form={forms.current[idx]} /> : node}
                  {cur_step == 'tab-7' ? null : optionNode}
                </MyLazyComponent>
              </div>
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    </div>
  );
}
export default DoctorEnd_Initial
