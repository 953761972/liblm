import dilatationAndCurettage from './Curettage';
import { conf_刮宫术 } from './Curettage/conf';
import putInIntrauterineDevice from './Place';
import { conf_宫内避孕器放置术 } from './Place/conf';
import inducedAbortion from './Pressure';
import { conf_人工流产 } from './Pressure/conf';
import takeOutIntrauterineDevice from './TakeOut';
import { conf_宫内节育器取出术 } from './TakeOut/conf';
import uterineFallopianTubeFluid from './Uterus';
import { conf_子宫输卵管通液术 } from './Uterus/conf';

export const 妇科专病_手术病历_mapping = {
  dilatationAndCurettage: {
    key: 'dilatationAndCurettage',
    name: '刮宫术',
    icon: '',
    // component: dilatationAndCurettage,
    conf: conf_刮宫术
  },

  putInIntrauterineDevice: {
    key: 'putInIntrauterineDevice',
    name: '宫内避孕器放置术',
    icon: '',
    // component: putInIntrauterineDevice,
    conf: conf_宫内避孕器放置术

  },
  takeOutIntrauterineDevice: {
    key: 'takeOutIntrauterineDevice',
    name: '宫内节育器取出术',
    icon: '',
    // component: takeOutIntrauterineDevice,
    conf: conf_宫内节育器取出术

  },
  uterineFallopianTubeFluid: {
    key: 'uterineFallopianTubeFluid',
    name: '子宫输卵管通液术',
    icon: '',
    // component: uterineFallopianTubeFluid,
    conf: conf_子宫输卵管通液术

  },
  inducedAbortion: {
    key: 'inducedAbortion',
    name: '人工流产',
    icon: '',
    // component: inducedAbortion,
    conf: conf_人工流产

  },
  // Puberty: {
  //   key: 'Puberty',
  //   name: '清宫术',
  //   icon: '',
  //   api: '/api/labour-records',
  //   component: Curettage,
  // },
  // vaginoscopy: {
  //   key: 'vaginoscopy',
  //   name: '阴道镜检查',
  //   icon: '',
  //   component: vaginoscopy,
  // },
  // hysteroscopicSurgery: {
  //   key: 'hysteroscopicSurgery',
  //   name: '宫腔镜手术',
  //   icon: '',
  //   component: hysteroscopicSurgery,
  // },
  // vulvarCystStoma: {
  //   key: 'vulvarCystStoma',
  //   name: '外阴囊肿造口术',
  //   icon: '',
  //   component: vulvarCystStoma,
  // },
  // uterosalpingography: {
  //   key: 'uterosalpingography',
  //   name: '子宫输卵管照影术',
  //   icon: '',
  //   component: uterosalpingography,
  // },
};
