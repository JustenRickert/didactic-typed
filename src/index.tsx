import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {Container, State as ContainerState} from './Container'

const storageName = 'app'
const storage = localStorage.getItem(storageName)
const stored =
  storage !== null ? (JSON.parse(storage) as ContainerState) : undefined

ReactDOM.render(
  <Container storedData={stored} localStorageName={storageName} />,
  document.getElementById('app')
)
