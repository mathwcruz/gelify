import { createContext, ReactNode, useContext } from 'react'
import { toast } from 'react-toastify'

import { supabase } from '../services/supabase'

export type SupplierData = {
  id: string
  name: string
  cnpj: string
  cellphone: string
  email: string
  active: boolean
  created_at: string
}

interface SupplierContextData {
  getSuppliers: () => Promise<SupplierData[]>
  getSupplierById: (supplierId: string) => Promise<SupplierData>
}

interface SupplierProviderProps {
  children: ReactNode
}

export const SupplierContext = createContext({} as SupplierContextData)

export function SupplierProvider({ children }: SupplierProviderProps) {
  const getSuppliers = async () => {
    try {
      const response = await supabase.from('supplier').select('*')
      const suppliers = response?.data as SupplierData[]
      return suppliers as SupplierData[]
    } catch (error) {
      console.log(error)
      toast.error('Ocorreu um erro ao buscar os fornecedores', {
        position: 'top-center',
        autoClose: 500,
        hideProgressBar: true,
      })
      return []
    }
  }

  const getSupplierById = async (supplierId: string) => {
    try {
      const response = await supabase
        .from('supplier')
        .select('*')
        .match({ id: supplierId })
      const supplier = response?.data?.[0] as SupplierData
      return supplier as SupplierData
    } catch (error) {
      console.log(error)
      toast.error(
        `Ocorreu um erro ao buscar o fornecedor com o id "${supplierId}"`,
        {
          position: 'top-center',
          autoClose: 500,
          hideProgressBar: true,
        }
      )
      return {} as SupplierData
    }
  }

  return (
    <SupplierContext.Provider value={{ getSuppliers, getSupplierById }}>
      {children}
    </SupplierContext.Provider>
  )
}

export const useSupplier = () => {
  return useContext(SupplierContext)
}
