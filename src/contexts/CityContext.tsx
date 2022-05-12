import { createContext, ReactNode, useContext } from 'react'
import { Id, toast } from 'react-toastify'

import { supabase } from '../services/supabase'

type CityData = {
  id: string
  description: string
  created_at: string
}

interface CityContextData {
  getCities: () => Promise<CityData[]>
}

interface CityProviderProps {
  children: ReactNode
}

export const CityContext = createContext({} as CityContextData)

export function CityProvider({ children }: CityProviderProps) {
  const getCities = async () => {
    try {
      const response = await supabase.from('cities').select('*')
      const cities = response?.data as CityData[]
      return cities as CityData[]
    } catch (error) {
      console.log(error)
      toast.error('Ocorreu um erro ao buscar as cidades', {
        position: 'top-center',
        autoClose: 500,
        hideProgressBar: true,
      })
      return []
    }
  }

  return (
    <CityContext.Provider value={{ getCities }}>
      {children}
    </CityContext.Provider>
  )
}

export const useCity = () => {
  return useContext(CityContext)
}
