import { lazy } from 'react'
import { ArrayPanel_DisplayFC } from './Display'

const Inner = lazy(() => import('./Inner'))

const MixPanel = Object.assign(Inner, { DisplayFC: ArrayPanel_DisplayFC })

export { MixPanel }
