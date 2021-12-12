import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import 'inter-ui'
import React, { StrictMode } from 'react'
import { isMobile } from 'react-device-detect'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import Blocklist from './components/Blocklist'
import { NetworkContextName } from './constants'
import './i18n'
import App from './pages/App'
import store from './state'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import UserUpdater from './state/user/updater'
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from './theme'
import getLibrary from './utils/getLibrary'
import { firebaseConfig } from './config'
import { initializeApp, FirebaseApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged, 
  connectAuthEmulator,
  setPersistence,
  browserSessionPersistence,
} from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import Snowfall from 'react-snowfall'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

const firebaseApp: FirebaseApp = initializeApp(firebaseConfig)
const analytics = getAnalytics(firebaseApp)

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

const GOOGLE_ANALYTICS_ID: string | undefined = process.env.REACT_APP_GOOGLE_ANALYTICS_ID
if (typeof GOOGLE_ANALYTICS_ID === 'string') {
  ReactGA.initialize(GOOGLE_ANALYTICS_ID, {
    gaOptions: {
      storage: 'none',
      storeGac: false,
    },
  })
  ReactGA.set({
    anonymizeIp: true,
    customBrowserType: !isMobile
      ? 'desktop'
      : 'web3' in window || 'ethereum' in window
      ? 'mobileWeb3'
      : 'mobileRegular',
  })
} else {
  ReactGA.initialize('test', { testMode: true, debug: true })
}

window.addEventListener('error', (error) => {
  ReactGA.exception({
    description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
    fatal: true,
  })
})

function Updaters() {
  return (
    <>
      <ListsUpdater />
      <UserUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  )
}

const auth = getAuth()
const db = getFirestore()

if (process.env.NODE_ENV !== 'production') {
  connectAuthEmulator(auth, "http://localhost:9099")
  connectFirestoreEmulator(db, 'localhost', 8080)
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    setPersistence(auth, browserSessionPersistence)
    console.log('got a user!', user)
    ReactDOM.render(
      <StrictMode>
        <FixedGlobalStyle />
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ProviderNetwork getLibrary={getLibrary}>
            <Blocklist>
              <Provider store={store}>
                <Updaters />
                <ThemeProvider>
                  <ThemedGlobalStyle />
                  <HashRouter>
                    <Snowfall color="white" />
                    <App />
                  </HashRouter>
                </ThemeProvider>
              </Provider>
            </Blocklist>
          </Web3ProviderNetwork>
        </Web3ReactProvider>
      </StrictMode>,
      document.getElementById('root')
    )
  } else {
    signInAnonymously(auth)
  }
})

serviceWorkerRegistration.unregister()
