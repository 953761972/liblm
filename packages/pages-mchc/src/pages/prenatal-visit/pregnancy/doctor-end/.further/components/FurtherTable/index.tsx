import { MyIcon, MyLazyComponent, Table_L } from '@lm_fe/components';
import { OkButton } from '@lm_fe/components_m';
import { mchcEnv, mchcLogger, mchcUtils } from '@lm_fe/env';
import { BF_Wrap2, mchcModal__ } from '@lm_fe/pages';
import { use_provoke } from '@lm_fe/provoke';
import { IMchc_Doctor_Diagnoses, IMchc_Doctor_OutpatientHeaderInfo, IMchc_Doctor_RvisitInfoOfOutpatient, IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit, IMchc_FormDescriptions_Field } from '@lm_fe/service';
import { cloneDeep, copyText, expect_array, get, isObject, isString, request } from '@lm_fe/utils';
import { Button, Col, message, Popconfirm, Row, Space, Tabs, Modal, Divider } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { filter_diagnoses } from '../../../.utils';
import { filter_fds } from '../../utils';
import styles from './index.module.less';
import { FurtherHistory } from './FurtherHistory'
interface IProps {
	diagnosesList: IMchc_Doctor_Diagnoses[]
	visitsData?: IMchc_Doctor_RvisitInfoOfOutpatient,
	headerInfo: IMchc_Doctor_OutpatientHeaderInfo,
	setDiagnosesList?(list: IMchc_Doctor_Diagnoses[]): void
	setFormData(v: Partial<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>): void
	toggle_fuck(): void
	fuck: boolean
	formData?: Partial<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>,
	furtherRefresh(): void
}

export default function FurtherTable(props: IProps) {
	const sys_theme = use_provoke(s => s.sys_theme)
	const { setFormData, setDiagnosesList, visitsData, furtherRefresh, formData, toggle_fuck, fuck, diagnosesList } = props;

	const preg_id = mchcUtils.single_id(visitsData);



	const [isModalOpen, setIsModalOpen] = useState(false)

	const { config, Wrap } = BF_Wrap2(
		{ default_conf: { title: '复诊-产检记录表格', tableColumns: () => import('./config') } },
		{ delete: () => { console.log('233') } } // 传递进来的方法
	)





	const filtered_rvisits = (visitsData?.rvisits ?? []).filter(_ => _.id)

	const form_config = filter_fds(diagnosesList, config?.tableColumns)
	const actionRender = (value: any, rowData: any, index: number) => {
		const disabled_save = rowData.isBanned!
		return (
			<>
				<Popconfirm
					title={`确定要删除这个病历吗?`}
					onConfirm={() => handleDelete(rowData)}
					okText="确定"
					cancelText="取消"
					disabled={disabled_save}
				>
					<Button type="link" size="small" disabled={disabled_save} danger icon={<MyIcon value='DeleteOutlined' />}>
						删除
					</Button>
				</Popconfirm>
			</>
		);
	}
	const handleDelete = async (rowData: any) => {
		await request.delete(`/api/prenatal-visits/${get(rowData, 'id')}`);
		message.success(`删除成功`);
		props.furtherRefresh()
	}

	for (let i = 0; i < form_config.length; i++) {
		if (form_config[i].dataIndex == 'action' || form_config[i].title == '操作') {
			form_config[i].render = actionRender
			break;
		}
	}
	async function handlePrint() {

		mchcModal__.open('print_modal', {
			modal_data: {
				requestData: {
					url: '/api/pdf-preview',
					id: preg_id,
					resource: 'prenatalRVisit'
				}
			}
		})
	};

	const renderModal = () => {
		return (
			<Modal
				open={isModalOpen}
				onCancel={() => setIsModalOpen(false)}
				width={'90%'}
				styles={{ body: { height: '80vh', overflowY: 'auto' } }}
				footer={null}
				centered
			>
				{renderTableMore()}
			</Modal>
		)
	}
	const renderTableMore = () => {
		return (
			<Tabs >
				<Tabs.TabPane key={2} tab={<><MyIcon value='TableOutlined' />表格</>}>
					{renderTable(true)}
				</Tabs.TabPane>
				<Tabs.TabPane style={{}} key={1} tab={<><MyIcon value='FileTextOutlined' />文档</>}>
					<FurtherHistory visitsData={visitsData} />
				</Tabs.TabPane>

			</Tabs>
		)
	}


	const renderTable = (isAll = false) => {
		return <Wrap>
			<Table_L
				bordered
				title={
					isAll ? undefined : () => (
						<div className={styles['btn-wrap']}>
							<Space>
								<OkButton onClick={toggle_fuck} shape='circle' type='text' icon={fuck ? <MyIcon value='RightOutlined' /> : <MyIcon value='LeftOutlined' />} />
								<span>共 {filtered_rvisits.length} 条记录</span>
							</Space>
							<Space>
								<OkButton type="text" size="small" onClick={furtherRefresh} >
									刷新
								</OkButton>
								<OkButton type="text" size="small" onClick={handlePrint} >
									打印
								</OkButton>
								{/* <OkButton type='text' size="small" onClick={() => mchcModal__.open('modal_page', { modal_data: { content: renderTableMore() } })}> */}
								<OkButton type='text' size="small" onClick={() => setIsModalOpen(true)}>
									更多...
								</OkButton>
							</Space>
						</div>
					)
				}
				scroll={isAll ? undefined : { y: 160 }}
				pagination={false}
				size={isAll ? 'large' : 'small'}
				// rowSelection={{
				//     selectedRowKeys: selectKeys,
				//     onChange(keys, rows) {
				//         mchcLogger.log({ keys, rows })
				//         set_selectKeys(keys)
				//         set_selectRows(rows)
				//     }
				// }}

				onRow={(record) => {
					const is_target = record.id === formData?.id
					const background = is_target ? sys_theme.colors?.light[2] : undefined
					const cursor = is_target ? undefined : 'pointer'
					const color = is_target ? '#fff' : undefined
					return {
						style: { background, cursor, color },
						onClick(event) {

						},
						onDoubleClick() {
							setFormData(record);
							mchcModal__.pop()
							const __diagnoses = filter_diagnoses(visitsData?.diagnoses)


							setDiagnosesList?.(__diagnoses);
						},

					};
				}}
				// rowClassName={r => {
				//     return r.id === formData?.id ? styles['selected-row'] : ''
				// }}
				rowHoverable={false}
				rowKey={'id'}
				dataSource={isAll ? filtered_rvisits : filtered_rvisits.slice(0, 5)}
				columns={form_config}
			/>
		</Wrap>

	}
	return (
		<div style={{ marginBottom: 8 }} className={styles['FurtherTable']}>
			<MyLazyComponent size='middle'>

				{renderTable()}


			</MyLazyComponent>
			{renderModal()}
		</div>
	);
}
