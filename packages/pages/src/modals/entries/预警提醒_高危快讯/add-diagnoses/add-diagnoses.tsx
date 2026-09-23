import { mchcEnv, mchcEvent } from '@lm_fe/env';
import { IMchc_Doctor_Diagnoses, IMchc_Doctor_OutpatientHeaderInfo, IMchc_TemplateTree_Item, SMchc_Doctor } from '@lm_fe/service';
import { Input, message } from 'antd';
import { cloneDeep, forEach, get, isString, map, set, size } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
interface IProps {
  headerInfo?: IMchc_Doctor_OutpatientHeaderInfo;
  diagnosesTemplate: IMchc_TemplateTree_Item[];
  handelProcess: Function; // 把漏诊提醒标为已经处置
  diagId: any;
  setDiagnosesList?(v: IMchc_Doctor_Diagnoses[]): void
  diagnosesList?: IMchc_Doctor_Diagnoses[]
  page?: 'return'
}
export default function AddDiagnoses({ handelProcess, diagId, diagnosesTemplate, ...props }: IProps) {
  const timer: any = useRef();
  const [template, setTemplate] = useState(diagnosesTemplate); // 模板

  useEffect(() => {
    setTemplate(diagnosesTemplate);
  }, [diagnosesTemplate]);
  function findMaxSort() {
    let max: any = 0;
    map(diagnosesTemplate, (item) => {
      const sort = get(item, `sort`);
      if (sort > max) {
        max = sort;
      }
    });
    return max + 1;
  }

  function handleSure(item: IMchc_TemplateTree_Item) {
    const id = props.headerInfo?.id ?? '0'
    let postdata: Partial<IMchc_Doctor_Diagnoses> = {
      diagnosis: '',
      diagnosisCode: '',
      highrisk: false,
      note: '',
      sort: findMaxSort(),
      outEmrId: +id,
      pregnancyId: +id,
      clear: true,
      // createDate: formatTimeToStandard(new Date()),
    };
    if (item) {
      if (!isString(item) && size(item.children) > 0) return;
      if (isString(item)) {

        set(postdata, `diagnosis`, item);
      } else {

        set(postdata, 'diagnosis', get(item, 'val'));
        set(postdata, 'diagnosisCode', get(item, 'code')); //diagnosisCode
      }
      addDiag(postdata);
    }
  }
  function handleChange(e: any) {
    if (timer.current) clearTimeout(timer.current);
    let value = e.target.value;
    console.log({ value });
    timer.current = setTimeout(() => {
      if (value == '') {
        setTemplate(diagnosesTemplate);
      } else {
        let newTemplate = diagnosesTemplate.filter((item: any) => {
          let str = get(item, 'val');
          return str.search(value) != -1;
        });
        setTemplate(newTemplate);
      }
    }, 500);
  }
  function hasKeyword(val: string, arr: any[]) {
    let bool = false;
    forEach(arr, (item) => {
      if (
        (isString(item) && val.indexOf(item) !== -1) ||
        (!isString(item) && val.indexOf(item.hasWord) !== -1 && val.indexOf(item.withoutWord) === -1)
      ) {
        bool = true;
      }
    });
    return bool;
  }
  async function addDiag(diagnosisObj: Partial<IMchc_Doctor_Diagnoses>) {


    const {
      diagnosesList = [],
      headerInfo,
      setDiagnosesList,
      page,
    } = props;
    const diag = get(diagnosisObj, 'diagnosis') ?? '';

    if (diagnosesList.filter((item: any) => item.diagnosis === diag).length === 0) {
      const res = await SMchc_Doctor.new_Diagnosis(diagnosisObj);
      const data = res || diagnosisObj;
      mchcEnv.success('添加成功！');
      mchcEvent.emit('outpatient', { type: '添加修改诊断', diagnoses: data })
      handelProcess(diagId);
      const newList = cloneDeep(diagnosesList);
      setDiagnosesList?.([...newList, data]);

      mchcEvent.emit('outpatient', { type: '刷新头部', })
      // setTimeout(() => {

      // }, 5 * 1000);

      /**诊断对应的专案管理弹窗*/
      if (diag === '瘢痕子宫' || diag === '疤痕子宫') {
        const currentGestationalWeek = parseInt(get(headerInfo, 'gesweek') ?? '');
        if (currentGestationalWeek >= 32) {
          mchcEvent.emit('outpatient', { type: '弹窗', modal_name: '瘢痕子宫阴道试产表' })
        }
      }
      const screeningArr = ['血栓', 'VTE', '梗', '静脉曲张'];
      if (hasKeyword(diag, screeningArr) || diag === '妊娠子痫前期' || diag === '多胎妊娠') {
        mchcEvent.emit('outpatient', { type: '弹窗', modal_name: '深静脉血栓高危因素孕期用药筛查表' })

      }
      if (diag.indexOf('梅毒') > -1) {
        mchcEvent.emit('outpatient', { type: '弹窗', modal_name: '梅毒管理' })

      }
      const preeclampsiaArr = [
        '双胎',
        '多胎',
        '胎妊娠',
        '慢性高血压',
        '型糖尿病',
        { hasWord: '尿毒症', withoutWord: '胎' },
        { hasWord: '肾炎', withoutWord: '胎' },
        { hasWord: '肾衰竭', withoutWord: '胎' },
        { hasWord: '肾病', withoutWord: '胎' },
        { hasWord: '肾积水', withoutWord: '胎' },
        { hasWord: '肾盂积水', withoutWord: '胎' },
        { hasWord: '肾小管', withoutWord: '胎' },
        { hasWord: '肾硬化', withoutWord: '胎' },
        '红斑狼疮',
        '抗磷脂综合征',
      ];
      if (page === 'return' && hasKeyword(diag, preeclampsiaArr)) {
        mchcEvent.emit('outpatient', { type: '弹窗', modal_name: '子痫前期风险评估表' })
      }
    } else {
      message.warning('添加诊断重复！');
    }
  }
  return (
    <div className={styles["diagnones-container"]}>
      <Input
        className={styles["diag-ipt"]}
        placeholder="请输入筛选过滤诊断信息"
        // enterButton="查询"
        onChange={handleChange}
      //   onSearch={this.handleSearch}
      />
      <div className={styles["diagnoses-content"]}>
        {map(template, (item, index) => {
          return (
            <p className={styles["diag-tiem"]}>
              <span onClick={() => handleSure(item)}>
                {get(item, 'code') ? '（icd）' : null}
                {get(item, 'val')}
              </span>
            </p>
          );
        })}
      </div>
    </div>
  );
}
