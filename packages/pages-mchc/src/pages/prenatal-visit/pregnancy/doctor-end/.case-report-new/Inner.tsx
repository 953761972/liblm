import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { mchcLogger } from '@lm_fe/env';
import { AnyObject, expect_array, fubaoRequest as request, text_ellipsis } from '@lm_fe/utils';
import { Button, Card, Col, Empty, List, Modal, Popconfirm, Row } from 'antd';
import { cloneDeep, first, get, isEmpty, map } from 'lodash';
import { lazy, useEffect, useState } from 'react';
import { ICaseReport, ICaseTpl, IDataItem } from './types';
const RenderContentWrap = lazy(() => import('./RenderContentWrap'))



export default function FuckingNursing({ id, outpatientNo }: ICaseReport) {
  const [siderPanels, set_siderPanels] = useState<IDataItem[]>([])

  const [surgeryTemplates, set_surgeryTemplates] = useState<ICaseTpl[]>([])
  const [visible, set_visible] = useState<boolean>(false)
  const [activeItem, set_activeItem] = useState<IDataItem | undefined>()


  useEffect(() => {

    init();

    return () => {

    }
  }, [])


  function handleAdd() {
    set_visible(true)
  };

  function handleClickListItem(item: IDataItem) {
    set_activeItem(item)

  };

  async function fetch_data() {



    let data = (await request.get<IDataItem[]>('/api/ic/findPersonalPage', { params: { pregnancyId: id } })).data;


    let newSiderPanels = expect_array(data);

    set_siderPanels(newSiderPanels)


    set_activeItem(first(newSiderPanels))

  };
  async function init() {

    const ttt = await request.get<AnyObject>('/api/caseRegister/getCaseRegisterType?id=1')

    set_surgeryTemplates(Object.entries(ttt.data).map(arr => ({ code: arr[0], title: arr[1] })))
    fetch_data()
  };

  async function handleDelete(item: any) {
    const id = get(item, 'id');
    const res = (await request.delete(`/api/ic/delete/${id}`)).data;

    set_activeItem(undefined)

    await fetch_data();
  };

  function handleChooseTemplate(fuck_type: ICaseTpl) {
    let newSiderPanels = cloneDeep(siderPanels.filter(_ => _.id !== null));
    let newItem = {
      id: null,
      code: fuck_type.code,
      name: fuck_type.title
    };
    newSiderPanels.push(newItem);
    set_visible(false)
    set_siderPanels(newSiderPanels)
    set_activeItem(newItem)

  };

  function renderSider() {
    return (
      <Card
        size="small"
        bordered={false}
        style={{ height: '100%' }}
        title={<span style={{ color: '#150f55', fontWeight: 600 }}>就诊记录</span>}
        extra={<PlusCircleOutlined onClick={handleAdd} />}
      >

        <List
          itemLayout="horizontal"
          dataSource={siderPanels}
          renderItem={(data, index) => {
            const op_name = data.name!

            return (
              <List.Item onClick={e => handleClickListItem(data)}>
                <List.Item.Meta
                  title={text_ellipsis(op_name, 10)}
                  description={
                    <>
                      {get(data, 'id') && get(data, 'id') != -1 ? (
                        <Popconfirm
                          title="确定要删除吗?"
                          onConfirm={() => handleDelete(data)}
                          okText="确定"
                          cancelText="取消"
                        >
                          {get(activeItem, 'id') === get(data, 'id') && (
                            <DeleteOutlined
                              style={{ color: '#007aff', float: 'right', marginTop: 2, marginLeft: 8 }}
                            />
                          )}
                          {get(data, 'surgicalDate') && (
                            <span className="date" style={{ float: 'right' }}>
                              {get(data, 'surgicalDate')}
                            </span>
                          )}
                        </Popconfirm>
                      ) : (
                        <>
                          <EditOutlined
                            style={{ color: 'rgb(24, 144, 255)', float: 'right', marginTop: 2, marginLeft: 8 }}
                          />
                          {get(data, 'surgicalDate') && (
                            <span className="date" style={{ float: 'right' }}>
                              {get(data, 'surgicalDate')}
                            </span>
                          )}
                        </>
                      )}
                    </>
                  }
                />
              </List.Item>
            )
          }}
        />

      </Card >
    );
  };

  function renderContent() {
    const target_tpl = surgeryTemplates.find(_ => _.code === activeItem?.code)
    mchcLogger.log('renderContent xxgg', surgeryTemplates, activeItem, target_tpl)
    if (isEmpty(siderPanels)) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          background: '#fff',
        }}>
          <div>暂无数据，请选择模板内容</div>
          <div>
            {map(surgeryTemplates, (nurseType, key) => {
              return (
                <Button style={{ margin: 8 }} key={key} onClick={() => handleChooseTemplate(nurseType)}>
                  {nurseType.title}
                </Button>
              );
            })}
          </div>
        </div>
      )
    }
    if (!target_tpl || !activeItem) {
      return <Empty />
    }
    return <RenderContentWrap
      outpatientNo={outpatientNo}
      familyPlanningId={id}
      tableColumns={[]}
      activeItem={activeItem}
      active_key={target_tpl.code}
      active_title={target_tpl.title}
      onRefresh={fetch_data}
    />
  };

  return (
    <Row style={{ height: '100%' }}>
      <Col style={{ height: '100%', width: 290, overflow: 'auto', backgroundColor: '#fff' }}>
        {renderSider()}
      </Col>
      <Col style={{ height: '100%', width: 'calc(100% - 290px)', overflow: 'auto' }}>{renderContent()}</Col>
      <Modal
        open={visible}
        onCancel={() => {
          set_visible(false)
        }}
      >
        {map(surgeryTemplates, (nurseType, key) => {
          return (
            <Button style={{ margin: 8 }} key={key} onClick={() => handleChooseTemplate(nurseType)}>
              {nurseType.title}
            </Button>
          );
        })}
      </Modal>
    </Row>
  );
}
