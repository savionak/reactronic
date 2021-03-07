// The below copyright notice and the license permission notice
// shall be included in all copies or substantial portions.
// Copyright (C) 2016-2021 Yury Chetyrko <ychetyrko@gmail.com>
// License: https://raw.githubusercontent.com/nezaboodka/reactronic/master/LICENSE
// By contributing, you agree that your contributions will be
// automatically licensed under the license referred above.

import * as React from 'react'
import { reaction, cached, isolatedRun, Reactronic } from 'api' // from 'reactronic'

export class Component<P> extends React.Component<P> {
  @cached
  render(): JSX.Element {
    throw new Error('render method is undefined')
  }

  @reaction // called immediately in response to changes
  refresh(): void {
    if (this.shouldComponentUpdate())
      isolatedRun(() => this.setState({})) // ask React to re-render
  } // refresh is subscribed to render

  shouldComponentUpdate(): boolean {
    return !Reactronic.getController(this.render).isValid
  }

  componentDidMount(): void {
    this.refresh() // run to subscribe for the first time
  }

  componentWillUnmount(): void {
    isolatedRun(Reactronic.dispose, this)
  }
}
