import { setupWorker } from 'msw/browser'
import { labelhandlers } from './label.handler'

export const worker = setupWorker(
  ...labelhandlers
)
