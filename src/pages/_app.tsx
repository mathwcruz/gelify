import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import '../styles/globals.css'

import { CityProvider } from '../contexts/CityContext'
import { ClientProvider } from '../contexts/ClientContext'
import { SupplierProvider } from '../contexts/SupplierContext'
import { Header } from '../components/Header'

function App({ Component, pageProps }: AppProps) {
  return (
    <CityProvider>
      <ClientProvider>
        <SupplierProvider>
          <ToastContainer />
          <div>
            <Header />
            <Component {...pageProps} />
          </div>
        </SupplierProvider>
      </ClientProvider>
    </CityProvider>
  )
}

export default App
