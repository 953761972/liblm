import React, { FC, useEffect, useState } from 'react';
import {
  IModel_EarlyPregnancyCheckSurgeryType,
  SModel_EarlyPregnancyCheckSurgeryType
} from '../../../../.stupid_model';
import Form0, { TCommonData } from './Form0';
import Form1 from './Form1';
import StepModal from './StepModal';
interface IProps {
  step: number;
  data: Partial<IModel_EarlyPregnancyCheckSurgeryType>;
}
export const BookingModalNew: FC<IProps> = (props) => {
  const { step, data } = props;
  const [commonData, setCommonData] = useState<TCommonData>();

  useEffect(() => {

    Promise.all([SModel_EarlyPregnancyCheckSurgeryType.getOptionalDoctorAndNurse()]).then((arr) => {
      setCommonData({
        data,
        optionalDoctor: arr[0].DOCTOR,
        optionalNurse: arr[0].NURSE,
      });
    });

    return () => { };
  }, [data]);

  return (
    <StepModal<TCommonData, any>
      title="手术进度"
      initData={commonData}
      step={step}
      data={[
        { title: '手术预约', Component: Form0 },
        { title: '术前签到', Component: Form1 },

        // { title: '手术病历', Component: Form2 },
      ]}
    />
  );
};
export default BookingModalNew;
