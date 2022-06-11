import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { FormEvent, useCallback, useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { parseCookies } from 'nookies'
import { toast } from 'react-toastify'

import { CityData } from '../../contexts/CityContext'
import { ClientData } from '../../contexts/ClientContext'
import { Header } from '../../components/Header'
import { Loading } from '../../components/Loading'
import { Mask, Regex } from '../../utils/formatters'
import { validateCPF, validateDate } from '../../utils/validations'

import { supabase } from '../../services/supabase'

interface ClientRegisterProps {
  cities: Omit<CityData, 'created_at'>[]
}

const ClientRegister = ({ cities }: ClientRegisterProps) => {
  const [clientData, setClientData] = useState<ClientData>({} as ClientData)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isAllFieldsFilled, setIsAllFieldsFilled] = useState<boolean>(false)

  useEffect(() => {
    setIsAllFieldsFilled(
      Object.values(clientData).filter((value) => !!value)?.length === 6
    )
  }, [clientData])

  const handleCreateClient = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setIsLoading(true)

      if (
        !validateCPF(clientData?.cpf?.replaceAll('.', '')?.replaceAll('-', ''))
      ) {
        setIsLoading(false)

        toast.error('CPF inválido, informe um correto', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
        })
      }

      if (!validateDate(clientData?.birthdate)) {
        setIsLoading(false)

        toast.error('Data inválida, informe uma correta', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
        })
      }

      if (!Regex.email.test(clientData?.email)) {
        setIsLoading(false)

        toast.error('Email inválido, informe um correto', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
        })
      }

      if (!Regex.phone.test(clientData?.cellphone)) {
        setIsLoading(false)

        toast.error('Número inválido, informe um correto', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
        })
      }

      if (
        !validateCPF(
          clientData?.cpf?.replaceAll('.', '')?.replaceAll('-', '')
        ) ||
        !validateDate(clientData?.birthdate) ||
        !Regex.phone.test(clientData?.cellphone) ||
        !Regex.email.test(clientData?.email)
      ) {
        return
      }

      try {
        const { data } = await supabase
          .from('client')
          .insert({ ...clientData, id: uuid(), active: true })

        if (!!data?.length) {
          setClientData({} as ClientData)
          toast.success(`${data?.[0]?.name} foi cadastrado(a) com sucesso!`, {
            position: 'top-center',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            progress: undefined,
          })

          setIsLoading(false)
          setClientData({} as ClientData)
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.log(error)
        setIsLoading(false)
      }
    },
    [clientData]
  )

  return (
    <>
      <Head>
        <title>Cadastrar novo cliente</title>
      </Head>

      <Header />

      <div className="mx-auto mt-28 max-w-7xl px-4 sm:px-6 md:col-span-2">
        {isLoading ? (
          <Loading />
        ) : (
          <form onSubmit={handleCreateClient}>
            <div className="overflow-hidden shadow sm:rounded-md">
              <div className="flex flex-col justify-center gap-3 bg-white px-4 py-5 sm:p-6">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-3">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nome*
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={clientData?.name}
                      autoComplete="off"
                      onChange={(e) =>
                        setClientData((old) => ({
                          ...old,
                          name: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-400 focus:ring-green-400 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="cpf"
                      className="block text-sm font-medium text-gray-700"
                    >
                      CPF*
                    </label>
                    <input
                      type="text"
                      name="cpf"
                      id="cpf"
                      autoComplete="off"
                      value={clientData?.cpf}
                      onChange={(e) => {
                        if (e.target.value?.length > 14) return

                        setClientData((old) => ({
                          ...old,
                          cpf: Mask.cpf(e.target.value),
                        }))
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-400 focus:ring-green-400 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="birthdate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Data de nascimento*
                    </label>
                    <input
                      type="text"
                      name="birthdate"
                      id="birthdate"
                      autoComplete="off"
                      value={clientData?.birthdate}
                      onChange={(e) => {
                        if (e.target.value?.length > 10) return

                        setClientData((old) => ({
                          ...old,
                          birthdate: Mask.birthdate(e.target.value),
                        }))
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-400 focus:ring-green-400 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-3">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email*
                    </label>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      autoComplete="off"
                      value={clientData?.email}
                      onChange={(e) => {
                        setClientData((old) => ({
                          ...old,
                          email: e.target.value,
                        }))
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-400 focus:ring-green-400 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="cellphone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Número de celular*
                    </label>
                    <input
                      type="text"
                      name="cellphone"
                      id="cellphone"
                      autoComplete="off"
                      value={clientData?.cellphone}
                      onChange={(e) => {
                        if (e.target.value?.length > 15) return

                        setClientData((old) => ({
                          ...old,
                          cellphone: Mask.phone(e.target.value),
                        }))
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-400 focus:ring-green-400 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-3">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Cidade*
                    </label>
                    <select
                      id="country"
                      name="country"
                      defaultValue=""
                      onChange={(e) =>
                        setClientData((old) => ({
                          ...old,
                          city_id: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    >
                      <>
                        <option value="" disabled>
                          Selecione a cidade
                        </option>
                        {cities?.map((city) => (
                          <option key={city?.id} value={city?.id}>
                            {city?.description}
                          </option>
                        ))}
                      </>
                    </select>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  type="submit"
                  disabled={!isAllFieldsFilled}
                  title={!isAllFieldsFilled ? 'Preencha todos os campos' : ''}
                  className="inline-flex justify-center rounded-md border border-transparent bg-green-500 py-2 px-4 text-sm font-medium text-white shadow-sm transition-colors duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-green-500 disabled:hover:opacity-60"
                >
                  Cadastrar cliente
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  )
}

export default ClientRegister

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx)

  if (!cookies['user']) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const { data: cities } = await supabase
    .from('city')
    .select('*')
    .match({ active: true })
    .order('id', { ascending: true })

  return {
    props: {
      cities,
    },
  }
}
