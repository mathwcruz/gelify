import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { parseCookies } from 'nookies'

import { User, useUser } from '../contexts/UserContext'
import { ThemeSwitcher } from '../components/ThemeSwitcher'

const Login: NextPage = () => {
  const { handleAuthenticateUser } = useUser()

  const [user, setUser] = useState({} as User)

  return (
    <>
      <Head>
        <title>Gelify | Entrar na conta</title>
      </Head>

      <>
        <ThemeSwitcher className="absolute right-4 top-4 z-10" />
        <div className="relative flex h-screen w-screen flex-col items-center justify-center">
          <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
              <div>
                <img
                  className="mx-auto h-12 w-auto"
                  src="/favicon.png"
                  alt="Gelify"
                  title="Gelify"
                />
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-300">
                  Entre na sua conta agora mesmo
                </h2>
                <p className="dark:text-gray-20 mt-2 text-center text-sm text-gray-600">
                  ou{' '}
                  <Link href="/register">
                    <a className="font-medium text-green-600 hover:text-green-500">
                      Crie a sua conta
                    </a>
                  </Link>
                </p>
              </div>
              <form
                className="mt-8 space-y-6"
                onSubmit={(e) => handleAuthenticateUser(e, user)}
              >
                <div className="space-y-2 rounded-md shadow">
                  <div>
                    <label htmlFor="email-address" className="sr-only">
                      Endereço de e-mail
                    </label>
                    <input
                      id="email-address"
                      name="email-address"
                      type="email"
                      autoComplete="off"
                      required
                      className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-400 focus:outline-none focus:ring-green-400 dark:bg-zinc-900 dark:text-gray-300 sm:text-sm"
                      placeholder="Digite o seu e-mail"
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Senha
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="off"
                      required
                      className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-400 focus:outline-none focus:ring-green-400 dark:bg-zinc-900 dark:text-gray-300 sm:text-sm"
                      placeholder="Informe a sua senha"
                      onChange={(e) =>
                        setUser({ ...user, password: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    title={
                      !user?.email || !user?.password
                        ? 'Preencha todos os campos'
                        : 'Entrar na conta'
                    }
                    disabled={!user?.email || !user?.password}
                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-green-600"
                  >
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3"></span>
                    Entrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx)

  if (cookies['user']) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

export default Login
