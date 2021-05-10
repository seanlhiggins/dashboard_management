import React from 'react';
import { render } from 'react-dom'
import { ExtensionProvider } from '@looker/extension-sdk-react'
import  App  from './components/App'
import { Card, ComponentsProvider, Button,Heading, Text } from '@looker/components'

window.addEventListener('DOMContentLoaded', (event) => {
  const root = document.createElement('div')
  document.body.appendChild(root)
  render(<Main />, root)
})
  
  
const Main = () => {
    
    return <>
      <ExtensionProvider 
        loadingComponent='Loading ...'
      >
          <App />

      </ExtensionProvider>
    </>
  }