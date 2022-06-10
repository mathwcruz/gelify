import { createContext, ReactNode, useContext } from 'react'
import { toast } from 'react-toastify'

import { supabase } from '../services/supabase'

export type PurchaseItemData = {
  id: string
  quantity: number
  total_value: number
  product_id: string
  product_description?: string
  product_unitary_value?: number
  product_stock_quantity?: number
  purchase_id: string
}

export type PurchaseTransactionData = {
  id: string
  total_value?: number
  date: string
  created_at: string
  supplier_id: string
  purchase_items: PurchaseItemData[]
}

interface PurchaseTransactionContextData {
  getPurchasesTransactions: () => Promise<PurchaseTransactionData[]>
  getPurchaseTransactionById: (
    purchaseId: string
  ) => Promise<PurchaseTransactionData>
}

interface PurchaseTransactionProviderProps {
  children: ReactNode
}

export const PurchaseTransactionContext = createContext(
  {} as PurchaseTransactionContextData
)

export function PurchaseTransactionProvider({
  children,
}: PurchaseTransactionProviderProps) {
  const getPurchasesTransactions = async () => {
    try {
      const response = await supabase.from('purchase').select('*')
      const purchases = response?.data as PurchaseTransactionData[]
      return purchases as PurchaseTransactionData[]
    } catch (error) {
      console.log(error)
      toast.error('Ocorreu um erro ao buscar as ordens de compras', {
        position: 'top-center',
        autoClose: 500,
        hideProgressBar: true,
      })
      return []
    }
  }

  const getPurchaseTransactionById = async (purchaseId: string) => {
    try {
      const response = await supabase
        .from('purchase')
        .select('*')
        .match({ id: purchaseId })
      const purchase = response?.data?.[0] as PurchaseTransactionData
      return purchase as PurchaseTransactionData
    } catch (error) {
      console.log(error)
      toast.error(
        `Ocorreu um erro ao buscar a ordem de compra com id: ${purchaseId}`,
        {
          position: 'top-center',
          autoClose: 500,
          hideProgressBar: true,
        }
      )
      return {} as PurchaseTransactionData
    }
  }

  return (
    <PurchaseTransactionContext.Provider
      value={{ getPurchasesTransactions, getPurchaseTransactionById }}
    >
      {children}
    </PurchaseTransactionContext.Provider>
  )
}

export const useCity = () => {
  return useContext(PurchaseTransactionContext)
}
