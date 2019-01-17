import React from 'react'
import ReactDOM from 'react-dom'

import './styles.css'
// import Application from './name_app/components/Application'
import Application from './deck_of_cards_app/containers/Application'


ReactDOM.render(
  <Application />,
  document.getElementById("app")
)

module.hot.accept()
