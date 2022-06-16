import { useRouter } from 'next/router'
import {
  createContext,
  FormEvent,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { v4 as uuid } from 'uuid'
import SimpleCrypto from 'simple-crypto-js'
import { setCookie, destroyCookie, parseCookies } from 'nookies'
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
  loggedUser: User | null
}

interface UserProviderProps {
  children: ReactNode
}

export const UserContext = createContext({} as UserContextData)

export function UserProvider({ children }: UserProviderProps) {
  const [loggedUser, setLoggedUser] = useState<User | null>(null)

  const { push } = useRouter()

  const handleRegisterUser = useCallback(async (e: FormEvent, user: User) => {
    e.preventDefault()

    try {
      const { data } = await supabase.from('user').select('email')
      const usersEmails = data as { email: string }[]

      if (
        !!usersEmails?.length &&
        usersEmails?.some(({ email }) => email === user?.email)
      ) {
        return toast.error('Email já cadastrado', {
          position: 'top-center',
          autoClose: 500,
          hideProgressBar: true,
        })
      }

      const { error, data: userData } = await supabase.from('user').insert({
        ...user,
        password: simpleCrypto.encrypt(user?.password),
        active: true,
        id: uuid(),
      })

      if (!error) {
        setCookie(undefined, 'user', simpleCrypto.encrypt(userData?.[0]?.id))
        setLoggedUser(userData?.[0])
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

          setCookie(undefined, 'user', simpleCrypto.encrypt(data?.[0]?.id))
          setLoggedUser(data?.[0])
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

  const getLoggerUser = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('user')
        .select('*')
        .match({
          id: simpleCrypto.decrypt(parseCookies()['user']) ?? '',
        })

      if (!!data?.length) {
        setLoggedUser(data?.[0])
      } else {
        return toast.error('Erro ao buscar os dados do usuário autenticado')
      }
    } catch (error) {
      console.log({ error })
    }
  }, [])

  useEffect(() => {
    getLoggerUser()
  }, [parseCookies()['user']])

  const handleLogoutUser = useCallback(() => {
    destroyCookie(undefined, 'user')
    setLoggedUser(null)
    setTimeout(() => {
      push('/login')
    }, 700)
  }, [])

  return (
    <UserContext.Provider
      value={{
        handleRegisterUser,
        handleAuthenticateUser,
        handleLogoutUser,
        loggedUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  return useContext(UserContext)
}
