import { createContext, ReactNode, useContext } from 'react'
import { toast } from 'react-toastify'

import { supabase } from '../services/supabase'

type CityData = {
  id: string
  description: string
  created_at: string
}

interface CityContextData {
  getCities: () => Promise<CityData[]>
  getCityById: (cityId: string) => Promise<CityData>
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

  const getCityById = async (cityId: string) => {
    try {
      const response = await supabase
        .from('cities')
        .select('*')
        .match({ id: cityId })
      const city = response?.data?.[0] as CityData
      return city as CityData
    } catch (error) {
      console.log(error)
      toast.error('Ocorreu um erro ao buscar as cidades', {
        position: 'top-center',
        autoClose: 500,
        hideProgressBar: true,
      })
      return {} as CityData
    }
  }

  return (
    <CityContext.Provider value={{ getCities, getCityById }}>
      {children}
    </CityContext.Provider>
  )
}

export const useCity = () => {
  return useContext(CityContext)
}
