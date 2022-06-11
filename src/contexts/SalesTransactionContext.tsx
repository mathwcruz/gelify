import { createContext, ReactNode, useContext } from 'react'
import { toast } from 'react-toastify'

import { supabase } from '../services/supabase'

export type SalesItemData = {
  id: string
  quantity: number
  total_value: number
  product_description?: string
  product_unitary_value?: number
  product_stock_quantity?: number
  product_id: string
  sale_id: string
}

export type SalesTransactionData = {
  id: string
  date: string
  total_value?: number
  delivery_address: string
  observation?: string
  created_at: string
  client_id: string
  sells_items: SalesItemData[]
}

interface SalesTransactionContextData {
  getSalesTransactions: () => Promise<SalesTransactionData[]>
}

interface SalesTransactionProviderProps {
  children: ReactNode
}

export const SalesTransactionContext = createContext(
  {} as SalesTransactionContextData
)

export function SalesTransactionProvider({
  children,
}: SalesTransactionProviderProps) {
  const getSalesTransactions = async () => {
    try {
      const response = await supabase.from('sale').select('*')

      const sales = response?.data as SalesTransactionData[]
      return sales as SalesTransactionData[]
    } catch (error) {
      console.log(error)
      toast.error('Ocorreu um erro ao buscar as ordens de venda', {
        position: 'top-center',
        autoClose: 500,
        hideProgressBar: true,
      })
      return []
    }
  }

  return (
    <SalesTransactionContext.Provider value={{ getSalesTransactions }}>
      {children}
    </SalesTransactionContext.Provider>
  )
}

export const useSalesTransaction = () => {
  return useContext(SalesTransactionContext)
}
