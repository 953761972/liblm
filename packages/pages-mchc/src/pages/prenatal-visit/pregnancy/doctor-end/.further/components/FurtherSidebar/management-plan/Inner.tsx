import { MyForm, MyIcon } from '@lm_fe/components_m'
import { mchcEnv } from '@lm_fe/env'
import { IMchc_Doctor_OutpatientHeaderInfo } from '@lm_fe/service'
import { Button, Checkbox, Col, Input, Modal, Popconfirm, Row, Tabs } from 'antd'
import { filter, first, get, includes, last, map, omit, size } from 'lodash'
import React, { Component } from 'react'
import { api } from '../../../../.api'
import { config } from './config'
import './index.less'
import requestMethods from './methods/request'
interface IProps {
    isShowManageModal: boolean
    closeModal(v: 'isShowListModal' | 'isShowHisModal' | 'isShowManageModal'): void
    headerInfo: IMchc_Doctor_OutpatientHeaderInfo
    onPlanSaved?(visitPlans: any[]): void
}
export default class Index extends Component<IProps, any> {
    state = {
        formHandler: {},
        modalFormHandler: {},
        isShowTemplateModal: false,
        isShowAddModal: false,
        planData: [],
        selectedKeys: [],
        activeKey: '',
        templateName: '',
        currentTemplateName: '',
        templateData: [],
        planTypesData: [],
    }

    componentDidMount() {
        this.getPlanTypeData()
        this.getPlanData()
    }

    getPlanData = async () => {
        const { headerInfo } = this.props
        const res = await requestMethods.getPlanVisitsOfOutpatient(get(headerInfo, `id`))
        this.setState({ planData: get(res, `visitPlans`) ?? [] })
    }

    getPlanTypeData = async (operation?: string) => {
        const { activeKey } = this.state
        const planTypesData: any = await api.further.getPrenatalVisitPlanTypes()
        let showData: any = {}
        switch (operation) {
            case 'update':
                showData = get(
                    filter(planTypesData, (item) => item.id == activeKey),
                    '0',
                )
                break
            case 'add':
                showData = last(planTypesData)
                break
            default:
                showData = first(planTypesData)
                break
        }
        this.setState({
            planTypesData,
            activeKey: get(showData, 'id') + '',
            currentTemplateName: get(showData, 'name'),
            templateData: get(showData, 'prenatalVisitPlanTemplates'),
        })
    }

    handleSavePlan = async () => {
        const { headerInfo, onPlanSaved } = this.props
        const { formHandler } = this.state
        const planData = formHandler.plan.actions.getValue().value
        const data = { id: get(headerInfo, 'id'), visitPlans: planData }
        const res = await requestMethods.updateOutpatient(data)
        this.getPlanData()
        onPlanSaved && onPlanSaved(get(res, 'visitPlans', []))
        mchcEnv.success('保存成功')
    }

    handleImport = () => {
        const { selectedKeys, planTypesData, planData } = this.state
        if (size(selectedKeys) > 0) {
            let addPlanTemplates: any = []
            let addPlans: any = []
            map(planTypesData, (item) => {
                if (includes(selectedKeys, item.id) && size(item.prenatalVisitPlanTemplates) > 0) {
                    addPlanTemplates = addPlanTemplates.concat(item.prenatalVisitPlanTemplates)
                }
            })
            if (size(addPlanTemplates) > 0) {
                map(addPlanTemplates, (item) => {
                    item = omit(item, 'id')
                    addPlans.push(item)
                })
            }

            this.setState({ planData: [...planData, ...addPlans] })
        }
    }

    handleDeletePlanType = async (item: any) => {
        await api.further.deletePrenatalVisitPlanTypes(get(item, 'id'))
        this.getPlanTypeData()
    }

    handleAddPlanType = async () => {
        const { templateName } = this.state
        if (!templateName) {
            mchcEnv.info('请输入模板名称！')
            return
        }
        const data = { name: templateName }
        await api.further.addPrenatalVisitPlanTypes(data)
        this.getPlanTypeData('add')
        this.setState({
            isShowAddModal: false,
            templateName: '',
        })
    }

    handleSaveTemplate = async () => {
        const { modalFormHandler, activeKey, currentTemplateName } = this.state
        const templateData = modalFormHandler.plan.actions.getValue().value
        const data = { id: activeKey, name: currentTemplateName, prenatalVisitPlanTemplates: templateData }
        await api.further.updatePrenatalVisitPlanTypes(data)
        this.getPlanTypeData('update')
        mchcEnv.success('保存成功')
    }

    handleTabsChange = (key: string | number) => {
        const { planTypesData } = this.state
        const filterData = filter(planTypesData, (item) => item.id == key)
        this.setState({
            activeKey: get(filterData, '0.id') + '',
            currentTemplateName: get(filterData, '0.name'),
            templateData: get(filterData, '0.prenatalVisitPlanTemplates'),
        })
    }

    renderAddModal() {
        const { isShowAddModal, templateName } = this.state
        return (
            <Modal
                width={500}
                title="新增模板"
                cancelText="关闭"
                visible={isShowAddModal}
                onCancel={() => this.setState({ isShowAddModal: false })}
                onOk={this.handleAddPlanType}
                maskClosable={false}
            >
                <div>
                    模板名称：
                    <Input
                        style={{ width: '180px' }}
                        value={templateName}
                        onChange={(e) => this.setState({ templateName: e.target.value })}
                    />
                </div>
            </Modal>
        )
    }

    renderManageModal() {
        const { isShowTemplateModal, planTypesData, modalFormHandler, templateData, activeKey, currentTemplateName } =
            this.state

        if (modalFormHandler.subscribe) {
            modalFormHandler.subscribe('plan', 'tableAdd', async () => {
                const currentData = this.state.modalFormHandler.plan.actions.getValue().value ?? []
                this.setState({ templateData: [...currentData, {}] })
            })
            modalFormHandler.subscribe('plan', 'tableDelete', async (data: any) => {
                const keysArr = data.selectedRowKeys
                const tableData = data.dataSource
                if (keysArr.length > 0) {
                    const key = keysArr[0]
                    tableData.splice(key, 1)
                    this.setState({ templateData: tableData })
                }
            })
        }

        return (
            <Modal
                className="further-template-modal"
                width="80%"
                title={
                    <>
                        产检计划模板
                        <Button
                            className="add-btn"
                            onClick={() => {
                                this.setState({ isShowAddModal: true })
                            }}
                        >
                            新增模板
                        </Button>
                    </>
                }
                cancelText="关闭"
                visible={isShowTemplateModal}
                onCancel={() => this.setState({ isShowTemplateModal: false })}
                onOk={this.handleSaveTemplate}
                maskClosable={false}
            >
                <Tabs tabPosition="left" activeKey={activeKey} onChange={this.handleTabsChange}>
                    {map(planTypesData, (item) => (
                        <Tabs.TabPane
                            tab={
                                <>
                                    {item.name}
                                    <Popconfirm
                                        className="confirm-icon"
                                        placement="topRight"
                                        title="是否删除此条模板？"
                                        onConfirm={() => this.handleDeletePlanType(item)}
                                        okText="确定"
                                        cancelText="取消"
                                    >
                                        <MyIcon value="CloseOutlined" />
                                    </Popconfirm>
                                </>
                            }
                            key={item.id}
                        >
                            <div>
                                模板名称：
                                <Input
                                    style={{ width: '180px' }}
                                    value={currentTemplateName}
                                    onChange={(e) => this.setState({ currentTemplateName: e.target.value })}
                                />
                            </div>
                            {activeKey == item.id && (
                                <MyForm
                                    config={config}
                                    value={templateData}
                                    getFormHandler={(modalFormHandler: any) => this.setState({ modalFormHandler })}
                                    submitChange={false}
                                />
                            )}
                        </Tabs.TabPane>
                    ))}
                </Tabs>
            </Modal>
        )
    }

    render() {
        const { planTypesData, planData, formHandler, isShowTemplateModal, isShowAddModal } = this.state
        const { isShowManageModal, closeModal } = this.props

        if (formHandler.subscribe) {
            formHandler.subscribe('plan', 'tableAdd', async () => {
                const currentData = this.state.formHandler.plan.actions.getValue().value ?? []
                this.setState({ planData: [...currentData, {}] })
            })

            formHandler.subscribe('plan', 'tableDelete', async (data: any) => {
                const keysArr = data.selectedRowKeys
                const tableData = data.dataSource
                if (keysArr.length > 0) {
                    const key = keysArr[0]
                    tableData.splice(key, 1)
                    this.setState({
                        planData: tableData,
                    })
                }
            })
        }

        return (
            <>
                <Modal
                    className="further-manage-modal"
                    width="80%"
                    title="产检计划"
                    cancelText="关闭"
                    visible={isShowManageModal}
                    onOk={this.handleSavePlan}
                    onCancel={() => closeModal('isShowManageModal')}
                    maskClosable={false}
                >
                    <Row>
                        <Col span={18}>
                            <MyForm
                                config={config}
                                value={planData}
                                getFormHandler={(formHandler: any) => this.setState({ formHandler })}
                                submitChange={false}
                            />
                        </Col>
                        <Col span={5} offset={1}>
                            <div className="manage-title">
                                产检计划模板
                                <Button
                                    className="manage-btn"
                                    onClick={() => {
                                        this.setState({ isShowTemplateModal: true })
                                    }}
                                >
                                    管理模板
                                </Button>
                            </div>
                            <Checkbox.Group onChange={(selectedKeys) => this.setState({ selectedKeys })}>
                                {map(planTypesData, (item: any) => (
                                    <Checkbox value={item.id} style={{ marginLeft: 0, width: '100%' }}>
                                        {item.name}
                                    </Checkbox>
                                ))}
                            </Checkbox.Group>
                            <Button className="import-btn" onClick={this.handleImport} type="primary">
                                导入
                            </Button>
                        </Col>
                    </Row>
                </Modal>
                {isShowTemplateModal && this.renderManageModal()}
                {isShowAddModal && this.renderAddModal()}
            </>
        )
    }
}
