import { mchcEnv } from "@lm_fe/env"
import { mchcModal__, safe_navigate } from "@lm_fe/pages"
import { AnyObject, request } from "@lm_fe/utils"

export function create_menu(gen_route: (name: string) => string) {
    mchcModal__.open('modal_form', {
        width: '20vw',
        styles: { body: { height: '20vh', } },
        modal_data: {
            targetLabelCol: 8,
            async onSubmit({ name, parentid, ...others }: any, old_data: any) {
                const key = gen_route(name)
                const res = await request.get<AnyObject[]>('/api/permissions', { params: { 'key.equals': key } })
                if (res.data.length) {
                    mchcEnv.warning('已存在')
                    return
                }
                await request.post<AnyObject[]>('/api/permissions', { key, name, active: true, parentid: parentid ?? 0, type: 'menu', ...others })
                safe_navigate(key)


            },

            formDescriptions: [
                {
                    inputType: 'MA',
                    name: 'name',
                    label: '菜单标题',
                    required: true,
                    layout: '1'

                },
                {
                    inputType: 'MS',
                    name: 'parentid',
                    label: '菜单父级',
                    layout: '1',
                    inputProps: {
                        marshal: 0,
                        fetch_options: { url: '/api/permissions?size=999&parentid.equals=0&type.equals=menu', valueKey: 'id', labelKey: 'name' }
                    }
                },



            ]
        }
    })
}