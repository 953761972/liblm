import { mchcEnv, mchcEvent, mchcLogger, mchcMacro } from "@lm_fe/env";
import { getSearchParamsValue, safe_json_parse } from "@lm_fe/utils";
import { useState, useEffect } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
export function useObisDoctorWs(pid: number) {
    const [websocketServicesInstance, setWebsocketServicesInstance] = useState<ReconnectingWebSocket | null>(null)
    const PUBLIC_PATH = mchcMacro.PUBLIC_PATH ?? ''
    const HOST_URL = mchcMacro.HOST_URL ?? ''

    useEffect(() => {

        initWebsocket()
        return () => {

        }
    }, [])

    async function initWebsocket() {
        const address = getWebsocketAddress();
        const newPUBLIC_PATH = PUBLIC_PATH && PUBLIC_PATH.substring(0, PUBLIC_PATH.lastIndexOf('/'));
        const websocketAddress =
            'ws://' +
            address +
            (newPUBLIC_PATH ? newPUBLIC_PATH : '') +
            '/ws/obis-doctor?token=' +
            mchcEnv.token +
            '&pregnancyId=' +
            pid;
        mchcLogger.log('ws 初始化', websocketAddress);

        // 初始化websocket
        const options = {
            connectionTimeout: 10000, // 如果在10s之后没有连接，重试连接
        };
        const ins = await new ReconnectingWebSocket(websocketAddress, [], options);
        setWebsocketServicesInstance(ins);

        ins.addEventListener('open', (e: any) => {
            setInterval(() => {
                ins.send('currenttime');
            }, 20 * 1000);
        });
        ins.addEventListener('message', (e) => {
            mchcEvent.emit('ws_event', { type: 'obis-doctor', event: 'message', data: safe_json_parse(e.data, {}), ins })

        });
        ins.addEventListener('error', (e: any) => {

            mchcEvent.emit('ws_event', { type: 'obis-doctor', event: 'error', ins })

        });
        ins.addEventListener('close', (e: any) => {
            mchcEvent.emit('ws_event', { type: 'obis-doctor', event: 'close', ins })
        });
    }




    function getWebsocketAddress() {
        let address = '';
        if (mchcEnv.isDev) {
            try {
                address = HOST_URL?.substr(HOST_URL.lastIndexOf('/') + 1)
                if (!address) {
                    address = window.location.host
                }
            } catch (error) {
                console.error('address 截取错误');
            }
        } else {
            address = window.location.host;
        }
        return address;
    }

}