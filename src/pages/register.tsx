import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { parseCookies } from 'nookies'

import { User, useUser } from '../contexts/UserContext'

const Register: NextPage = () => {
  const { handleRegisterUser } = useUser()

  const [user, setUser] = useState({} as User)

  return (
    <>
      <Head>
        <title>Gelify | Criar conta</title>
      </Head>

      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div>
              <img
                className="mx-auto h-12 w-auto"
                src="/favicon.png"
                alt="Gelify"
                title="Gelify"
              />
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Crie sua conta agora mesmo
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                ou{' '}
                <Link href="/login">
                  <a className="font-medium text-indigo-600 hover:text-indigo-500">
                    Entre na sua conta
                  </a>
                </Link>
              </p>
            </div>
            <form
              className="mt-8 space-y-6"
              onSubmit={(e) => handleRegisterUser(e, user)}
            >
              <div className="space-y-2 rounded-md shadow-sm">
                <div>
                  <label htmlFor="name" className="sr-only">
                    Nome
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="name"
                    autoComplete="off"
                    required
                    className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Informe o seu nome"
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="name" className="sr-only">
                    Endereço de e-mail
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="off"
                    required
                    className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Digite um e-mail"
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
                    className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Digite uma senha"
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
                    !user?.name || !user?.email || !user?.password
                      ? 'Preencha todos os campos'
                      : 'Criar conta'
                  }
                  disabled={!user?.name || !user?.email || !user?.password}
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-indigo-600"
                >
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3"></span>
                  Criar conta
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
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

export default Register
