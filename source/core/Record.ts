// The below copyright notice and the license permission notice
// shall be included in all copies or substantial portions.
// Copyright (C) 2016-2019 Yury Chetyrko <ychetyrko@gmail.com>
// License: https://raw.githubusercontent.com/nezaboodka/reactronic/master/LICENSE

import { Utils, undef } from '../util/all'

export type F<T> = (...args: any[]) => T

// Context

export interface Context {
  readonly id: number
  readonly hint: string
  readonly timestamp: number
}

// Field

export type FieldKey = PropertyKey

export type FieldHint = {
  readonly times: number
  readonly record: Record
  readonly field: FieldKey
}

export class FieldValue {
  value: any
  replacer?: Record
  observers?: Set<Observer>
  get copyOnWriteMode(): boolean { return true }
  constructor(value: any) { this.value = value }
}

// Record

export class Record {
  readonly creator: Context
  readonly prev: { record: Record }
  readonly data: any
  readonly changes: Set<FieldKey>
  readonly conflicts: Map<FieldKey, Record>

  constructor(creator: Context, prev: Record, data: object) {
    this.creator = creator
    this.prev = { record: prev }
    this.data = data
    this.changes = new Set<FieldKey>()
    this.conflicts = new Map<FieldKey, Record>()
    Object.freeze(this)
  }

  static blank: Record

  /* istanbul ignore next */
  static markChanged = function(record: Record, field: FieldKey, value: any, changed: boolean): void {
    return undef() // to be redefined by Cache implementation
  }

  /* istanbul ignore next */
  static markViewed = function(record: Record, field: FieldKey, value: FieldValue, weak: boolean): void {
    return undef() // to be redefined by Cache implementation
  }

  freeze(): void {
    Object.freeze(this.data)
    Utils.freezeSet(this.changes)
    Utils.freezeMap(this.conflicts)
  }
}

// Observer

export interface Observer {
  hint(notran?: boolean): string
  bind<T>(func: F<T>): F<T>
  readonly invalid: { since: number }
  invalidateDueTo(cause: FieldValue, hint: FieldHint, since: number, triggers: Observer[]): void
  trig(timestamp: number, now: boolean, nothrow: boolean): void
}
