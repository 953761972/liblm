import { packs } from '@noah-libjs/components'
import { MyAddress } from './MyAddress'
import { MyImageEditor } from './MyImageEditor'
import { PatientSelect } from './PatientSelect'
import { ArraySingle } from './ArraySingle'
import { SignImageUpload } from './SignImageUpload'

export * from './MyAddress'
export * from './MyImageEditor'
export * from './PatientSelect'
export * from './SignImageUpload'
export const pack_components = {
    ...packs,
    MyAddress,
    MyImageEditor,
    ArraySingle,
    PatientSelect,
    SignImageUpload
}
