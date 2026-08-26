import { Timeline } from 'antd';
import { get, map } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './index.less';
import { TIdType, TIdTypeCompatible } from '@lm_fe/service';
import { mchcEvent } from '@lm_fe/env';
import { request } from '@lm_fe/utils';
interface Iprops {
  id: TIdTypeCompatible;
}
export default function PrenatalTree({ id, ...props }: Iprops) {
  const history = useHistory();
  const [prenatalTreeData, set_prenatalTreeData] = useState(null)

  const handleClick = useCallback((key: string, id?: string) => {
    if (id) {
      history.push('/deliver-management-v2/admission/deliver-edit?id=' + id);
    } else {
      mchcEvent.emit('outpatient', { type: '切换医生Tab', key })
    }
  }, []);
  useEffect(() => {

    initTreeData()
    return () => {

    }
  }, [])
  async function initTreeData() {
    if (prenatalTreeData) return;
    let data: any = (await request.get('/api/doctor/getExamTree?id=' + id)).data;
    data = data.sort((a: any, b: any) => a.date < b.date ? 1 : a.date > b.date ? -1 : 0)
    set_prenatalTreeData(data)
  }
  return (
    <Timeline style={{ padding: 12 }}>
      {map(prenatalTreeData, (item, index) => {
        return (
          <Timeline.Item dot={<Dot type={get(item, `type`)} dateGap={get(item, `dateGap`)}></Dot>}>
            <PrenatalInfo handleClick={handleClick} item={item} />
          </Timeline.Item>
        );
      })}
    </Timeline>
  );
}
function PrenatalInfo({ item, ...props }: any) {
  const handleClick = useCallback((type, id?: string) => {
    return () => {
      props && props.handleClick(type, id);
    };
  }, []);
  return (
    <div className="prenatal-info-content">
      <div className="flex">
        <span>{get(item, `date`)}</span>
        <span>{get(item, `gesweek`)}</span>
        <span>{get(item, `doctor`)}</span>
      </div>
      <div className="flex-start">
        {get(item, `inpatientEmrId`) && (
          <span className="hospital" onClick={handleClick('hospital', get(item, `inpatientEmrId`))}>
            住院病例
          </span>
        )}
        {get(item, `labExams`) && (
          <span className="checkout" onClick={handleClick('SurveyReport')}>
            检验报告
          </span>
        )}
        {get(item, `imageExams`) && (
          <span className="image" onClick={handleClick('ImageReport')}>
            影像报告
          </span>
        )}
      </div>
    </div>
  );
}
/**
 * value = "产检类型（0-首检，1-复检，3-助产士门诊，4-产前诊断，5-住院"
 */
const Type = {
  0: {
    name: '首',
    class: 'color1',
  },
  1: {
    name: '复',
    class: 'color2',
  },
  4: {
    name: '胎',
    class: 'color3',
  },
  5: {
    name: '住',
    class: 'color4',
  },
  3: {
    name: '助',
    class: 'color5',
  },
};
function Dot(props: any) {
  return (
    <div className={`dot-content ${get(Type, `[${props.type}].class`, 0)}`}>
      {get(Type, `[${props.type}].name`)} <span className="dateGap">{get(props, `dateGap`)}</span>
    </div>
  );
}
