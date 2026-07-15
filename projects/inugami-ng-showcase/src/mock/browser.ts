import { setupWorker } from 'msw/browser'
import { labelhandlers } from './label.handler'
import {svgTimelineHandlers} from './inu-svg-timeline.handler'

export const worker = setupWorker(
  ...labelhandlers,
  ...svgTimelineHandlers
)
