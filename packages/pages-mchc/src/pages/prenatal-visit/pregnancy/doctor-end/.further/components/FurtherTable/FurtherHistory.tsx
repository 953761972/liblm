import { MyIcon } from '@lm_fe/components';
import { OkButton } from '@lm_fe/components_m';
import { mchcEnv } from '@lm_fe/env';
import { BF_Wrap2 } from '@lm_fe/pages';
import { use_provoke } from '@lm_fe/provoke';
import { IMchc_Doctor_RvisitInfoOfOutpatient, IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit, IMchc_FormDescriptions_Field } from '@lm_fe/service';
import { cloneDeep, copyText, expect_array, get, isEmpty, isObject, isString } from '@lm_fe/utils';
import { Divider, Empty } from 'antd';
import React from 'react';
import m_styles from './FurtherHistory.module.less'
interface IProps {
	visitsData?: IMchc_Doctor_RvisitInfoOfOutpatient,

}

export function FurtherHistory(props: IProps) {
	const { visitsData, } = props;
	const { styles } = use_provoke(c => c.config)



	const { config: tableConfig, Wrap: TableWrap } = BF_Wrap2(
		{ default_conf: { title: '复诊-产检记录表格文档', tableColumns: () => import('./tableConfig') } },
	)



	const filtered_rvisits = (visitsData?.rvisits ?? []).filter(_ => _.id)
	const tableContentColumns = expect_array<IMchc_FormDescriptions_Field>(tableConfig?.tableColumns)


	const reverseRvisit = cloneDeep(filtered_rvisits)?.reverse() || []
	const renderContent = (rowData: IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit) => {
		const configformArrayList: any[] = [];
		let Columnsarr = [];
		for (let i = 0; i < tableContentColumns.length; i++) {
			Columnsarr.push(tableContentColumns[i]);
			if (tableContentColumns[i + 1] && tableContentColumns[i + 1].isNewRow) {
				configformArrayList.push(Columnsarr);
				Columnsarr = []
			} else if (i == tableContentColumns.length - 1) {
				// 去到最后一步
				configformArrayList.push(Columnsarr);
			}
		}

		const contentArr: any = []
		configformArrayList.map((ArrayList, index) => {
			contentArr.push(
				<div key={index} style={{}}>
					{ArrayList.map((config: any) => {
						const value = get(rowData, config.dataIndex)
						const title = get(config, 'title')
						let text = config.render ? config.render(value, rowData) : value;
						if (!text) {
							return <></>
						}
						return (
							<span className={m_styles['copy-block']}>
								<span style={{ fontWeight: 'bold', }}>{title}:</span>
								<span >
									<span className={m_styles['copy-txt']}>{text}</span>
									{
										get(config, 'with_copy')
											? <OkButton type='text' title='复制' onClick={() => copy(text, title)} icon={<MyIcon value='CopyOutlined' />} />
											: null
									}

								</span>

							</span>
						)
					})}
				</div>
			)
		})
		return contentArr
	}

	function copy(text: any, title: any) {
		if (isString(text)) {
			copyText(text)
		} else if (isObject(text) && isString(get(text, 'children'))) {
			copyText(get(text, 'children'))
		} else {
			mchcEnv.success('复制失败！请手动复制')
			return
		}

		mchcEnv.success(title + '复制成功')
	}


	if (isEmpty(reverseRvisit))
		return <Empty />
	return (
		<TableWrap>
			{reverseRvisit.map((data) => {
				return (
					<div style={{ marginLeft: 12 }}>

						<div style={{ fontWeight: 'bold', color: styles?.colorPrimary }}>
							<span><MyIcon value='ClockCircleOutlined' style={{ marginRight: 6 }} />{data.visitDate}</span>
							<span style={{ marginLeft: 8 }}>{data.gestationalWeek}周</span>
						</div>

						{renderContent(data)}
						<Divider size='small' />
					</div>

				)
			})}
		</TableWrap>
	);
}
