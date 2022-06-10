import { useRouter } from 'next/router'
import {
  createContext,
  FormEvent,
  ReactNode,
  useCallback,
  useContext,
} from 'react'
import { v4 as uuid } from 'uuid'
import SimpleCrypto from 'simple-crypto-js'
import { setCookie, destroyCookie } from 'nookies'
import { toast } from 'react-toastify'
const simpleCrypto = new SimpleCrypto('@gelify:user')

import { supabase } from '../services/supabase'

export type User = {
  id?: string
  name?: string
  email: string
  password: string
  active?: boolean
}
interface UserContextData {
  handleRegisterUser: (e: FormEvent, user: User) => void
  handleAuthenticateUser: (e: FormEvent, user: User) => void
  handleLogoutUser: () => void
}

interface UserProviderProps {
  children: ReactNode
}

export const UserContext = createContext({} as UserContextData)

export function UserProvider({ children }: UserProviderProps) {
  const { push } = useRouter()

  const handleRegisterUser = useCallback(async (e: FormEvent, user: User) => {
    e.preventDefault()

    try {
      const { error } = await supabase.from('user').insert({
        ...user,
        password: simpleCrypto.encrypt(user?.password),
        active: true,
        id: uuid(),
      })

      if (!error) {
        setCookie(undefined, 'user', simpleCrypto.encrypt(uuid()))
        toast.success('Usuário cadastrado com sucesso!')
        push('/')
      } else {
        toast.error('Erro ao cadastrar o usuário!')
      }
    } catch (error) {
      console.log({ error })
    }
  }, [])

  const handleAuthenticateUser = useCallback(
    async (e: FormEvent, user: User) => {
      e.preventDefault()

      try {
        const { data } = await supabase.from('user').select('*').match({
          email: user?.email,
        })

        if (!!data?.length) {
          const isSamePassword = data?.some(
            (userData) =>
              userData?.email === user?.email &&
              simpleCrypto.decrypt(userData?.password) === user?.password
          )

          if (!isSamePassword) {
            return toast.error(
              'Erro ao entrar na sua conta! Confira os seus dados'
            )
          }

          setCookie(undefined, 'user', simpleCrypto.encrypt(uuid()))
          toast.success('Login realizado com sucesso!')
          push('/')
        } else {
          return toast.error(
            'Erro ao entrar na sua conta! Confira os seus dados'
          )
        }
      } catch (error) {
        console.log({ error })
      }
    },
    []
  )

  const handleLogoutUser = useCallback(() => {
    destroyCookie(undefined, 'user')
    setTimeout(() => {
      push('/login')
    }, 700)
  }, [])

  return (
    <UserContext.Provider
      value={{ handleRegisterUser, handleAuthenticateUser, handleLogoutUser }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  return useContext(UserContext)
}
