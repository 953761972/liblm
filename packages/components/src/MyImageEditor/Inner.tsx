import { mchcEvent, mchcLogger } from '@lm_fe/env';
import { base64_to_image, safe_json_parse } from '@lm_fe/utils';
import { MyColor, MyIcon } from '@noah-libjs/components';
import { Button, Layout, Popover, Slider } from 'antd';
import classnames from 'classnames';
import { get, isString } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
import { init_delete_control } from './init_delete_control';
import { IMyImageEditorProps, MyImageEditorEvents, RealCanvas, RealListenCbs, default_legends, event_process, real_fabric } from './utils';

const { Sider, Content } = Layout;

function MyImageEditor_Inner(props: IMyImageEditorProps) {

  const { value, onChange, canvasOptions, legends = default_legends } = props;


  const gyImageEditorRef = useRef<HTMLDivElement>(null);

  //strokeWidth: number = 1;
  //fontSize: number = 18;
  //colors: any = "#fe547b";
  const containner = useRef<RealCanvas>();
  const currentType = useRef<string>('free')
  const textObject = useRef<any>(null)
  const drawingObject = useRef<any>(null)
  const mouseFrom = useRef<any>({})
  const idDrawing = useRef<boolean>(false)
  const isRedoing = useRef<boolean>(false)
  const mouseTo = useRef<any>({})
  const stateArr = useRef<any>([])
  const groupsObject = useRef<any>(null)
  const isTagging = useRef<boolean>(true)
  const freeDrawFlag = useRef<boolean>(false)
  const freeErase = useRef<boolean>(false)
  const textFlag = useRef<boolean>(false)
  const rectFlag = useRef<boolean>(false)
  const circleFlag = useRef<boolean>(false)
  const triangleFlag = useRef<boolean>(false)
  const lineFlag = useRef<boolean>(false)

  const legend_item = useRef<Partial<(typeof default_legends)[number]>>({})

  // const [legend_item, set_legend_item] = useState<Partial<(typeof default_legends)[number]>>({})
  const [colors, set_colors] = useState('#fe547b')
  const [strokeWidth, set_strokeWidth] = useState(1)
  const [fontSize, set_fontSize] = useState(18)
 

  useEffect(() => {
    initCanvas()
  }, [value])

  useEffect(() => {
    init_delete_control()
    createContainner()
  }, [])



  useEffect(() => {
    return initEvent();
  }, [colors, strokeWidth, fontSize, value])


  function broadcast_event<T extends keyof typeof MyImageEditorEvents>(type: (typeof MyImageEditorEvents)[T]) {
    mchcEvent.emit('custom_msg', {
      type,
      data: { ins: containner.current }
    })
  }

  function createContainner() {
    const w = gyImageEditorRef?.current?.clientWidth
    if (!containner.current) {

      const count = legends.length ?? 0
      const len = count ? 200 : 0

      containner.current = new (real_fabric()).Canvas('c', {
        backgroundColor: '#fff',
        width: gyImageEditorRef?.current?.clientWidth! - len,
        height: 460,
        ...canvasOptions
      })
      broadcast_event(MyImageEditorEvents.create)
    }
  }
  async function initCanvas() {
    mchcLogger.log('initCanvas', { value })
    if (value && isString(value)) {

      // 正常的json结构
      if (safe_json_parse(value)) {
        mchcLogger.log('initCanvas safe_json_parse', { value })

        containner.current?.loadFromJSON(value, () => { });
      } else {
        mchcLogger.log('initCanvas base64_to_image', { value })

        // 兼容base64 图片
        const img_el = await base64_to_image(value)
        if (img_el) {
          const img = new (real_fabric()).Image(img_el,)
          containner.current?.add(img)
        }
      }
    }
    if (!legends.length) {
      initfreeDraw();
    }
  }

  function initEvent() {
    let eventType = ['line', 'circle', 'rect', 'triangle', 'text'];
    const con = containner.current
    if (!con) return () => { }
    const __events: RealListenCbs = {
      drop(options) {
        const item = legend_item.current
        real_fabric().util.loadImage(
          get(item, 'img')!,
          (img) => {
            let legimg = new (real_fabric()).Image(img, {
              left: options.e.offsetX,
              top: options.e.offsetY,
              width: get(item, 'width'),
              height: get(item, 'height'),
              // @ts-ignore
              id: get(item, 'id'),
            });

            con.add(legimg);
            handleSelectDraw()
          },
          { crossOrigin: 'anonymous' },
        );
      },
      'mouse:down'(options) {
        if (eventType.indexOf(currentType.current) != -1) {
          mouseFrom.current.x = options.e.offsetX;
          mouseFrom.current.y = options.e.offsetY;
          idDrawing.current = true;
          switch (currentType.current) {
            case 'text':
              initText();
              break;
            default:
              break;
          }
        }
      },
      "mouse:move"(options: any) {
        if (idDrawing.current && eventType.indexOf(currentType.current) != -1) {
          mouseTo.current.x = options.e.offsetX;
          mouseTo.current.y = options.e.offsetY;
          switch (currentType.current) {
            case 'line':
              ininLine();
              break;
            case 'circle':
              initCircle();
              break;
            case 'rect':
              initRect();
              break;
            case 'triangle':
              initTriangle();
              break;
            case 'free':
              initfreeDraw();
              break;
            default:
              break;
          }
        }
      },
      'mouse:up'(options: any) {
        if (eventType.indexOf(currentType.current) != -1) {
          mouseTo.current.x = options.e.offsetX;
          mouseTo.current.y = options.e.offsetY;
          drawingObject.current = null;
          idDrawing.current = false;
          resetMove();
        }
      },
      'mouse:over'(options: any) { },
      'mouse:out'(options: any) { },
      'object:added'() {
        if (isRedoing.current == false) {
          stateArr.current = [];
        }
      }
    }



    return event_process(con, __events)
  }

  function initText() {

    createContainner()
    containner.current!.isDrawingMode = false;
    containner.current!.selection = false;

    textObject.current = new (real_fabric()).Textbox('', {
      left: mouseFrom.current.x,
      top: mouseFrom.current.y,
      fontSize: fontSize,
      fill: colors,
      hasControls: false,
    });
    containner.current?.add(textObject.current);
    textObject.current.enterEditing();
    textObject.current.hiddenTextarea.focus();
  };

  function initRect() {

    createContainner()

    let left = mouseFrom.current.x;
    let top = mouseFrom.current.y;
    let width = mouseTo.current.x - mouseFrom.current.x;
    let height = mouseTo.current.y - mouseFrom.current.y;
    let canvasObject = new (real_fabric()).Rect({
      left: left,
      top: top,
      width: width,
      height: height,
      stroke: colors,
      fill: 'rgba(255, 255, 255, 0)',
      strokeWidth: strokeWidth,
    });
    toggleDrawingObject(canvasObject);
  };

  function initCircle() {
    createContainner()

    let left = mouseFrom.current.x;
    let top = mouseFrom.current.y;
    let radius =
      Math.sqrt((mouseTo.current.x - left) * (mouseTo.current.x - left) + (mouseTo.current.y - top) * (mouseTo.current.y - top)) /
      2;
    let canvasObject = new (real_fabric()).Circle({
      left: left,
      top: top,
      stroke: colors,
      fill: 'rgba(255, 255, 255, 0)',
      radius: radius,
      strokeWidth: strokeWidth,
    });
    toggleDrawingObject(canvasObject);
  };

  function initTriangle() {
    createContainner()

    let left = mouseFrom.current.x;
    let top = mouseFrom.current.y;
    let height = mouseTo.current.y - mouseFrom.current.y;
    let width = Math.sqrt(Math.pow(height, 2) + Math.pow(height / 2.0, 2));
    let canvasObject = new (real_fabric()).Triangle({
      left: left,
      top: top,
      width: width,
      height: height,
      stroke: colors,
      fill: 'rgba(255, 255, 255, 0)',
      strokeWidth: strokeWidth,
    });
    toggleDrawingObject(canvasObject);
  };

  function ininLine() {

    createContainner()

    let canvasObject = new (real_fabric()).Line([mouseFrom.current.x, mouseFrom.current.y, mouseTo.current.x, mouseTo.current.y], {
      fill: colors,
      stroke: colors,
      strokeWidth: strokeWidth,
    });
    toggleDrawingObject(canvasObject);
  }

  function initfreeDraw() {

    createContainner()

    containner.current!.isDrawingMode = true;
    containner.current!.freeDrawingBrush.color = colors;
    containner.current!.freeDrawingBrush.width = strokeWidth;
    containner.current!.renderAll();
  }

  function toggleDrawingObject(canvasObject: any) {
    containner.current!.isDrawingMode = false;
    containner.current!.selection = false;
    canvasObject.selectable = false;
    if (drawingObject.current) {
      containner.current?.remove(drawingObject.current);
    }
    containner.current?.add(canvasObject);
    drawingObject.current = canvasObject;
    if (textObject.current) {
      textObject.current.exitEditing();
      textObject.current = null;
    }
  };

  function resetMove() {
    mouseFrom.current = {};
    mouseTo.current = {};
  };

  //开始拖拽图片
  function handleDragStart(e: any, item: any) {
    legend_item.current = item
  };

  //后退
  function handleRevoke() {
    if (containner.current?._objects.length! > 0) {
      stateArr.current.push(containner.current?._objects.pop());
      containner.current?.renderAll();
    }
  };

  //前进
  function handleRedo() {
    if (stateArr.current.length > 0) {
      isRedoing.current = true;
      containner.current?.add(stateArr.current.pop());
      containner.current?.renderAll();
    }
  };

  //清除
  function handleClear() {
    containner.current?.clear();
    containner.current!.backgroundColor = '#fff';
    resetMove();
    isRedoing.current = false;
    stateArr.current = [];
  };

  //擦除
  function handleFreeErase() {
    if (!real_fabric().EraserBrush) return
    if (freeErase.current) {
      freeErase.current = false;

      containner.current!.isDrawingMode = false;
    } else {
      freeErase.current = true;
      freeDrawFlag.current = false;
      textFlag.current = false;
      rectFlag.current = false;
      circleFlag.current = false;
      triangleFlag.current = false;
      lineFlag.current = false;
      removeTextObject();
      // 开启画布自由绘画模式
      containner.current!.isDrawingMode = true;
      // 设置自由绘画模式 画笔颜色与画笔线条大小

      containner.current!.freeDrawingBrush = new (real_fabric()).EraserBrush(containner.current!);

      containner.current!.freeDrawingBrush.width = 20;
      currentType.current = 'free';
    }
  };
  //自由绘画
  function handleFreeDraw() {
    if (freeDrawFlag.current) {
      freeDrawFlag.current = false;
      containner.current!.isDrawingMode = false;
    } else {
      freeDrawFlag.current = true;
      freeErase.current = false;
      textFlag.current = false;
      rectFlag.current = false;
      circleFlag.current = false;
      triangleFlag.current = false;
      lineFlag.current = false;

      if (real_fabric().PencilBrush) {
        containner.current!.freeDrawingBrush = new (real_fabric()).PencilBrush(containner.current!);
      }


      removeTextObject();
      // 开启画布自由绘画模式
      containner.current!.isDrawingMode = true;
      // 设置自由绘画模式 画笔颜色与画笔线条大小
      containner.current!.freeDrawingBrush.color = colors;
      containner.current!.freeDrawingBrush.width = strokeWidth;
      currentType.current = 'free';
    }
  };

  //文本
  function handleTextDraw() {
    if (textFlag.current) {
      textFlag.current = false;
      removeTextObject();
    } else {
      textFlag.current = true;
      freeDrawFlag.current = false;
      freeErase.current = false;

      rectFlag.current = false;
      circleFlag.current = false;
      triangleFlag.current = false;
      lineFlag.current = false;
      currentType.current = 'text';
      containner.current!.isDrawingMode = false;
      containner.current!.selection = false;
      clearSelectable();
      if (drawingObject.current) {
        containner.current?.remove(drawingObject.current);
      }
    }
  };

  //矩形
  function handleRectDraw() {
    if (rectFlag.current) {
      rectFlag.current = false;
      currentType.current = '';
    } else {
      rectFlag.current = true;
      textFlag.current = false;
      freeDrawFlag.current = false;

      freeErase.current = false;

      circleFlag.current = false;
      triangleFlag.current = false;
      lineFlag.current = false;
      isTagging.current = false;
      currentType.current = 'rect';
      clearSelectable();
      initRect();
    }
  };

  //圆形
  function handleCircleDraw() {
    if (circleFlag.current) {
      circleFlag.current = false;
      currentType.current = '';
    } else {
      rectFlag.current = false;
      textFlag.current = false;
      freeDrawFlag.current = false;
      freeErase.current = false;

      circleFlag.current = true;
      triangleFlag.current = false;
      lineFlag.current = false;
      currentType.current = 'circle';
      clearSelectable();
      initCircle();
    }
  };

  //三角形
  function handleTriangleDraw() {
    if (triangleFlag.current) {
      triangleFlag.current = false;
      currentType.current = '';
    } else {
      rectFlag.current = false;
      textFlag.current = false;
      freeDrawFlag.current = false;
      freeErase.current = false;

      circleFlag.current = false;
      triangleFlag.current = true;
      lineFlag.current = false;
      currentType.current = 'triangle';
      clearSelectable();
      initTriangle();
    }
  };

  //直线
  function handleLineDraw() {
    if (lineFlag.current) {
      lineFlag.current = false;
      currentType.current = '';
    } else {
      rectFlag.current = false;
      textFlag.current = false;
      freeDrawFlag.current = false;
      freeErase.current = false;
      circleFlag.current = false;
      triangleFlag.current = false;
      lineFlag.current = true;
      currentType.current = 'line';
      clearSelectable();
      ininLine();
    }
  };

  //下载图片
  function handleExport() {
    const dataURL = containner.current?.toDataURL({
      width: containner.current?.width,
      height: containner.current?.height,
      left: 0,
      top: 0,
      format: 'png',
    });
    const link = document.createElement('a');
    link.download = 'canvas.current?.png';
    link.href = dataURL!;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  function removeTextObject() {
    currentType.current = '';
    if (textObject.current) {
      textObject.current.exitEditing();
      textObject.current = null;
    }
  };

  //颜色设置
  function handleGradePicker(css: any) {
    containner.current!.freeDrawingBrush.color = css;

    set_colors(css)
  };

  //粗细设置
  function handleSlider(value: any) {
    console.log('value', value)
    set_strokeWidth(value)

  };

  //字体设置
  function handleTextSlider(value: any) {
    set_fontSize(value)
  };

  //清除选中
  function clearSelectable() {
    containner.current?.getObjects().map((item) => {
      item.set('selectable', false);
    });
  };

  //不可选中
  function handleUnselectDraw() {
    containner.current!.isDrawingMode = false
    removeTextObject();
    clearSelectable();
    containner.current?.renderAll();
  };

  //可选中
  function handleSelectDraw() {
    containner.current!.isDrawingMode = false

    removeTextObject();
    containner.current?.getObjects().map((item: any) => {
      item.set('selectable', true);
    });
    containner.current?.renderAll();
  };

  //保存图片到后台
  function handleImgSave() {
    const value = JSON.stringify(containner.current);
    containner.current?.requestRenderAll();

    onChange?.(value);
    broadcast_event(MyImageEditorEvents.save)
    // 反序列化
    // canvas.current?.loadFromJSON(value)
  };



  function renderSetUp() {

    return (
      <>
        <div className={styles["slider"]} style={{ width: 300 }}>
          <span>粗细</span>
          <Slider onChange={handleSlider} value={strokeWidth} />
        </div>
        <div className={styles["picker"]} style={{ width: 300 }}>
          <span>颜色</span>
          <MyColor width={'300'} color={colors} onChange={handleGradePicker} />
        </div>
      </>
    );
  };

  function renderTextSetUp() {

    return (
      <>
        <div className={styles["slider"]} style={{ width: 300 }}>
          <span>大小</span>
          <Slider onChange={handleTextSlider} value={fontSize} />
        </div>
        <div className={styles["picker"]} style={{ width: 300 }}>
          <span>颜色</span>
          <MyColor width={'300'} color={colors} onChange={handleGradePicker} />
        </div>
      </>
    );
  };



  return (
    <div>


      <div className={styles["gy-image-editor"]} ref={gyImageEditorRef}>
        <Layout  >
          {
            legends.length ?
              <Sider style={{ borderTop: '1px solid #d7dce7' }}>
                <div id={styles["images"]}>

                  {
                    legends.map((l, idx) => {
                      return <div>
                        <div className={styles["box-img"]}>
                          <img
                            draggable="true"
                            onDragStart={(e) =>
                              handleDragStart(e, {
                                ...l,
                                id: idx,
                              })
                            }
                            src={l.img}
                          />
                        </div>
                        <div className={styles["box-text"]}>{l.label}</div>
                      </div>
                    })
                  }
                </div>
              </Sider>
              : null
          }
          <Content>
            <div id={styles['canvas-container']}>
              <canvas
                // width={canvasWidth}
                // height="460"
                id="c"
                style={{ border: '1px solid #d7dce7' }}
              ></canvas>
              <div className={styles["tool-bar"]}>
                <div className={styles["tool-bar-container"]}>
                  <Popover placement="left" content={<span>后退</span>}>
                    <Button onClick={handleRevoke} icon={<span className={classnames(styles["button-icon"], styles["back"])}></span>}></Button>
                  </Popover>
                  <Popover placement="left" content={<span>前进</span>}>
                    <Button onClick={handleRedo} icon={<span className={classnames(styles["button-icon"], styles["forward"])}></span>}></Button>
                  </Popover>
                  {
                    (real_fabric() as any)?.EraserBrush
                      ? <Popover placement="left" content={<span>擦除</span>}>
                        <Button onClick={handleFreeErase} icon={<MyIcon value='ClearOutlined' />}></Button>
                      </Popover>
                      : null
                  }
                  <Popover placement="left" content={renderSetUp()} title="设置">
                    <Button onClick={handleFreeDraw} icon={<span className={classnames(styles["button-icon"], styles["pen"])}></span>}></Button>
                  </Popover>
                  <Popover placement="left" content={renderTextSetUp()} title="设置">
                    <Button
                      onClick={handleTextDraw}
                      icon={<span className={classnames(styles["button-icon"], styles["text"])}></span>}
                    ></Button>
                  </Popover>
                  <Popover placement="left" content={renderSetUp()} title="设置">
                    <Button
                      onClick={handleRectDraw}
                      icon={<span className={classnames(styles["button-icon"], styles["rect"])}></span>}
                    ></Button>
                  </Popover>
                  <Popover placement="left" content={renderSetUp()} title="设置">
                    <Button
                      onClick={handleCircleDraw}
                      icon={<span className={classnames(styles["button-icon"], styles["circle-icon2"])}></span>}
                    ></Button>
                  </Popover>
                  <Popover placement="left" content={renderSetUp()} title="设置">
                    <Button
                      onClick={handleTriangleDraw}
                      icon={<span className={classnames(styles["button-icon"], styles["triangle"])}></span>}
                    ></Button>
                  </Popover>
                  <Popover placement="left" content={renderSetUp()} title="设置">
                    <Button
                      onClick={handleLineDraw}
                      icon={<span className={classnames(styles["button-icon"], styles["line"])}></span>}
                    ></Button>
                  </Popover>
                  <Popover placement="left" content={<span>清除</span>}>
                    <Button onClick={handleClear} icon={<span className={classnames(styles["button-icon"], styles["clear"])}></span>}></Button>
                  </Popover>
                  <Popover placement="left" content={<span>导出</span>}>
                    <Button
                      onClick={handleExport}
                      icon={<span className={classnames(styles["button-icon"], styles["export"])}></span>}
                    ></Button>
                  </Popover>
                  <Popover placement="left" content={<span>可选中</span>}>
                    <Button
                      onClick={handleSelectDraw}
                      icon={<span className={classnames(styles["button-icon"], styles["selected"])}></span>}
                    ></Button>
                  </Popover>
                  <Popover placement="left" content={<span>不可选中</span>}>
                    <Button
                      onClick={handleUnselectDraw}
                      icon={<span className={classnames(styles["button-icon"], styles["noselected"])}></span>}
                    ></Button>
                  </Popover>
                  <Popover placement="left" content={<span>保存</span>}>
                    <Button onClick={handleImgSave} icon={<span className={classnames(styles["button-icon"], styles["save"])}></span>}></Button>
                  </Popover>
                </div>
              </div>
            </div>
          </Content>
        </Layout>
      </div>

    </div>
  );
}
export default MyImageEditor_Inner;
