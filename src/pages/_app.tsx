import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import '../styles/globals.css'

import { CityProvider } from '../contexts/CityContext'
import { ClientProvider } from '../contexts/ClientContext'
import { ProductProvider } from '../contexts/ProductContext'
import { PurchaseTransactionProvider } from '../contexts/PurchaseTransactionContext'
import { SalesTransactionProvider } from '../contexts/SalesTransactionContext'
import { SupplierProvider } from '../contexts/SupplierContext'
import { UserProvider } from '../contexts/UserContext'

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <UserProvider>
        <CityProvider>
          <ClientProvider>
            <SupplierProvider>
              <ProductProvider>
                <PurchaseTransactionProvider>
                  <SalesTransactionProvider>
                    <ToastContainer />
                    <Component {...pageProps} />
                  </SalesTransactionProvider>
                </PurchaseTransactionProvider>
              </ProductProvider>
            </SupplierProvider>
          </ClientProvider>
        </CityProvider>
      </UserProvider>
    </ThemeProvider>
  )
}

export default App
