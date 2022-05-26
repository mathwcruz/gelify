import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import '../styles/globals.css'

import { CityProvider } from '../contexts/CityContext'
import { PersonProvider } from '../contexts/PersonContext'
import { Header } from '../components/Header'

function App({ Component, pageProps }: AppProps) {
  return (
    <CityProvider>
      <PersonProvider>
        <ToastContainer />
        <div>
          <Header />
          <Component {...pageProps} />
        </div>
      </PersonProvider>
    </CityProvider>
  )
}

export default App
