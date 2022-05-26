import { createContext, ReactNode, useContext } from 'react'
import { toast } from 'react-toastify'

import { supabase } from '../services/supabase'

type PersonData = {
  id: string
  name: string
  cpf: string
  birthdate: string
  cellphone: string
  city_id: string
  created_at: string
}

interface PersonContextData {
  getPeople: () => Promise<PersonData[]>
}

interface PersonProviderProps {
  children: ReactNode
}

export const PersonContext = createContext({} as PersonContextData)

export function PersonProvider({ children }: PersonProviderProps) {
  const getPeople = async () => {
    try {
      const response = await supabase.from('people').select('*')
      const people = response?.data as PersonData[]
      return people as PersonData[]
    } catch (error) {
      console.log(error)
      toast.error('Ocorreu um erro ao buscar as pessoas', {
        position: 'top-center',
        autoClose: 500,
        hideProgressBar: true,
      })
      return []
    }
  }

  return (
    <PersonContext.Provider value={{ getPeople }}>
      {children}
    </PersonContext.Provider>
  )
}

export const usePerson = () => {
  return useContext(PersonContext)
}
