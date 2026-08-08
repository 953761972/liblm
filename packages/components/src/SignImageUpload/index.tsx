import { message, Upload } from 'antd';
import React, { useEffect, useState } from 'react';

const PNG_PREFIX = 'data:image/png;base64,';

interface ISignImageUploadProps {
  /** 已保存的电子签名(base64 字符串, 兼容带 data:image/png;base64, 前缀) */
  value?: string;
  onChange?(v?: string): void;
  disabled?: boolean;
  /** 文件选择过滤, 默认仅 png */
  accept?: string;
  /** 限制大小(MB), 默认 2 */
  maxSizeMB?: number;
}

function withPngPrefix(v: string) {
  return v.startsWith('data:') ? v : `${PNG_PREFIX}${v}`;
}

async function checkPngSignature(file: File) {
  try {
    const buf = await file.slice(0, 8).arrayBuffer();
    const bytes = new Uint8Array(buf);
    // PNG 文件头魔数: 89 50 4E 47 0D 0A 1A 0A
    return (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    );
  } catch {
    return false;
  }
}

export function SignImageUpload(props: ISignImageUploadProps) {
  const { value, onChange, disabled, accept = '.png,image/png', maxSizeMB = 2 } = props;
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    setFileList(
      value
        ? [
            {
              uid: '-1',
              name: '电子签名.png',
              status: 'done',
              url: withPngPrefix(value),
            },
          ]
        : [],
    );
  }, [value]);

  const readAsBase64 = (file: File) =>
    new Promise<{ base64: string; preview: string }>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        // 去掉 'data:image/png;base64,' 前缀, 只保留 base64 内容
        resolve({
          base64: dataUrl.replace(/^data:image\/png;base64,/, ''),
          preview: dataUrl,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const beforeUpload = async (file: File) => {
    const nameOk = /\.png$/i.test(file.name);
    const mimeOk = file.type === 'image/png';
    const sigOk = await checkPngSignature(file);
    if (!(nameOk && mimeOk) && !sigOk) {
      message.error('电子签名仅支持 PNG 格式图片');
      return Upload.LIST_IGNORE;
    }
    if (file.size / 1024 / 1024 > maxSizeMB) {
      message.error(`图片大小不能超过 ${maxSizeMB}MB`);
      return Upload.LIST_IGNORE;
    }
    const { base64, preview } = await readAsBase64(file);
    setFileList([{ uid: '-1', name: file.name, status: 'done', url: preview }]);
    onChange?.(base64);
    return false; // 阻止默认上传, 图片直接以 base64 保存
  };

  const handleRemove = () => {
    setFileList([]);
    onChange?.(undefined);
  };

  return (
    <Upload
      accept={accept}
      listType="picture-card"
      fileList={fileList}
      beforeUpload={beforeUpload}
      onRemove={handleRemove}
      disabled={disabled}
    >
      {fileList.length === 0 && (
        <div style={{ lineHeight: 1.4 }}>
          <div>+</div>
          <div style={{ fontSize: 12 }}>上传电子签名</div>
        </div>
      )}
    </Upload>
  );
}

export default SignImageUpload;