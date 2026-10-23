import { Steps, Form, Button, Modal, Space } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { StepProps } from 'antd/lib/steps';
import React, { ComponentType, useEffect, useState } from 'react';
import { get } from 'lodash';
// import useFrom from './useForm'
interface IData<T, FORM_T = any> extends StepProps {
  Component: IStepFormComponentType<T, FORM_T>;
}
interface IProps<T, FORM_T = any> {
  data: IData<T, FORM_T>[];
  initData?: T;
  step?: number;
}
export type IStepFormComponentType<T, FORM_T = any> = ComponentType<{
  form: FormInstance<FORM_T>;
  onNext?: () => void;
  commonData?: T;
  setCommonData: React.Dispatch<React.SetStateAction<T | undefined>>;
}>;

interface Lengthwise { }

const StepFrom = function <T extends Lengthwise, FORM_T = any>(props: IProps<T, FORM_T>) {
  const { data, step, initData } = props;
  const [currentStep, setCurrentStep] = useState(step || 0);

  const forms = Array(data.length)
    .fill(0)
    .map((_) => Form.useForm()[0]);
  const [commonData, setCommonData] = useState<T | undefined>();

  useEffect(() => {
    if (initData) {
      setCommonData(initData);
    }
  }, [initData]);

  return (
    <>
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        {data.map(({ title, subTitle, description }, idx) => {
          return <Steps.Step key={idx} title={title} subTitle={subTitle} description={description} />;
        })}
      </Steps>
      {data.map(({ Component }, idx) => {
        return (
          <div hidden={currentStep !== idx} key={idx}>
            <Component commonData={commonData} setCommonData={setCommonData} form={forms[idx]} />
          </div>
        );
      })}
      <Space style={{ width: '100%', paddingTop: 12, justifyContent: 'center' }}>
        <Button
          type="primary"
          hidden={currentStep === 0}
          onClick={() => setCurrentStep(currentStep - 1)}
        >
          上一页
        </Button>
        <Button
          type="primary"
          hidden={currentStep === data.length - 1}
          onClick={() =>
            (forms[currentStep] as any)?._validateFields()?.then(() => {
              setCurrentStep(currentStep + 1);
            })
          }
        >
          下一页
        </Button>
        <Button
          type="primary"
          hidden={get(initData, 'data.progressStatus') === 3 || get(initData, 'data.progressStatus') === 4}
          onClick={() => (forms[currentStep] as any)?._save()}
        >
          {(get(initData, 'data.progressStatus') === 0 || get(initData, 'data.progressStatus') === 2) &&
            currentStep === 1
            ? '保存并签到'
            : '保存'}
        </Button>
      </Space>
    </>
  );
};
export default StepFrom;
