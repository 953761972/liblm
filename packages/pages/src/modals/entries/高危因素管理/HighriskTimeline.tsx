import {
  IMchc_Doctor_RiskRecordsOfOutpatient,
  IMchc_HighriskGradeConfig,
  SMchc_Doctor,
  TIdTypeCompatible
} from '@lm_fe/service';
import { formatDate, getSearchParamsValue } from '@lm_fe/utils';
import { Empty, Timeline } from 'antd';
import classNames from 'classnames';
import {
  cloneDeep,
  isEmpty,
  map,
  orderBy
} from 'lodash';
import React, { useEffect, useState } from 'react';
import styles from './index.module.less';
interface IProps {
  id?: TIdTypeCompatible
  gradeOptions?: IMchc_HighriskGradeConfig[]
  contagionColor?: string
}
export function HighriskTimeline_高危因素管理(props: IProps) {
  const { id, gradeOptions, contagionColor } = props

  const [riskRecords, set_riskRecords] = useState<IMchc_Doctor_RiskRecordsOfOutpatient[]>([])





  useEffect(() => {

    SMchc_Doctor.getRiskRecordsOfOutpatient(id ?? getSearchParamsValue('id'))
      .then(set_riskRecords)

    return () => {

    }
  }, [])
















  function getGradeColor(grade: any) {
    grade = grade ?? 'I';
    const target = gradeOptions?.find(_ => _.label === grade)
    return target?.color;
  };

  function getGradeColorText(grade: any) {
    grade = grade ?? 'I';
    const target = gradeOptions?.find(_ => _.label === grade)
    return target?.colorText;
  };








  let newRiskRecords = cloneDeep(riskRecords);
  newRiskRecords = orderBy(riskRecords, ['eventDate'], ['desc']);

  return (
    isEmpty(newRiskRecords) ? (
      <Empty description="暂无高危记录" />
    ) : (
      <Timeline mode="left" className={styles["highrisk-timeline"]}>
        {map(newRiskRecords, (item) => (
          <Timeline.Item>
            <div className={styles["record-left"]}>
              <div className={styles["record-grade"]} style={{ background: getGradeColor(item.highriskGrade) }}>
                {getGradeColorText(item.highriskGrade)}
              </div>
              <div className={styles["record-week"]}>{item.gestationalWeek ? `孕${item.gestationalWeek}周` : ''}</div>
            </div>
            <div className={styles["record-right"]}>
              <div className={styles["record-item"]}>
                <div className={styles["item-label"]}>评定日期：</div>
                <div className={styles["item-note"]}>{formatDate(item.eventDate)}</div>
              </div>
              <div className={classNames(styles['record-item'],)}>
                <div className={styles["item-label"]} style={{ background: !!item.infectionNote ? contagionColor : '' }}>
                  传染病：
                </div>
                <div className={styles["item-note"]}>{item.infectionNote || '无'}</div>
              </div>
              <div className={styles["record-item"]}>
                <div className={styles["item-label"]}>高危因素：</div>
                <div className={styles["item-note"]}>{item.highriskNote || '无'}</div>
              </div>

              <div className={styles["record-item"]}>
                <div className={styles["item-label"]}>评定医生：</div>
                <div className={styles["item-note"]}>{item.doctor}</div>
              </div>
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
    )
  );
}

// console.dir("mapStateToProps",mapStateToProps);


