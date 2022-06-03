import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import '../styles/globals.css'

import { CityProvider } from '../contexts/CityContext'
import { ClientProvider } from '../contexts/ClientContext'
import { ProductProvider } from '../contexts/ProductContext'
import { SupplierProvider } from '../contexts/SupplierContext'
import { UserProvider } from '../contexts/UserContext'

function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <CityProvider>
        <ClientProvider>
          <SupplierProvider>
            <ProductProvider>
              <ToastContainer />
              <Component {...pageProps} />
            </ProductProvider>
          </SupplierProvider>
        </ClientProvider>
      </CityProvider>
    </UserProvider>
  )
}

export default App
