import React from 'react'
import ReactDOM from 'react-dom'

import './styles.css'
import Application from './containers/Application'


ReactDOM.render(
  <Application />,
  document.getElementById("app")
)

module.hot.accept()
