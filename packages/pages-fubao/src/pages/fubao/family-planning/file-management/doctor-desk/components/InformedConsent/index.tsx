import { CalendarOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Collapse, Form, List, Popconfirm, Row, message } from 'antd';
import classnames from 'classnames';
import { compact, find, first, get, isEmpty, keyBy, keys, last, map, replace, set, split, values } from 'lodash';
import dayjs from 'dayjs';
import { QRCode_L } from '@lm_fe/components';

import React, { Component } from 'react';
import { createInformedConsent, getInformedConsents, updateInformedConsent } from './method';
import { CaseTempleteEdit, DataSelect, deleteResourcesByID } from '@lm_fe/components_m';
import { SelectTip } from '@lm_fe/pages';

import { SLocal_Dictionary } from '@lm_fe/service';
import { getSearchParamsValue } from '@lm_fe/utils';
import { getTemplateById } from '@lm_fe/components_m';
import './index.less';
import { mchcEnv } from '@lm_fe/env';
const signStates = [
  { label: '已签', value: '1' },
  { label: '拒签', value: '2' },
];
const archiveStates = [
  { label: '已归档', value: '1' },
  { label: '未归档', value: '2' },
];
export class InformedConsent extends Component {
  state = {
    siderPanels: [],
    loading: true,
    informedConsent: {},
    isNew: false,
    qrCodeData: '',
  };

  async componentDidMount() {
    const siderPanels = await this.initData();
    let defaultActiveItem = last(first(values(siderPanels))) || {};
    defaultActiveItem = await this.addQRCode(defaultActiveItem);
    this.setState({
      informedConsent: defaultActiveItem,
    });
  }

  initData = async () => {
    const { id } = this.props;
    const pregnancyId = id || getSearchParamsValue('id')
    const siderPanels = this.mergeInformedConsentByDate(await getInformedConsents(pregnancyId));
    this.setState({
      siderPanels,
      loading: false,
    });
    return siderPanels;
  };

  mergeInformedConsentByDate = (informedConsents: any) => {
    const createDateKeys: Array<any> = compact(keys(keyBy(informedConsents, 'createDate')));
    const mergedInformedConsents = {};
    map(createDateKeys, (createDateKey) => {
      set(mergedInformedConsents, createDateKey, []);
    });
    map(informedConsents, (informedConsent) => {
      if (createDateKeys.indexOf(informedConsent.createDate) === -1) {
        return;
      }
      (mergedInformedConsents[informedConsent.createDate] as Array<any>).push(informedConsent);
    });
    return mergedInformedConsents;
  };

  handleSave = async (content: any) => {
    const { pregnancyData } = this.props;
    let { informedConsent } = this.state;
    const data = {
      ...informedConsent,
      content,
      pregnancy: pregnancyData,
      createDate: dayjs().utc().format(),
      documentTemplate: get(informedConsent, 'documentTemplate'),
    };
    if (informedConsent.id) {
      informedConsent = await updateInformedConsent(data);
    } else {
      informedConsent = await createInformedConsent(data);
    }
    mchcEnv.success('操作成功');
    this.setState({
      informedConsent,
    });
    this.initData();
  };

  handleAdd = () => {
    this.setState({
      isNew: true,
      informedConsent: {},
    });
  };

  handleClickListItem = (listItem: any) => async () => {
    const oldContent = get(listItem, 'content');
    const newContent = this.transferContent(oldContent);
    const newInformedConsent = await this.addQRCode({
      ...listItem,
      content: newContent,
    });
    this.setState({
      informedConsent: newInformedConsent,
    });
  };

  addQRCode = async (informedConsent: any) => {
    if (isEmpty(informedConsent) || get(informedConsent, 'content').indexOf('qrCodeImage') === -1) {
      return informedConsent;
    }
    const qrCodeData = {
      i: get(informedConsent, 'id'),
      d: get(informedConsent, 'createDate'),
      t: get(informedConsent, 'documentTemplate.title'),
      p: get(informedConsent, 'pregnancy.id'),
      o: get(informedConsent, 'pregnancy.organization.id'),
    };
    await this.setState({
      qrCodeData: JSON.stringify(qrCodeData),
    });
    const qrCode = document.getElementById('qrCode');
    const qrCodeImage = qrCode.toDataURL('image/png');
    let newContent = get(informedConsent, 'content');
    newContent = replace(newContent, 'qrCodeImage', qrCodeImage);
    set(informedConsent, 'content', newContent);
    return informedConsent;
  };

  transferContent = (oldContent: any) => {
    const { pregnancyData } = this.props;
    if (oldContent.indexOf('imageUrl') > -1) {
      set(pregnancyData, 'imageUrl', 'qrCodeImage');
    }
    const reg = /\[\{\{.+?\}\}\]/g;
    const result = oldContent.matchAll(reg);
    let newContent = oldContent;
    for (const item of result) {
      if (item) {
        const itemName = item[0].slice(3, -3);
        const itemNameSplits = split(itemName, '---');
        let label = get(pregnancyData, itemName);
        if (itemName === 'residenceAddress' || itemName === 'permanentResidenceAddress') {
          label = replace(label, '&', ',');
        }
        // 用 --- 从字典获取值
        if (itemNameSplits.length === 2) {
          const value = get(pregnancyData, itemNameSplits[0]);
          const options = SLocal_Dictionary.getDictionariesEnumerations(itemNameSplits[1])
          label = get(keyBy(options, 'value'), `${value}.label`);
        }
        newContent = newContent.replace(item[0], label || '   ');
      }
    }
    return newContent;
  };

  handleConsentChange = async (value) => {
    const { informedConsent } = this.state;
    const documentTemplate = await getTemplateById(value);
    const oldContent = get(documentTemplate, 'content');
    const newContent = this.transferContent(oldContent);
    this.setState({
      informedConsent: {
        ...informedConsent,
        content: newContent,
        documentTemplate,
      },
    });
  };

  handleSignStateChange = (signStates: any) => {
    const { informedConsent } = this.state;
    const oldSignState = get(informedConsent, 'signState');
    this.setState({
      informedConsent: {
        ...informedConsent,
        signState: find(signStates, (item) => item !== oldSignState),
      },
    });
  };

  handleArchiveChange = (archives: any[]) => {
    const { informedConsent } = this.state;
    const oldArchive = get(informedConsent, 'archive');
    this.setState({
      informedConsent: {
        ...informedConsent,
        archive: find(archives, (item) => item !== oldArchive),
      },
    });
  };

  handleDelete = (item: any) => async () => {
    const { informedConsent } = this.state;
    await deleteResourcesByID('/api/pregnancy-documents', get(item, 'id'));
    if (get(informedConsent, 'id') === get(item, 'id')) {
      this.setState({
        informedConsent: {},
      });
    }
    this.initData();
  };

  rendersiderPanels = () => {
    const { siderPanels, informedConsent, loading } = this.state;
    return (
      <Card
        loading={loading}
        size="small"
        bordered={false}
        title="文书列表"
        extra={
          <Button size="small" icon={<PlusOutlined />} onClick={this.handleAdd}>
            新增
          </Button>
        }
      >
        <Collapse defaultActiveKey={keys(siderPanels)}>
          {map(siderPanels, (siderPanel, key) => {
            return (
              <Collapse.Panel
                header={
                  <>
                    <CalendarOutlined /> {key}
                  </>
                }
                key={key}
              >
                <List
                  size="small"
                  dataSource={siderPanel}
                  renderItem={(item) => {
                    return (
                      <List.Item
                        className={classnames('patient-informed-consent-list__item', {
                          'patient-informed-consent-list__item_active': informedConsent.id === item.id,
                        })}
                      >
                        <span
                          className="patient-informed-consent-list__item-title"
                          onClick={this.handleClickListItem(item)}
                        >
                          {get(item, 'ititle')}
                        </span>
                        <Popconfirm
                          title="确定要删除这个文书吗?"
                          onConfirm={this.handleDelete(item)}
                          okText="确定"
                          cancelText="取消"
                        >
                          <DeleteOutlined />
                        </Popconfirm>
                      </List.Item>
                    );
                  }}
                />
              </Collapse.Panel>
            );
          })}
        </Collapse>
      </Card>
    );
  };

  render() {
    const { informedConsent, isNew, qrCodeData } = this.state;
    const {
      containerProps = { height: document.getElementsByClassName('prenatal-visit-main')[0]?.clientHeight },
      isAllPregnancies,
    } = this.props;

    return (
      <Row className="patient-informed-consent">
        <Col className="patient-informed-consent-list" span={5}>
          {this.rendersiderPanels()}
        </Col>
        <Col className="patient-informed-consent-detail" span={19}>
          <div style={{ display: 'none' }}>
            <QRCode_L id="qrCode" value={qrCodeData} size={80} />
          </div>
          {isEmpty(informedConsent) && !isNew ? (
            <SelectTip />
          ) : (
            <div className="patient-informed-consent-detail-block">
              <Row>
                <Form.Item label="知情同意书" className="doc-title">
                  <DataSelect
                    url="document-templates?moduleType.equals=1&page=0&size=9999"
                    labelKey="title"
                    valueKey="id"
                    popupMatchSelectWidth={350}
                    onChange={this.handleConsentChange}
                    value={get(informedConsent, 'documentTemplate.id')}
                  />
                </Form.Item>
                <Form.Item label="签订状态">
                  <Checkbox.Group
                    options={signStates}
                    onChange={this.handleSignStateChange}
                    value={[get(informedConsent, 'signState')]}
                  />
                </Form.Item>
                <Form.Item label="归档状态">
                  <Checkbox.Group
                    options={archiveStates}
                    onChange={this.handleArchiveChange}
                    value={[get(informedConsent, 'archive')]}
                  />
                </Form.Item>
              </Row>
              <CaseTempleteEdit
                key={get(informedConsent, 'id') || Math.random()}
                containerProps={{ ...containerProps, height: containerProps.height - 88 }}
                value={get(informedConsent, 'content')}
                onChange={this.handleSave}
                toolbars={false}
                mode="STRICT"
                hiddenButton={isAllPregnancies}
              />
            </div>
          )}
        </Col>
      </Row>
    );
  }
}
export default InformedConsent
