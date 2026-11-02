import { LazyAntd } from '@lm_fe/components';
import { IMchc_QuestionItem, IMchc_Questionnaire, IMchc_QuestionWrite, SMchc_Questionnaire } from '@lm_fe/service';
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Space, Spin } from 'antd';
import React, { FC, useState } from 'react';
import { fakeData } from './fakeData';
const { Select, Table } = LazyAntd
const { RangePicker } = DatePicker

interface IQuestionParam {
  questionId?: number
  questionType?: number
  optionIndex?: string
}
interface IProps {
  onChangeStep(v: number): void

  data?: IMchc_Questionnaire

}
function download(content: string | Blob, filename: string = '问卷答题情况.xlsx') {
  var eleLink = document.createElement('a');
  eleLink.download = filename;
  eleLink.style.display = 'none';
  var blob = typeof content === 'string' ? new Blob([content]) : content;
  console.log(typeof content, blob)
  eleLink.href = URL.createObjectURL(blob);
  document.body.appendChild(eleLink);
  eleLink.click();
  document.body.removeChild(eleLink);
};
const d = fakeData as unknown as IMchc_Questionnaire
interface ILPros { value?: IQuestionParam[], onChange?: (d: any) => void, questions?: IMchc_QuestionItem[] }
const L: FC<ILPros> = function L(props) {
  const { value = [], onChange, questions = [], } = props
  return < div style={{ width: '100%' }} >
    <Button block onClick={e => onChange?.([...value, {}])}>新增</Button>
    {
      value?.map((_, idx) => {
        const target = questions.find(q => q.id === _.questionId)
        return <Row key={idx} style={{ marginTop: 6 }} gutter={8}>
          <Col span={6}>
            <Select value={_.questionId} options={questions?.map(q => ({ label: q.questionTitle, value: q.id, disabled: value.some(v => v.questionId === q.id) }))} onChange={id => {
              const selectTarget = questions.find(_ => _.id === id)
              value.splice(idx, 1, { ..._, questionId: id, questionType: selectTarget?.questionType, optionIndex: '' })
              onChange?.([...value])
            }} />
          </Col>
          <Col span={16}>
            <Select value={_.optionIndex?.split(',')?.filter(_ => !!_)} mode="multiple"
              options={target?.questionOptionList?.map(q => ({ label: q.optionTitle, value: q.optionIndex?.toString() }))} onChange={id => {
                value.splice(idx, 1, { ..._, optionIndex: id?.toString() })
                onChange?.([...value])
              }} />
          </Col>
          <Col span={2}>
            <Button block style={{ marginLeft: 0 }} danger onClick={e => {
              value.splice(idx, 1,)
              onChange?.([...value])
            }}>删除</Button>
          </Col>
        </Row>
      })
    }
  </div >
}
const itemStyle: React.CSSProperties = { marginRight: 12, marginBottom: 8 }
// 题目条件自适应剩余宽度，保证搜索条件与按钮排在同一行
const questionItemStyle: React.CSSProperties = { ...itemStyle, flex: '1 1 260px', minWidth: 220, maxWidth: 420 }
// 加载遮罩：铺满视口，阻断请求期间的重复点击
const maskStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255, 255, 255, 0.65)',
  cursor: 'wait',
  userSelect: 'none',
}
export default ({ onChangeStep, data = d }: IProps) => {
  const [form] = Form.useForm()
  const [list, setList] = useState<IMchc_QuestionWrite[]>([])
  const [searching, setSearching] = useState(false)
  const [exporting, setExporting] = useState(false)
  function getReqData() {
    return { questionnaireId: data.id, ...form.getFieldsValue() }
  }
  function handleSearch() {
    setSearching(true)
    SMchc_Questionnaire
      .fk_getResult(getReqData())
      .then(res => {
        setList(res)
        setSearching(false)
      })
      .catch(() => setSearching(false))
  }
  function handleExport() {
    setExporting(true)
    SMchc_Questionnaire
      .fk_downloadResult(getReqData())
      .then(res => {
        download(res)
        setExporting(false)
      })
      .catch(() => setExporting(false))
  }
  // 查询 / 导出 请求期间的全屏遮罩
  const loading = searching || exporting
  const loadingTip = searching ? '正在查询，请稍候…' : exporting ? '正在导出，请稍候…' : ''
  return (
    <div >
      {loading && (
        <div style={maskStyle}>
          <Spin size="large" />
          <div style={{ marginTop: 12, color: '#1890ff', fontSize: 14 }}>{loadingTip}</div>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 12px', marginBottom: 12 }}>
        <span style={{ fontSize: 20, fontWeight: 'bold' }}>{data.questionnaireTitle}</span>
        <Button type="primary" onClick={() => onChangeStep(0)} >返回</Button>
      </div>
      <div style={{ padding: '0 12px' }}>
        <fieldset style={{ border: '1px solid #ccc', padding: '12px 12px 4px 12px', borderRadius: 2, margin: 0 }}>
          <legend style={{ padding: '0 12px', margin: 0, marginLeft: 12, border: 0, width: 'auto', display: 'inline-block', background: 'transparent', fontSize: 16, color: '#150f55', fontWeight: 'bold' }}>搜索条件</legend>
          <Form form={form} layout="inline">
            <Form.Item name="outpatientNo" label="就诊卡号" style={itemStyle}>
              <Input allowClear placeholder="请输入就诊卡号" style={{ width: 120 }} />
            </Form.Item>
            <Form.Item name="fillDate" label="提交日期" style={itemStyle}>
              <RangePicker allowClear style={{ width: 200 }} placeholder={['请选择', '请选择']} />
            </Form.Item>
            <Form.Item name="beginTotalScore" label="最小分数" style={itemStyle}>
              <InputNumber style={{ width: 70 }} />
            </Form.Item>
            <Form.Item name="endTotalScore" label="最大分数" style={itemStyle}>
              <InputNumber style={{ width: 70 }} />
            </Form.Item>
            <Form.Item name="questionOptionList" label="题目" style={questionItemStyle}>
              <L questions={data.questionList} />
            </Form.Item>
            <Form.Item style={itemStyle}>
              <Space>
                <Button type="primary" loading={searching} onClick={handleSearch}>搜索</Button>
                <Button type="primary" loading={exporting} onClick={handleExport}>导出</Button>
              </Space>
            </Form.Item>
          </Form>
        </fieldset>
      </div>
      <Table sticky scroll={{ x: 1660 }} bordered dataSource={list} style={{ marginTop: 12 }} columns={[
        { dataIndex: 'outpatientNo', title: '就诊卡号', ellipsis: true, fixed: true, width: 160 },
        { title: '姓名', width: 160, render: (a, b) => b.name },
        { title: '年龄', width: 160, render: (a, b) => b.age },
        { title: '孕周', width: 160, render: (a, b) => b.expandField1 },
        { title: '预产期', width: 160, render: (a, b) => b.expandField2 },
        { title: '手机号', width: 160, render: (a, b) => b.telephone },
        { title: '居住地址', width: 160, render: (a, b) => b.residenceAddress },
        { title: '提交日期', width: 160, render: (a, b) => b.fillDate },
        ...(data.groupVOList?.map(g => {
          const questionList = data.questionList?.filter(q => g.questionIndexList?.includes(q.questionIndex))
          return {
            title: g.groupTitle,
            children: questionListMapColumn(questionList)
          }
        }) || []),
        { title: '得分', width: 160, render: (a, b) => b.totalScore },
        { title: '总分', width: 160, render: (a, b) => b.score },

      ]} />
    </div>
  );


};
function questionListMapColumn(list: IMchc_QuestionItem[] = []) {
  return list.map(q => ({
    title: q.questionTitle,
    align: 'center',
    width: 140,
    ellipsis: true,
    render(a, b: IMchc_QuestionWrite) {

      const target = b.writeDetailList.find(_ => _.questionId === q.id);
      const optionIdxArr = target?.optionIndex?.split(',')?.filter(_ => !!_) || [];
      const displayStr = q.questionOptionList?.filter(_ => optionIdxArr.includes(_.optionIndex?.toString()));

      return <div>{displayStr?.map(_ => _.optionTitle)?.join('、') || target?.questionResult}</div>;
    }
  })) || [];
}
