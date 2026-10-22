import { MyBaseList } from '@lm_fe/pages';
import React from 'react';



export default function List(props: {}) {




  return <MyBaseList
    table_preset={{
      title: `视频库-列表`,
      tableColumns: () => import('./form_config'),
      name: '/api/videos',
      searchParams: { 'sort': 'id,desc' },
      beforeSubmit: (v: any) => (v),
      searchConfig: [
        {
          name: 'title',
          label: '标题',
        },
      ]
    }}
  />
}




