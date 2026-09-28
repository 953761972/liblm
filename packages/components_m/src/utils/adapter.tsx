/*
 * @Date: 2021-03-24 20:54:41
 * @Descriptions: 表单配置、数据处理
 */
import { map, get, reduce, concat, keyBy, set, isObject, isEmpty, isNil } from 'lodash';
import dayjs from 'dayjs';
import { formatDate, safe_json_parse } from '@lm_fe/utils';
import { IMchc_FormDescriptions, IMchc_FormDescriptions_Field, IMchc_FormDescriptions_Field_Nullable_Arr } from '@lm_fe/service';
export const formDescriptionsFromApi = (data: any[]) => {
  return map(data, (item) => {
    return {
      ...item,
      fields: map(get(item, 'fields') ?? get(item, 'children'), (field) => {
        const key = get(field, 'key') as string;
        let name = key;
        let label = get(field, 'label');

        if (key && key.startsWith('.')) {
          name = key.substring(1);
        }
        // TODO: 主要也是为了兼容 key 为空的时候
        if (isEmpty(key) || isNil(key)) {
          name = get(field, 'label')!;
          label = '';
        }
        const rules = isEmpty(safe_json_parse(get(field, 'rules'))) ? [] : safe_json_parse(get(field, 'rules'));
        let needValidate = false;
        map(rules, (rule, key) => {
          if (get(rule, 'required')) {
            needValidate = true;
          }
        });
        if (needValidate && get(safe_json_parse(get(field, 'tranferRules')), 'type') === 'key_and_keyNote') {
          rules.push(() => ({
            validator(rule: any, value: any) {
              if (!isNil(get(value, 'key'))) {
                return Promise.resolve();
              }
              return Promise.reject(`请输入${label}`);
            },
          }));
        }
        return {
          ...field,
          label,
          name,
          hidden: !get(field, 'isActive') ? true : false,
          input_type: get(field, 'inputType'),
          special_config: get(field, 'specialConfig'),
          tranfer_rules: get(field, 'tranferRules'),
          inputProps: safe_json_parse(get(field, 'inputProps')),
          input_props: safe_json_parse(get(field, 'inputProps')),
          form_item_layout: get(field, 'formItemLayout'),
          formItemLayout: safe_json_parse(get(field, 'formItemLayout')),
          rules,
          styles: safe_json_parse(get(field, 'styles')),
        };
      }),
    };
  });
};

/**
 * 合并form field各个section模块，
 * @param formDescriptions api原始表单信息
 * @returns object[]
 */
export function formDescriptionsWithoutSectionApi<RAW = false>(formDescriptions: any) {
  return keyBy(
    reduce(
      formDescriptions,
      (sum, formDescription) => {
        const arr = get(formDescription, 'fields') ?? get(formDescription, 'children') ?? []
        return concat(sum, arr);
      },
      [] as any,
    ),
    'key',
  );
};
export const transferDataToFormByRules = (data: any, nativeFormDescription: any[]) => {
  const result = {};
  map(nativeFormDescription, (desctiption, key) => {
    const { tranfer_rules: tranferRules } = desctiption;
    let type = 'default';
    let path = key;
    if (safe_json_parse(tranferRules)) {
      const tranferRulesJson = safe_json_parse(tranferRules);
      type = get(tranferRulesJson, 'type') ? get(tranferRulesJson, 'type') : 'default';
      path = get(tranferRulesJson, 'path') ? get(tranferRulesJson, 'path') : key;
    }

    switch (type) {
      case 'stage':
        set(result, `${key}.0`, get(data, `${key}h`));
        set(result, `${key}.1`, get(data, `${key}m`));
        break;
      case 'moment':
        set(result, key, dayjs(get(data, path)));
        break;
      case 'default':
      default:
        set(result, key, get(data, path));
        break;
    }
  });
  return result;
};
export const fromApi = (data: any, nativeFormDescriptions: { [x: string]: any }) => {
  const result = { ...data };
  map(nativeFormDescriptions, (desctiption, key) => {
    const { tranfer_rules: tranferRules, inputType } = desctiption;
    let type = 'default';
    let path = key;
    if (safe_json_parse(tranferRules)) {
      const tranferRulesJson = safe_json_parse(tranferRules);
      type = get(tranferRulesJson, 'type') ? get(tranferRulesJson, 'type') : 'default';
      path = get(tranferRulesJson, 'path') ? get(tranferRulesJson, 'path') : key;
    }
    switch (type) {
      case 'key_and_keyNote':
        set(result, `${key}.key`, get(data, path));
        set(result, `${key}.keyNote`, get(data, `${path}Note`));
        break;
      case 'stage':
        set(result, `${key}.0`, get(data, `${key}h`));
        set(result, `${key}.1`, get(data, `${key}m`));
        break;
      case 'apgar':
        map(get(data, 'noenateRecord'), (record, index) => {
          set(result, `${key}.${index}.apgar1`, get(record, 'apgar1'));
          set(result, `${key}.${index}.apgar5`, get(record, 'apgar5'));
          set(result, `${key}.${index}.apgar10`, get(record, 'apgar10'));
        });
        break;
      case 'moment':
        set(result, key, get(data, path) ? dayjs(get(data, path)) : undefined);
        break;
      case 'default':
      default:
        set(result, key, get(data, path));
        break;
    }
    // radio_input组件数据处理
    if (inputType === 'radio_input') {
      const k = key.split('.').pop();
      const obj = {
        [k!]: get(data, key),
        [`${k}Note`]: get(data, `${key}Note`),
      };
      set(result, key, obj);
      delete result[`${k}Note`];
    }
  });
  return {
    ...result,
    id: get(data, 'id'),
  };
};
export const toApi = (data: any, nativeFormDescriptions: { [x: string]: any }) => {
  // 先过滤 object 类型
  const isObjectKeyArray: any[] = [];
  const isNotObjectKeyArray: any[] = [];
  map(data, (item, key) => {
    if (isObject(item)) {
      isObjectKeyArray.push(key);
    } else {
      isNotObjectKeyArray.push(key);
    }
  });
  let result = {};
  const dataKeys: any[] = [...isObjectKeyArray, ...isNotObjectKeyArray];

  // TODO: 特殊情况，是否能自动化？
  // TODO: 修改的时候，没有携带 noenateRecords ID
  set(result, 'noenateRecords', get(data, 'fetusAppendages'));

  // 如果是对象的情况下
  map(dataKeys, (key) => {
    const item = get(data, key);
    const tranferRules = get(nativeFormDescriptions, key)?.tranfer_rules;

    let type = 'default';
    let path = key;
    if (safe_json_parse(tranferRules)) {
      const tranferRulesJson = safe_json_parse(tranferRules);
      type = get(tranferRulesJson, 'type') ? get(tranferRulesJson, 'type') : 'default';
      path = get(tranferRulesJson, 'path') ? get(tranferRulesJson, 'path') : key;
    }
    switch (type) {
      case 'key_and_keyNote':
        set(result, path, get(item, 'key'));
        set(result, `${path}Note`, get(item, 'keyNote'));
        break;
      case 'stage':
        set(result, `${key}h`, Number(get(item, '0')));
        set(result, `${key}m`, Number(get(item, '1')));
        break;
      case 'apgar':
        map(get(data, 'noenateRecord'), (record, index) => {
          set(result, `${key}.${index}.apgar1`, get(record, 'apgar1'));
          set(result, `${key}.${index}.apgar5`, get(record, 'apgar5'));
          set(result, `${key}.${index}.apgar10`, get(record, 'apgar10'));
        });
        break;
      case 'moment':
        set(result, path, item ? formatDate(item) : undefined);
        break;
      case 'fetusAppendages':
        break;
      case 'default':
      default:
        set(result, path, item);
        break;
    }
  });

  map(nativeFormDescriptions, (item, key) => {
    const { inputType } = item;
    const itemVaule = get(data, key);

    switch (inputType) {
      case 'radio_input':
        const k = key.split('.').pop();
        set(result, key, get(itemVaule, `${k}`));
        set(result, `${key}Note`, get(itemVaule, `${k}Note`));
        break;
      case 'checkbox_with_single_input':
        set(result, key, get(itemVaule, 'key'));
        set(result, `${key}Note`, get(itemVaule, 'keyNote'));
        break;
      default:
        break;
    }
  });

  return result;
};
