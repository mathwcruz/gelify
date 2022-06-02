import { createContext, ReactNode, useContext } from 'react'
import { toast } from 'react-toastify'

import { supabase } from '../services/supabase'

export type ClientData = {
  id: string
  name: string
  cpf: string
  birthdate: string
  cellphone: string
  email: string
  active: boolean
  city_id: string
  created_at: string
}

interface ClientContextData {
  getClients: () => Promise<ClientData[]>
  getClientById: (clientId: string) => Promise<ClientData>
}

interface ClientProviderProps {
  children: ReactNode
}

export const ClientContext = createContext({} as ClientContextData)

export function ClientProvider({ children }: ClientProviderProps) {
  const getClients = async () => {
    try {
      const response = await supabase.from('client').select('*')
      const clients = response?.data as ClientData[]
      return clients as ClientData[]
    } catch (error) {
      console.log(error)
      toast.error('Ocorreu um erro ao buscar os clientes', {
        position: 'top-center',
        autoClose: 500,
        hideProgressBar: true,
      })
      return []
    }
  }

  const getClientById = async (clientId: string) => {
    try {
      const response = await supabase
        .from('client')
        .select('*')
        .match({ id: clientId })
      const client = response?.data?.[0] as ClientData
      return client as ClientData
    } catch (error) {
      console.log(error)
      toast.error(
        `Ocorreu um erro ao buscar o cliente com o id "${clientId}"`,
        {
          position: 'top-center',
          autoClose: 500,
          hideProgressBar: true,
        }
      )
      return {} as ClientData
    }
  }

  return (
    <ClientContext.Provider value={{ getClients, getClientById }}>
      {children}
    </ClientContext.Provider>
  )
}

export const useClient = () => {
  return useContext(ClientContext)
}
