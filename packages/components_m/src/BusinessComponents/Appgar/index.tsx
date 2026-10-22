import { MyCheckbox } from '@lm_fe/components';
import { mchcEnv } from '@lm_fe/env';
import { Col, InputNumber, Row } from 'antd';
import { get } from 'lodash';
import React, { Fragment } from 'react';
import { breathMapping, heartRateMapping, muscleMapping, reflexMapping, skinMapping } from './config';
import styles from './index.module.less';
const SPAN = 2
const configDefault = [
  { key: 'Skincolor', label: '肤色', options: skinMapping }, // SkincolorScore
  { key: 'Breath', label: '呼吸', options: breathMapping }, // BreathScore
  { key: 'Muscletension', label: '肌张力', options: muscleMapping }, // MuscletensionScore
  { key: 'Reflex', label: '反射', options: reflexMapping }, // ReflexScore
  { key: 'Heartrate', label: '心率', options: heartRateMapping }, // HeartrateScore
]
const allKeys = configDefault.map(_ => _.key)
const defaultValue = {}
export default function Appgar(props: any) {
  const { value = defaultValue, onChange } = props as any;

  function countTotal(newState: any, minute: number) {
    return allKeys.reduce((sum, k) => sum + (newState[`apgar${minute}${k}Score`] ?? 0), 0)
  }
  function safe_onChange(v: any = {}, minute = 0) {
    const totalKey = `apgar${minute}`
    const newState = { ...value, ...v }
    if (minute) {
      newState[totalKey] = countTotal(newState, minute)
    }
    onChange?.(newState)
  }

  function handleChange(callbackData: any, minute: number, key: string) {
    const valueKey = `apgar${minute}${key}`
    const ScoreKey = `${valueKey}Score`
    // const v = callbackData[callbackData.length - 1];
    const newState = { ...value, [valueKey]: callbackData, [ScoreKey]: callbackData, }

    safe_onChange(newState, minute);
  };
  function handleChangeInput(v: number, minute: number, key: string) {
    const ScoreKey = `apgar${minute}${key}Score`


    const newState = { ...value, [`${ScoreKey}`]: v, }


    safe_onChange(newState, minute);
  };
  function renderForm(minute: number,) {

    return (
      <>
        <Row className={styles["appgar-row"]}>
          <Col span={4}>
            <span style={{ color: 'rgb(61, 139, 247)' }}>Apgar评分({minute}分钟评分)</span>
          </Col>
          <Col className={styles["appgar-label"]} span={2}>
            <span>总分：</span>
          </Col>
          <Col span={2}>

            <InputNumber
              disabled
              min={0}
              // controls={false}
              value={get(value, `apgar${minute}`)}
              onChange={(e: any) => {
                safe_onChange({ [`apgar${minute}`]: +e });
              }}
            />
          </Col>
        </Row>
        {
          configDefault.map(config => {
            return <Row key={config.key} className={styles["appgar-row"]}>
              <Col className={styles["appgar-label"]} span={SPAN}>
                <span>{config.label}：</span>
              </Col>
              <Col span={11}>
                <MyCheckbox onChange={v => handleChange(v, minute, `${config.key}`)} value={get(value, `apgar${minute}${config.key}`)} marshal={0} options={config.options} />
                {/* <Checkbox.Group
                  value={[get(value, `apgar${minute}${config.key}`)]}
                  onChange={(e) => {
                    handleChange(e, minute, `${config.key}`);
                  }}
                >
                  <Row className={styles["appgar-row"]}>
                    {map(config.options, (item, index) => {
                      return (
                        <Col span={8} key={index}>
                          <Checkbox value={item.value}> {item.label}</Checkbox>
                        </Col>
                      );
                    })}
                  </Row>
                </Checkbox.Group> */}
              </Col>
              <Col className={styles["appgar-label"]} span={2}>
                <span>{minute}分钟评分：</span>
              </Col>
              <Col span={2}>
                <InputNumber
                  min={0}

                  value={get(value, `apgar${minute}${config.key}Score`)}
                  onChange={(e) => {
                    handleChangeInput(e, minute, `${config.key}`);
                  }}
                />
              </Col>
            </Row>
          })
        }
      </>
    );
  };
  function renderFormGysy() {
    return <Fragment>
      <Row className={styles["appgar-row"]}>
        <Col className={styles["appgar-label"]} span={SPAN}>Apgar评分时间：</Col>
        <Col span={SPAN}>1 min</Col>
        <Col span={SPAN}>5 min</Col>
        <Col span={SPAN}>10 min</Col>
      </Row>
      {
        configDefault.map(config => {
          return <Row className={styles["appgar-row"]} key={config.key}>
            <Col className={styles["appgar-label"]} span={SPAN}>
              <span>{config.label}：</span>
            </Col>
            <Col span={SPAN}>
              <InputNumber
                min={0}

                value={get(value, `apgar${1}${config.key}Score`)}
                onChange={(e) => {
                  handleChangeInput(e, 1, `${config.key}`);
                }}
              />
            </Col>
            <Col span={SPAN}>
              <InputNumber
                min={0}

                value={get(value, `apgar${5}${config.key}Score`)}
                onChange={(e) => {
                  handleChangeInput(e, 5, `${config.key}`);
                }}
              />
            </Col>
            <Col span={SPAN}>
              <InputNumber
                min={0}

                value={get(value, `apgar${10}${config.key}Score`)}
                onChange={(e) => {
                  handleChangeInput(e, 10, `${config.key}`);
                }}
              />
            </Col>
          </Row>
        })
      }
      <Row className={styles["appgar-row"]}>
        <Col className={styles["appgar-label"]} span={SPAN}>
          <span>总分：</span>
        </Col>
        <Col span={SPAN}>

          <InputNumber
            disabled
            min={0}
            // controls={false}
            value={get(value, `apgar${1}`)}
            onChange={(e: any) => {
              safe_onChange({ [`apgar${1}`]: +e });
            }}
          />
        </Col>
        <Col span={SPAN}>

          <InputNumber
            disabled
            min={0}
            // controls={false}
            value={get(value, `apgar${5}`)}
            onChange={(e: any) => {
              safe_onChange({ [`apgar${5}`]: +e });
            }}
          />
        </Col>
        <Col span={SPAN}>

          <InputNumber
            disabled
            min={0}
            // controls={false}
            value={get(value, `apgar${10}`)}
            onChange={(e: any) => {
              safe_onChange({ [`apgar${10}`]: +e });
            }}
          />
        </Col>
      </Row>

    </Fragment>

  };
  function renderItem() {
    if (mchcEnv.is('广三')) {
      return renderFormGysy()
    }
    return (
      <>

        {renderForm(1)}
        {renderForm(5)}
        {renderForm(10)}

      </>
    );
  };

  return (
    <div>
      {renderItem()}
    </div>
  );
}
