import Screening from './Screening';
import PathologicalBiopsy from './PathologicalBiopsy';
import DrugAbortion from './DrugAbortion';
import Common from './Common';

export const NurseTypesMapping = {
  Common: {
    key: 'Common',
    name: '常规接诊',
    icon: '',
    api: '/api/labour-records',
    // component: Common,
    conf: () => import('./Common/form_config')
  },
  // Puberty: {
  //   key: 'Puberty',
  //   name: '青春期保健',
  //   icon: '',
  //   api: '/api/labour-records',
  //   component: Screening,
  // },
  Screening: {
    key: 'Screening',
    name: '早孕检查',
    icon: '',
    api: '/api/labour-records',
    component: Screening,
    conf: () => import('./Screening/form_config')

  },
  PathologicalBiopsy: {
    key: 'PathologicalBiopsy',
    name: '妇科肿瘤',
    icon: '',
    api: '/api/labour-records',
    component: PathologicalBiopsy,
    conf: () => import('./PathologicalBiopsy/form_config')

  },
  // Menopause: {
  //   key: 'Menopause',
  //   name: '更年期保健',
  //   icon: '',
  //   api: '/api/labour-records',
  //   component: PathologicalBiopsy,
  // },
  // DrugAbortion: {
  //   key: 'DrugAbortion',
  //   name: '药物流产',
  //   icon: '',
  //   api: '/api/labour-records',
  //   component: DrugAbortion,
  // },
};
