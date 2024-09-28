import { useState } from 'react'
import InjectedWallet from './components/InjectedWallet'
import ErrorBoundary from './errors/ErrorBoundary'
import './App.css'

function App() {
  return (
    <>
      <ErrorBoundary>
        <InjectedWallet />
      </ErrorBoundary>
    </>
  )
}

export default App
