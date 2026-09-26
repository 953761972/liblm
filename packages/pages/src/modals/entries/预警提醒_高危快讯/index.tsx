import { IGlobalModalProps, } from '@lm_fe/components';
import { IMchc_Doctor_Diagnoses, IMchc_Doctor_OutpatientHeaderInfo, SMchc_Doctor } from '@lm_fe/service';
import { formatDate } from '@lm_fe/utils';
import { Button, Checkbox, Empty, message, Modal, Tabs } from 'antd';
import classnames from 'classnames';
import { cloneDeep, filter, findIndex, get, map, set, size } from 'lodash';
import { useEffect, useState } from 'react';
import AddDiagnoses from './add-diagnoses/add-diagnoses';
import styles from './index.module.less';
import { FuckWarnTtype, handleType, transferData, transferdataRemind } from './util';
import React from 'react';
import { CustomIcon } from '@lm_fe/components_m';


import { LazyAntd } from '@lm_fe/components';

const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd


interface IProps {
  websocketDataSum: FuckWarnTtype[];
  websocketData: FuckWarnTtype[];
  changeWebsocketData?(v: any): void;
  makeSure(data?: any): void;
  highriskWarn?: { tabKey: '1' | '2', visible?: boolean }
  setDiagnosesList?(v: IMchc_Doctor_Diagnoses[]): Promise<void>
  id: string;
  page?: 'return'
  changewWebsocketSum?(): void
}

// 1表示未处置，9表示已处置
enum riskType {
  DiagnosisRemind = 'DiagnosisRemind', //'漏诊提醒',
  RiskMark = 'RiskMark', //'高危因素标记'
}
export default function HighRiskWarn({
  modal_data,
  ...others
}: IGlobalModalProps<IProps>) {
  const {
    highriskWarn = { tabKey: 1 },
    makeSure,
    changeWebsocketData,
    websocketData,
    websocketDataSum,
    setDiagnosesList,
    page,
    changewWebsocketSum,
    id
  } = modal_data

  //   const [highriskData, setHighriskData] = useState(null); //高危快讯数据
  const [activeKey, setActiveKey] = useState('1'); //最外层tabkey 高危快讯 预警提醒
  const [tabBtn, setTabBtn] = useState(handleType.noprocess); // 已处置 未处置标记
  const [insideActive, setInsideActive] = useState(riskType.DiagnosisRemind); // 内层tabkey 高危 漏诊

  const [selectRemind, setSelectRemind] = useState([]); // 选择的漏诊提醒标记数据标记数据
  const [selectRiskMark, setSelectRiskMark] = useState([]); // 选择的高危标记

  const [noProcessData, setNoPorcessData] = useState([] as any); // 未处置预警提醒数据
  const [processData, setProcessData] = useState([] as any); // 已处置预警提醒数据
  const [ignoreData, setIgnoreData] = useState<any[]>([]); // 忽略数据

  const [noProcessRiskMarklength, setNoProcessRiskMarklength] = useState(0); // 未处置高危因素数据大小
  const [processRiskMarkLength, setProcessRiskMarkLength] = useState(0); // 已经处置高危数据大小
  const [ignoreRiskMarkLength, setIgnoreRiskMarkLength] = useState(0); // 已经处置高危数据大小

  const [noProcessRiskMark, setNoProcessRiskMark] = useState([] as any); // 为处置高危因素数据
  const [noProcessRemind, setNoPrecessRemind] = useState([] as any); // 未处置漏诊提醒数据

  const [processRiskMark, setProcessRiskMark] = useState([] as any); // 已经处置高危数据
  const [processRemind, setProcessRemind] = useState([] as any); // 已经处置漏诊提醒数据

  const [ignoreRiskMark, setIgnoreRiskMark] = useState<any[]>([]); // 忽略高危数据
  const [ignoreRemind, setIgnoreRemind] = useState<any[]>([]); // 忽略漏诊提醒
  const [ignoreRiskMarkInit, setIgnoreRiskMarkInit] = useState<any[]>([]); // 初始化忽略高危数据

  const [jump, setJump] = useState(true); // websocketData更新时，是否跳转到漏诊提醒，默认跳转

  const [headerInfo, set_headerInfo] = useState<IMchc_Doctor_OutpatientHeaderInfo>()

  //#region 生命周期
  useEffect(() => {
    setNoPorcessData(filterWsData(handleType.noprocess));
    setProcessData(filterWsData(handleType.process));
    setIgnoreData(filterWsData(handleType.ignore));
    setNoProcessRiskMark(filterWsData(handleType.noprocess, riskType.RiskMark));
    setNoPrecessRemind(filterWsData(handleType.noprocess, riskType.DiagnosisRemind));
    setProcessRiskMark(filterWsData(handleType.process, riskType.RiskMark));
    setProcessRemind(filterWsData(handleType.process, riskType.DiagnosisRemind));
    setIgnoreRiskMark(filterWsData(handleType.ignore, riskType.RiskMark));
    setIgnoreRemind(filterWsData(handleType.ignore, riskType.DiagnosisRemind));
    console.log({ props: others });
  }, [websocketData]);




  useEffect(() => {
    setIgnoreRiskMarkInit(filterWsData(handleType.ignore, riskType.RiskMark, websocketDataSum));
  }, [websocketDataSum]);
  useEffect(() => {
    console.log(ignoreRiskMark);
  }, [ignoreRiskMark]);

  useEffect(() => {
    console.log('----------触发');
    if (tabBtn == handleType.process) {
      if (size(processRemind) == 0 && size(processRiskMark) > 0) {
        setInsideActive(riskType.RiskMark);
      } else {
        setInsideActive(riskType.DiagnosisRemind);
      }
    } else if (tabBtn == handleType.noprocess) {
      if (size(noProcessRemind) == 0 && size(noProcessRiskMark) > 0) {
        setInsideActive(riskType.RiskMark);
      } else {
        if (jump == true) {
          setInsideActive(riskType.DiagnosisRemind);
        }
      }
    } else {
      if (size(ignoreRemind) == 0 && size(ignoreRiskMark) > 0) {
        setInsideActive(riskType.RiskMark);
      } else {
        if (jump == true || true) {
          setInsideActive(riskType.DiagnosisRemind);
        }
      }
    }
  }, [noProcessRiskMark, noProcessRemind, processRiskMark, processRemind, ignoreRemind, ignoreRiskMark, tabBtn]);

  useEffect(() => {
    if (highriskWarn.tabKey == '2' && size(warnDataByBoProcess()) == 0) {
      setActiveKey('2');
    }
  }, [highriskWarn]);
  useEffect(() => {
    SMchc_Doctor.getOutpatientHeaderInfo(id).then(r => {
      set_headerInfo(r)
    })

  }, [id]);

  // 高危因素提醒数量提展示
  useEffect(() => {
    let noProcesslength: number = 0;
    let Processlength: number = 0;
    if (noProcessRiskMark.length > 0) {
      noProcessRiskMark.map((item) => {
        noProcesslength += item?.data?.highriskTree?.length;
      });
      setNoProcessRiskMarklength(noProcesslength);
    }
    if (processRiskMark.length > 0) {
      processRiskMark.map((item) => {
        Processlength += item?.data?.highriskTree?.length;
      });
      setProcessRiskMarkLength(Processlength);
    }
    if (ignoreRiskMark.length > 0) {
      ignoreRiskMark.map((item) => {
        Processlength += item?.data?.highriskTree?.length;
      });
      setIgnoreRiskMarkLength(Processlength);
    }
  }, [processRiskMark, noProcessRiskMark, ignoreRiskMark]);

  useEffect(() => {
    // 优先展示预警处理tab
    if (size(warnDataByBoProcess()) > 0) {
      setActiveKey('1');
    }
    // 初始化高危标记已选择
    initSelectRiskMark();
  }, [websocketData]);

  useEffect(() => {
    // 初始化高危标记已选择
    initSelectRiskMark();
  }, [insideActive]);
  //#endregion



  function tabsOnChange(key: string) {
    setActiveKey(key);
  }

  function handleTabBtnClick(type: handleType) {
    return () => {
      setTabBtn(type);
      setSelectRemind([]);
    };
  }
  //#endregion

  //#region  过滤数据
  /**
   * @param process 处理状态（已处置/未处置）
   * @param messageType 消息类型（高危/漏诊）
   * @returns
   */
  function filterWsData(process: handleType, messageType?: riskType, data = websocketData) {
    const postData = filter(data, (item) => {
      if (messageType) {
        return item.type == messageType && item.level == process;
      }
      return item.level == process;
    });
    return postData;
  }

  /**预警提醒数据未处置数据 */
  function warnDataByBoProcess() {
    return filterWsData(handleType.noprocess);
  }
  /**初始化已选择高危标记 */
  function initSelectRiskMark() {
    const newData = filter(websocketData, (item) => {
      return item.type == riskType.RiskMark && (item.level == tabBtn || item.level == `${tabBtn}read`);
    });
    let data: any = [];
    map(newData, (item, index) => {
      let highriskTree = get(item, `data.highriskTree`);
      map(highriskTree, (treeItem, ind) => {
        let children = get(treeItem, `children`);
        map(children, (childrenItem, i) => {
          if (get(childrenItem, `selected`)) {
            data.push(item);
          }
        });
      });
    });
    setSelectRiskMark(data);
  }

  //#endregion

  //#region 底部buttom操作
  const handleSure = (type: 'yes' | 'no') => {
    return () => {
      let postData: any = [];
      if (type == 'no') {
        postData = getDataByTab(handleType.noprocess);
        setAllSelectFalse(postData);
      } else {
        postData = insideActive == riskType.DiagnosisRemind ? selectRemind : selectRiskMark;
        setJump(true);
      }
      const _postData = cloneDeep(postData);
      if (size(_postData) == 0) {
        message.info('请先选择标记');
        return;
      }
      if (insideActive == riskType.RiskMark && type == 'yes') {
        const hasNoSelect = judgeSelect(noProcessRiskMark);
        if (hasNoSelect) {
          Modal.confirm({
            title: '提示',
            content: '是否确认忽略其他为勾选项？',
            onOk() {
              submitData(noProcessRiskMark, type);
            },
            onCancel() { },
            okText: '确认',
            cancelText: '取消',
          });
          return true;
        }
      }
      submitData(_postData, type);
    };
  };
  function submitData(_postData: any, type: string) {
    let level = type == 'no' ? 0 : 9;
    map(_postData, (item, index) => {
      set(item, `handleType`, type);
      set(item, `level`, level);
    });
    makeSure(_postData);
    setSelectRiskMark([]);
    setSelectRemind([]);
  }
  function judgeSelect(dataArr: any) {
    let bool = false;
    console.log({ dataArr });
    map(dataArr, (item, index) => {
      let highriskTree = get(item, `data.highriskTree`);
      map(highriskTree, (treeItem, ind) => {
        let children = get(treeItem, `children`);
        let count = 0;
        for (let i = 0; i < size(children); i++) {
          let childrenItem = children[i];
          if (get(childrenItem, `selected`)) {
            break;
          }
          if (!get(childrenItem, `selected`)) {
            count++;
          }
        }
        if (count == size(children)) {
          bool = true;
        }
      });
    });
    return bool;
  }
  function setAllSelectFalse(dataArr) {
    map(dataArr, (item, index) => {
      let highriskTree = get(item, `data.highriskTree`);
      map(highriskTree, (treeItem, ind) => {
        let children = get(treeItem, `children`);
        map(children, (childrenItem, i) => {
          set(childrenItem, `selected`, false);
        });
      });
    });
  }

  // 忽略操作 type = 'yes'为忽略，'no'取消忽略
  function handleIgnore(type: 'yes' | 'no') {
    return () => {
      setJump(true);
      let level: any = null;
      if (type == 'yes') {
        level = '0';
      } else {
        level = '1';
      }
      const postData = insideActive == riskType.DiagnosisRemind ? selectRemind : selectRiskMark;
      const postDataclone = cloneDeep(postData);
      map(postDataclone, (item) => {
        set(item, 'level', level);
      });
      console.log({ postDataclone });
      makeSure(postDataclone);
      setSelectRiskMark([]);
      setSelectRemind([]);
      changewWebsocketSum?.();
    };
  }

  //#endregion

  //#region 内容操作
  function handleProcess(diagId: any) {
    const selectRemindArr = filter(selectRemind, (item: any) => item.id == diagId);
    map(selectRemindArr, (item, index) => {
      set(item, `handleType`, 'yes');
      set(item, `level`, 9);
    });
    makeSure(selectRemindArr);
    setSelectRiskMark([]);
    setSelectRemind([]);
  }
  const handleCheck = (checkedKeys: any,) => {
    const newwebsocketData = cloneDeep(websocketData);
    let checkedArr = get(checkedKeys, `checked`) || [];
    let data: any = [];
    map(newwebsocketData, (item, index) => {
      let highriskTree = get(item, `data.highriskTree`);
      if (get(item, 'level') == tabBtn) {
        map(highriskTree, (treeItem, ind) => {
          let children = get(treeItem, `children`);
          map(children, (childrenItem, i) => {
            let keyStr = (childrenItem.key || i.toString()) + '~' + childrenItem.value;
            if (get(childrenItem, `selected`)) {
              if (!checkedArr.includes(keyStr)) {
                set(childrenItem, `selected`, false);
              }
            }
            if (checkedArr.includes(keyStr)) {
              set(childrenItem, `selected`, true);
              // setSelectRiskMark([...selectRiskMark, item] as any);
              data.push(item);
            }
          });
        });
      }
    });
    setJump(false);
    setSelectRiskMark(data);
    changeWebsocketData?.(newwebsocketData);
  };

  const CheckboxOnChange = (item: any) => {
    return (e: any) => {
      const newSelectRemind = [...selectRemind];
      const ind = findIndex(newSelectRemind, (value: any) => value.id == item.id);
      if (e.target.checked) {
        if (ind == -1) {
          setSelectRemind([...selectRemind, item] as any);
        }
      } else {
        newSelectRemind.splice(ind, 1);
        setSelectRemind(newSelectRemind);
      }
    };
  };
  //#endregion

  //#region 渲染内容
  // 渲染高危标记（根据条件渲染已处置，未处置）
  function renderRiskMark() {
    const newData = filter(websocketData, (item) => {
      return item.type == riskType.RiskMark && (item.level == tabBtn || item.level == `${tabBtn}read`);
    });
    if (size(newData) == 0) {
      return <Empty />;
    }
    let treeDataArr: any = [],
      selectkeyArr: any = [],
      openKeyArr: any = [];
    map(newData, (item) => {
      if (item.type !== 'RiskMark') return
      const highriskTree = item.data.highriskTree ?? []
      const { treeData, selectkey, openKey } = transferData(
        highriskTree,
        tabBtn,
        get(item, `handleTime`),
        get(item, 'id'),
        ignoreRiskMarkInit,
      );
      treeDataArr = [...treeDataArr, ...treeData];
      selectkeyArr = [...selectkeyArr, ...selectkey];
      openKeyArr = [...openKeyArr, ...openKey];
    });
    if (tabBtn == handleType.noprocess || tabBtn == handleType.ignore) {
      return (
        <div key={Math.random()}>
          <Tree
            treeData={treeDataArr}
            expandedKeys={openKeyArr}
            checkedKeys={selectkeyArr}
            checkable={true}
            onCheck={handleCheck}
            checkStrictly={true}
          />
        </div>
      );
    } else {
      return (
        <Tree
          treeData={treeDataArr}
          expandedKeys={openKeyArr}
          checkable={true}
          checkedKeys={selectkeyArr}
          titleRender={titleRender}
        />
      );
    }
  }
  function titleRender(treeData: any) {
    return (
      <div>
        {get(treeData, `title`)}
        {tabBtn == handleType.process && treeData.children && (
          <>
            <span className={styles["handle-time"]}>{formatDate(get(treeData, `handleTime`))}</span>
            <CustomIcon type="icon-laber" className={styles["icon-laber"]} />
          </>
        )}
        {tabBtn == handleType.ignore && treeData.children && (
          <span className={styles["handle-time"]}>{formatDate(get(treeData, `handleTime`))}</span>
        )}
      </div>
    );
  }
  function renderRemine() {
    const newData = filter(websocketData, (item) => {
      return item.type == riskType.DiagnosisRemind && (item.level == tabBtn || item.level == `${tabBtn}read`);
    });
    if (size(newData) == 0) {
      return <Empty />;
    }
    const treeData = transferdataRemind(newData, tabBtn);
    return map(treeData, (item: any, index) => {
      const chenked = findIndex(selectRemind, (value: any) => value.id == item.id) == -1 ? false : true;
      return (
        <div className={styles["checkbox-content"]}>
          <Checkbox
            checked={tabBtn == handleType.process ? true : chenked}
            disabled={item.disabled}
            onChange={CheckboxOnChange(item)}
            style={{ width: `100%` }}
          >
            <div className={styles["checkbox-item"]}>
              <span className={styles["item-key"]}>{item.data.key}</span>
              <span className={styles["item-content"]}>{item.data.content}</span>
            </div>
            {tabBtn == handleType.process && (
              <>
                <span className={styles["handle-time"]}>{formatDate(get(item, `handleTime`))}</span>
                <CustomIcon type="icon-laber" className={styles["icon-laber"]} />
              </>
            )}
            {tabBtn == handleType.ignore && (
              <span className={styles["handle-time"]}>{formatDate(get(item, `handleTime`))}</span>
            )}
          </Checkbox>
          {chenked && tabBtn == handleType.noprocess && (
            <AddDiagnoses
              headerInfo={headerInfo}
              diagnosesKey={item.data.key}
              diagId={item.id}
              handelProcess={handleProcess}
              diagnosesList={[]}
              page={page}
              setDiagnosesList={setDiagnosesList}
            />
          )}
        </div>
      );
    });
  }
  //#endregion

  //#region 判断
  function getDataByTab(type: handleType) {
    const postData = filter(websocketData, (item) => {
      return item.type == insideActive && item.level == type;
    });
    return postData;
  }
  function isDisabled() {
    let data = insideActive == riskType.RiskMark ? selectRiskMark : selectRemind;
    let bool = size(data) == 0;
    return bool;
  }

  function sizeData(type: string) {
    if (type == 'parent') {
      if (tabBtn == handleType.process) {
        return size(processData);
      } else if (tabBtn == handleType.noprocess) {
        return size(noProcessData);
      } else {
        return size(ignoreData);
      }
    } else if (type == 'riskMark') {
      if (tabBtn == handleType.process) {
        return size(processRiskMark);
      } else if (tabBtn == handleType.noprocess) {
        return size(noProcessRiskMark);
      } else {
        return size(ignoreRiskMark);
      }
    } else {
      if (tabBtn == handleType.process) {
        return size(processRemind);
      } else if (tabBtn == handleType.noprocess) {
        return size(noProcessRemind);
      } else {
        return size(ignoreRemind);
      }
    }
  }

  //#endregion

  return (
    <Modal
      {...others}
      width={1095}
      // style={{ left: '200px' }}
      visible={true}
      footer={null}

      className={styles["high-risk-warn-container"]}
    >
      <Tabs onChange={tabsOnChange} activeKey={activeKey}>
        <Tabs.TabPane tab="预警提醒" key="1">
          <div className={styles["content"]}>
            <div className={styles["tab-content"]}>
              <div
                onClick={handleTabBtnClick(handleType.noprocess)}
                className={classnames(styles['tab-btn2'], { [styles.active]: tabBtn == handleType.noprocess })}
              >
                <CustomIcon type="icon-all" className={'icon'} /> <span className={styles["btn-name"]}> 未处置</span>
              </div>
              <div
                onClick={handleTabBtnClick(handleType.process)}
                className={classnames(styles['tab-btn2'], { [styles.active]: tabBtn == handleType.process })}
              >
                <CustomIcon type="icon-batch" className={'icon'} /> <span className={styles["btn-name"]}> 已处置</span>
              </div>
              <div
                onClick={handleTabBtnClick(handleType.ignore)}
                className={classnames(styles['tab-btn2'], { [styles.active]: tabBtn == handleType.ignore })}
              >
                <CustomIcon type="icon-batch" className={'icon'} /> <span className={styles["btn-name"]}> 已忽略</span>
              </div>
            </div>
            {sizeData('parent') > 0 ? (
              <Tabs
                type="card"
                // accessKey={insideActive}
                activeKey={insideActive}
                className={styles["inside-content"]}
                onChange={(key: any) => {
                  setInsideActive(key);
                }}
              >
                {sizeData('remind') > 0 && (
                  <Tabs.TabPane tab={`漏诊提醒(${sizeData('remind')})`} key={riskType.DiagnosisRemind}>
                    {renderRemine()}
                  </Tabs.TabPane>
                )}
                {sizeData('riskMark') > 0 && (
                  <Tabs.TabPane
                    tab={`高危因素提醒(${get(
                      {
                        [handleType.process]: processRiskMarkLength,
                        [handleType.noprocess]: noProcessRiskMarklength,
                        [handleType.ignore]: ignoreRiskMarkLength,
                      },
                      tabBtn,
                    )
                      // tabBtn == handleType.process ? size(processRiskMark) : size(noProcessRiskMark)
                      // tabBtn == handleType.process ? processRiskMarkLength : noProcessRiskMarklength
                      })`}
                    key={riskType.RiskMark}
                  >
                    {renderRiskMark()}
                  </Tabs.TabPane>
                )}
              </Tabs>
            ) : (
              <Empty />
            )}

            {size(getDataByTab(handleType.noprocess)) > 0 && tabBtn == handleType.noprocess && (
              <div className={styles["foot"]}>
                <Button className={styles["button-noremind"]} onClick={handleIgnore('yes')} disabled={isDisabled()}>
                  忽略
                </Button>
                <Button className={styles["button-noremind"]} onClick={handleSure('no')}>
                  忽略全部,不再提醒
                </Button>
                {insideActive == riskType.RiskMark && (
                  <Button type="primary" onClick={handleSure('yes')} disabled={isDisabled()}>
                    确定
                  </Button>
                )}
              </div>
            )}
            {tabBtn == handleType.ignore && (
              <div className={styles["foot"]}>
                <div>取消忽略后，将恢复对应选项的提醒功能！</div>
                <Button type="primary" onClick={handleIgnore('no')} disabled={isDisabled()}>
                  取消忽略
                </Button>
              </div>
            )}
          </div>
        </Tabs.TabPane>
        {/* <Tabs.TabPane tab="高危快讯" key="2">
          <div className={styles["content"]}>
            {map(highriskData, (item, index) => {
              return (
                <div className={styles["risk-mian-content"]}>
                  <div className={styles["col-name"]}>{get(item, `colName`)}</div>
                  <div className={styles["news-content"]}>
                    {map(get(item, `news`), (newsItem, ind) => {
                      return (
                        <div className={styles["item-content"]}>
                          <div className={styles["item-title"]}>{get(newsItem, `title`)}</div>
                          <div className={styles["data-content"]}>
                            {map(get(newsItem, `contents`), (contentsItem, i) => {
                              return (
                                <div className={styles["item-event"]}>
                                  <span className={styles["event"]}>{get(contentsItem, `event`)}</span>
                                  {get(contentsItem, `date`) && (
                                    <span className={styles["date"]}>({get(contentsItem, `date`)})</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Tabs.TabPane> */}
      </Tabs>
    </Modal>
  );
}
