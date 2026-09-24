import { FC, PropsWithChildren } from 'react';
import { DoctorEnd_HeaderInfo, IHeaderInfoProps } from '../HeaderInfo';
import React, { lazy } from 'react';
export const DoctorEnd_HeaderInfoLayout: FC<PropsWithChildren<IHeaderInfoProps>> = function HeaderInfoLayout(props) {



  return (
    <div style={{ height: '100%' }}>
      <DoctorEnd_HeaderInfo {...props} />
      <div
        style={{ height: `calc(100% - 74px)` }}
      >
        {props.children}
      </div>
    </div>
  );
}




