import { GetStaticProps } from 'next'
import Head from 'next/head'
import { FormEvent, useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import { v4 as uuid } from 'uuid'
import { isEmpty } from 'lodash'

import { supabase } from '../../services/supabase'
import { Loading } from '../../components/Loading'
import { City } from '../list/cities'
import { Person } from '../edit/person/[id]'
import { Mask, Regex } from '../../utils/formatters'

interface PersonRegisterProps {
  cities: Omit<City, 'createdAt'>[]
}

const PersonRegister = ({ cities }: PersonRegisterProps) => {
  const [personData, setPersonData] = useState<Person>({} as Person)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleCreatePerson = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setIsLoading(true)

      if (isEmpty(personData)) {
        setIsLoading(false)

        return toast.error('Preencha todos os campos, por favor', {
          position: 'top-center',
          autoClose: 500,
          hideProgressBar: true,
        })
      }

      try {
        const { data } = await supabase
          .from('people')
          .insert({ ...personData, id: uuid() })

        if (!!data?.length) {
          setPersonData({} as Person)
          toast.success('Pessoa cadastrada com sucesso!', {
            position: 'top-center',
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            progress: undefined,
          })

          setIsLoading(false)
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.log(error)
        setIsLoading(false)
      }
    },
    [personData]
  )

  return (
    <>
      <Head>
        <title>Registrar nova pessoa</title>
      </Head>

      <div className="mx-auto mt-28 max-w-7xl px-4 sm:px-6 md:col-span-2">
        {isLoading ? (
          <Loading />
        ) : (
          <form onSubmit={handleCreatePerson}>
            <div className="overflow-hidden shadow sm:rounded-md">
              <div className="flex flex-col justify-center gap-3 bg-white px-4 py-5 sm:p-6">
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-2 sm:col-span-3">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nome
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={personData?.name}
                      autoComplete="off"
                      onChange={(e) =>
                        setPersonData((old) => ({
                          ...old,
                          name: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-400 focus:ring-green-400 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label
                      htmlFor="cpf"
                      className="block text-sm font-medium text-gray-700"
                    >
                      CPF
                    </label>
                    <input
                      type="text"
                      name="cpf"
                      id="cpf"
                      autoComplete="off"
                      value={personData?.cpf}
                      onChange={(e) =>
                        setPersonData((old) => ({
                          ...old,
                          cpf: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-400 focus:ring-green-400 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label
                      htmlFor="birthdate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Data de nascimento
                    </label>
                    <input
                      type="text"
                      name="birthdate"
                      id="birthdate"
                      autoComplete="off"
                      value={personData?.birthdate}
                      onChange={(e) =>
                        setPersonData((old) => ({
                          ...old,
                          birthdate: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-400 focus:ring-green-400 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label
                      htmlFor="cellphone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Número de celular
                    </label>
                    <input
                      type="text"
                      name="cellphone"
                      id="cellphone"
                      autoComplete="off"
                      value={personData?.cellphone}
                      onChange={(e) =>
                        setPersonData((old) => ({
                          ...old,
                          cellphone: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-400 focus:ring-green-400 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-3">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Cidade
                    </label>
                    <select
                      id="country"
                      name="country"
                      placeholder="Selecione uma cidade"
                      onChange={(city) => console.log({ city })}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    >
                      {cities?.map((city) => (
                        <option key={city?.id} value={city?.id}>
                          {city?.description}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-green-500 py-2 px-4 text-sm font-medium text-white shadow-sm transition-colors duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                >
                  Cadastrar pessoa
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  )
}

export default PersonRegister

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await supabase
    .from('cities')
    .select('*')
    .order('id', { ascending: true })

  const cities = data?.map((city) => {
    return {
      ...city,
    }
  })

  return {
    props: {
      cities,
    },
    revalidate: 60 * 30, // = 30 minutos
  }
}
