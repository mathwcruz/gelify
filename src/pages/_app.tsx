import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import '../styles/globals.css'

import { CityProvider } from '../contexts/CityContext'
import { Header } from '../components/Header'

function App({ Component, pageProps }: AppProps) {
  return (
    <CityProvider>
      <ToastContainer />
      <div>
        <Header />
        <Component {...pageProps} />
      </div>
    </CityProvider>
  )
}

export default App
