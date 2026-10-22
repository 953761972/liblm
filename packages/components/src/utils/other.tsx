import { mchcEnv } from "@lm_fe/env"
import { AnyObject } from "@lm_fe/utils"
import { form_validate } from "@noah-libjs/components"
import { FormInstance } from "antd"



export async function validate_form<T = AnyObject>(f: FormInstance) {
  try {
    return await form_validate<T>(f)
  } catch (e: any) {
    mchcEnv.warning(e?.text)
    return null
  }
}
(window as any).validate_form = validate_form