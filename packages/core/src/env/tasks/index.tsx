
import { mchcEnv, mchcLogger, mchcUtils } from '@lm_fe/env';
import { use_provoke } from '@lm_fe/provoke';
import { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { checkLogin } from './checkLogin';
import { checkVersion } from './checkVersion';
const minute = 60 * 1000

export function use_task(disabled = false) {

    const { fetch_user, fetch_sys_config, sys_theme } = use_provoke()
    const history = useHistory()
    const interval_ids = useRef<number[]>([])
    useEffect(() => {
        mchcUtils.setGlobalHistory(() => history)
        fetch_user_info()
        fetch_sys_config()
        history.listen((loc, act) => {
            mchcLogger.log('history', { loc, act, len: history.length })
        })
    }, [])
    function fetch_user_info() {
        const in_login_page = location.pathname.includes('/login')
        // 需要支持 sp=1
        if (!mchcEnv.isSp)
            fetch_user()
                .then(() => {
                    if (in_login_page)
                        mchcEnv.reload('/')
                })
                .catch(e => {
                    interval_ids.current.forEach(id => clearInterval(id))
                })
    }
    useEffect(() => {

        if (!disabled) {
            interval_ids.current.push(setInterval(fetch_user_info, 5 * minute))
            interval_ids.current.push(setInterval(checkVersion, 2 * minute))
            interval_ids.current.push(setInterval(checkLogin, 5 * minute))

        }
        return () => {

        }
    }, [])
    return { sys_theme }
}
