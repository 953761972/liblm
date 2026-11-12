
// import { message } from "antd"
import { rt_ctx } from "@lm_fe/env"
import { BF_Wrap2, Dyn_Render } from "@lm_fe/pages"
import { get_global_happy_arg } from "@lm_fe/utils"
const ctx = rt_ctx
const React = rt_ctx.React
function Dyn(props: { configId?: string }) {

    const conf_title: string = decodeURI(get_global_happy_arg('usr1') ?? props.configId)
    if (!conf_title || conf_title === 'undefined') return <div>请配置title</div>
    const { config, Wrap } = BF_Wrap2({
        default_conf: {
            title: conf_title.includes('-') ? (conf_title as any) : `动态页-${conf_title}`,
            tableColumns: () => import('./config'),
        }
    })
    return <Wrap>
        <Dyn_Render conf={config?.tableColumns} />
    </Wrap>

}
export default Dyn