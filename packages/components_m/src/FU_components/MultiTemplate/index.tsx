import { lazy } from 'react';
export const MultiTemplate = lazy(() => import('./Inner'))
export { MultiTemplateTemplateGroup } from './Templates'
export * from './types'
