// The below copyright notice and the license permission notice
// shall be included in all copies or substantial portions.
// Copyright (C) 2016-2019 Yury Chetyrko <ychetyrko@gmail.com>
// License: https://raw.githubusercontent.com/nezaboodka/reactronic/master/LICENSE

import { State } from './impl/Hooks'
import { MonitorImpl } from './impl/MonitorImpl'

export abstract class Monitor extends State {
  abstract readonly busy: boolean
  abstract readonly workerCount: number
  abstract readonly workers: ReadonlySet<Worker>
  abstract readonly animationFrameCount: number

  abstract enter(worker: Worker): void
  abstract leave(worker: Worker): void

  static create(hint?: string, delayBeforeIdle?: number): Monitor { return MonitorImpl.create(hint, delayBeforeIdle) }
}

export interface Worker {
  readonly id: number
  readonly hint: string
  readonly isCanceled: boolean
  readonly isFinished: boolean
  cancel(error: Error, restartAfter?: Worker | null): this
  whenFinished(): Promise<void>
}