import { mchcModal__, MyBaseListProps } from "@lm_fe/pages";
import { Button, Space } from "antd";
import React from "react";
import PrenatalModalArchive from "../../pregnancy/list/components/prenatal-modal-archive/prenatal-modal-archive";
import { getPregnancyId, isArchived } from "./constant";

export function useTableConfig(props: any) {
    /** 打开产检本归档预览（写法同孕册列表的「产检本」按钮） */
    function handleArchive(rowData: any) {
        mchcModal__.open('test', {
            title: null,
            closeIcon: null,
            width: '95vw',
            styles: {
                header: { width: 0, height: 0 },
            },
            modal_data: {
                content: <PrenatalModalArchive
                    selectedRowData={rowData}
                    {...props}
                    onClose={() => mchcModal__.pop()}
                    id={getPregnancyId(rowData)}
                />
            }
        })
    }

    /** 查看已归档的产检本 pdf（后端以 base64 返回，字段名 pdfdata） */
    function handleViewArchive(rowData: any) {
        mchcModal__.open('print_modal', {
            modal_data: {
                requestConfig: {
                    url: '/api/pdf-preview-document/getArchivedPDF',
                    method: 'GET',
                    params: { id: getPregnancyId(rowData) },
                },
            },
        })
    }

    const config: MyBaseListProps = {
        effect_ctx: props,
        name: '/pregnancies',
        baseTitle: '归档管理',
        showAdd: false,
        RenderAction: ({ rowData }) => {
            return (
                <Space>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => handleArchive(rowData)}
                    >
                        归档
                    </Button>
                    {
                        isArchived(rowData) && <Button
                            type="link"
                            size="small"
                            onClick={() => handleViewArchive(rowData)}
                        >
                            查看归档
                        </Button>
                    }
                </Space>
            );
        },
    }
    return [
        config
    ] as const
}
