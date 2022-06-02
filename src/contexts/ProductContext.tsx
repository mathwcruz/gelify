import { createContext, ReactNode, useContext } from 'react'
import { toast } from 'react-toastify'

import { supabase } from '../services/supabase'

export type ProductData = {
  id: string
  description: string
  unitary_value: number
  stock_quantity: number
  active: boolean
  created_at: string
}

interface ProductContextData {
  getProducts: () => Promise<ProductData[]>
  getProductById: (productId: string) => Promise<ProductData>
}

interface ProductProviderProps {
  children: ReactNode
}

export const ProductContext = createContext({} as ProductContextData)

export function ProductProvider({ children }: ProductProviderProps) {
  const getProducts = async () => {
    try {
      const response = await supabase.from('product').select('*')
      const products = response?.data as ProductData[]
      return products as ProductData[]
    } catch (error) {
      console.log(error)
      toast.error('Ocorreu um erro ao buscar os produtos', {
        position: 'top-center',
        autoClose: 500,
        hideProgressBar: true,
      })
      return []
    }
  }

  const getProductById = async (productId: string) => {
    try {
      const response = await supabase
        .from('product')
        .select('*')
        .match({ id: productId })
      const product = response?.data?.[0] as ProductData
      return product as ProductData
    } catch (error) {
      console.log(error)
      toast.error(
        `Ocorreu um erro ao buscar o produto com o id "${productId}"`,
        {
          position: 'top-center',
          autoClose: 500,
          hideProgressBar: true,
        }
      )
      return {} as ProductData
    }
  }

  return (
    <ProductContext.Provider value={{ getProducts, getProductById }}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProduct = () => {
  return useContext(ProductContext)
}
