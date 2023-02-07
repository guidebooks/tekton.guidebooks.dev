/*
 * Copyright 2022 The Kubernetes Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { PureComponent } from 'react'
import { KubeResource } from "@kui-shell/plugin-kubectl"
import type { Arguments, KResponse, ParsedOptions, Tab } from '@kui-shell/core'
import { Loading, onCommentaryEdit, offCommentaryEdit } from '@kui-shell/plugin-client-common'

import { parse } from '../lib/read'
import tekton2graph from '../lib/tekton2graph'

type Channel = string
type Source = {
  /** Tekton yaml */
  input: string

  /** Tekton yaml original filepath */
  filepath?: string
}

/** <Playground/> react props */
export type Props = {
  /** Channel name to listen on. This should be matched with a `commentary --send <channel>` */
  source: Channel | Source

  /** Kui REPL controller */
  tab: Tab
}

function isChannel(source: Props['source']): source is Channel {
  return typeof source === 'string'
}

/** <Playground/> react state */
type State = Source & {
    /** Error in madwizard? */
    internalError?: Error,

    content?: HTMLElement
  }

export default class Playground extends PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    if (!isChannel(props.source)) {
      this.state = {
        input: props.source.input,
        filepath: props.source.filepath,
      }
    }
  }

  private readonly _onEdit = async (source: string, filepath?: string) => {
    this.setState({ input: source, filepath })
  }
  
  private get REPL() {
    return this.props.tab.REPL
  }

  private async parse(raw: string, filepath = '') {
    try {
    const jsons = await parse(raw)
    const [graph] = await Promise.all([
      tekton2graph(jsons, filepath/*, run*/) // generate the graph model
    ])
    
    const { graph2doms, zoomToFitButtons } = await import('@kui-shell/plugin-wskflow')

    const content = document.createElement('div')
    const { view, controller } = await graph2doms(this.props.tab, graph, content, graph.runs, {
    layoutOptions: {
      'elk.separateConnectedComponents': false,
      'elk.spacing.nodeNode': 10,
      'elk.padding': '[top=10,left=7.5,bottom=10,right=7.5]',
      hierarchyHandling: 'INCLUDE_CHILDREN' // since we have hierarhical edges, i.e. that cross-cut subgraphs
    }
  })
    
      this.setState({ content })
    } catch (err) {
      console.error(err)
      this.setState({ internalError: err })
    }
  }

 
  public componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state?.input && (prevState?.input !== this.state.input)) {
      this.parse(this.state.input)
    }
  }
  
  public componentDidMount() {
    if (isChannel(this.props.source)) {
      // we don't have the markdown source yet, so listen on the given
      // channel for that source
      onCommentaryEdit(this.props.source, this._onEdit)
    }
  }

  public componentWillUnmount() {
    if (isChannel(this.props.source)) {
      offCommentaryEdit(this.props.source, this._onEdit)
    }
  }

  public render() {
    if (this.state?.internalError) {
      return 'Internal Error'
    } else if (!this.state?.content) {
      return <Loading/>
    }

    return <div className="padding-content flex-layout flex-fill" dangerouslySetInnerHTML={{__html: this.state.content.innerHTML}}/>
  }
}

type Options = ParsedOptions

/** Open a Playground that listens for source on a given named `channel` */
export function listenOnChannel(args: Arguments<Options>) {
  const channel = args.argvNoOptions[2]
  if (!channel) {
    throw new Error('Usage: madwizard playground <channel>')
  }

  return <Playground source={channel} tab={args.tab} />
}
