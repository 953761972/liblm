import { MyIcon } from '@lm_fe/components';
import { OkButton } from '@lm_fe/components_m';
import { mchcEnv } from '@lm_fe/env';
import { HighRiskTableEntry } from '@lm_fe/pages';
import { IMchc_Doctor_Diagnoses, IMchc_Doctor_FirstVisitDiagnosisOutpatient, IMchc_Doctor_OutpatientHeaderInfo } from '@lm_fe/service';
import { Divider, Modal, Space, Table } from 'antd';
import { forEach, get } from 'lodash';
import React, { useState } from 'react';
import { api } from '../../../.api';
import Diagnoses from '../../../.components/Diagnoses_New';
import ManagementPlan from '../../../.further/components/FurtherSidebar/management-plan';
interface IProps {
  headerInfo: IMchc_Doctor_OutpatientHeaderInfo,
  onRefresh(): Promise<any>
  visitData?: IMchc_Doctor_FirstVisitDiagnosisOutpatient<"mchc">

  diagnosesList: IMchc_Doctor_Diagnoses[]
  setDiagnosesList(l: IMchc_Doctor_Diagnoses[]): void
}


export function 诊断处理_Tools(props: IProps) {

  const {
    onRefresh,
    headerInfo,
    visitData,
    diagnosesList,
    setDiagnosesList
  } = props;
  const pv_id_for_diagnose = get(visitData, 'prenatalVisitId')
  const serialNo: any = get(visitData, 'serialNO') || get(visitData, 'serialNo')



  const [isShowModifyRecord, set_isShowModifyRecord] = useState(false)
  const [isShowManageModal, set_isShowManageModal] = useState(false)

  const [recordData, set_recordData] = useState([])












  function closeModal(type: 'isShowModifyRecord' | 'isShowManageModal', items?: any, key?: any) {

    if (type === 'isShowManageModal') {
      set_isShowManageModal(false)

    } else if (type === 'isShowModifyRecord') {
      set_isShowModifyRecord(false)

    }
  };



  async function handleRecordBtn() {
    const { headerInfo } = props;
    const pregnancyId = headerInfo?.id
    const recordData = await api.initial.findFirstVisitOperatingRecord(pregnancyId);

    set_recordData(recordData)
    set_isShowModifyRecord(true)
  };

  function renderModifyRecord() {
    const columns = [
      {
        title: '编号',
        dataIndex: 'items',
        key: 'items',
        render: (text: any, record: any, index: any) => index + 1,
        width: 30,
      },
      { title: '时间', dataIndex: 'operateDate', key: 'operateDate', width: 50 },
      { title: '修改人', dataIndex: 'operator', key: 'operator', width: 50 },
      {
        title: '修改字段',
        dataIndex: 'content',
        key: 'content',
        render: (text: any) => {
          let str = '';
          forEach(text, (item) => {
            str += `${get(item, 'operatingDescription')}；`;
          });
          return str;
        },
        width: 200,
      },
    ];

    return (
      <Modal
        open={isShowModifyRecord}
        title="历史首检记录"
        footer={null}
        width="80%"
        onCancel={() => set_isShowModifyRecord(false)}
      >
        <Table className="prenatal-visit-main-table" columns={columns} dataSource={recordData} pagination={false} />
      </Modal>
    );
  }




  return (
    <>
      <Diagnoses
        headerInfo={headerInfo}
        setDiagnosesList={setDiagnosesList}
        diagnosesList={diagnosesList}
        isAllPregnancies={false}
        pv_id_for_diagnose={pv_id_for_diagnose}

        serialNo={serialNo}

        page={''}
      />
      <Divider size='small' />
      <Space>
        <HighRiskTableEntry headerInfo={headerInfo} data={visitData} />
        <OkButton hidden className="his-btn" type="dashed" icon={<MyIcon value='TableOutlined' />} onClick={handleRecordBtn}>
          首检信息历史修改记录
        </OkButton>
        <OkButton
          hidden={mchcEnv.is('广三')}
          className="his-btn"
          type="dashed"
          icon={<MyIcon value='TableOutlined' />}
          onClick={() => set_isShowManageModal(true)}
        >
          产检计划
        </OkButton>

        <OkButton icon={<MyIcon value='SyncOutlined' />} onClick={onRefresh} style={{ marginLeft: 12 }}>
          刷新
        </OkButton>
      </Space>


      {isShowManageModal && (
        <ManagementPlan isShowManageModal={isShowManageModal} closeModal={closeModal} headerInfo={headerInfo} />
      )}
      {renderModifyRecord()}
    </>
  );
}

