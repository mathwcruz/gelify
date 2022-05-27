import { GetStaticProps, GetStaticPropsContext, GetStaticPaths } from 'next'
import Head from 'next/head'
import { FormEvent, useCallback, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { isEmpty } from 'lodash'

import { supabase } from '../../../services/supabase'
import { City } from '../../list/cities'
import { Loading } from '../../../components/Loading'
import { Mask, Regex } from '../../../utils/formatters'
import { validateCPF, validateDate } from '../../../utils/validations'

export type Person = {
  id: string
  name: string
  cpf: string
  birthdate: string
  cellphone: string
  city_id: string
  created_at: string
}

interface PersonProps {
  person: Person
  cities: City[]
}

const Person = ({ person, cities }: PersonProps) => {
  const [personData, setPersonData] = useState<Person>(person)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isAllFieldsFilled, setIsAllFieldsFilled] = useState<boolean>(false)
  const [isAllFieldsValuesTheSame, setIsAllFieldsValuesTheSame] =
    useState<boolean>(false)

  useEffect(() => {
    const initialPersonValues = Object.values(person)
    const personDataValues = Object.values(personData)
    let bothDataHasTheSameValue = false

    bothDataHasTheSameValue = initialPersonValues?.every(
      (value, index) => value === personDataValues[index]
    )

    setIsAllFieldsValuesTheSame(bothDataHasTheSameValue)

    setIsAllFieldsFilled(
      Object.values(personData).filter((value) => !!value)?.length === 7
    )
  }, [personData, person])

  const handleUpdatePerson = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()

      if (isEmpty(personData)) {
        setIsLoading(false)

        return toast.error('Preencha todos os campos, por favor', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
        })
      }

      if (
        !validateCPF(personData?.cpf?.replaceAll('.', '')?.replaceAll('-', ''))
      ) {
        setIsLoading(false)

        toast.error('CPF inválido, informe um correto', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
        })
      }

      if (!validateDate(personData?.birthdate)) {
        setIsLoading(false)

        toast.error('Data inválida, informe uma correta', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
        })
      }

      if (!Regex.phone.test(personData?.cellphone)) {
        setIsLoading(false)

        toast.error('Número inválido, informe um corret', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
        })
      }

      if (
        !validateCPF(
          personData?.cpf?.replaceAll('.', '')?.replaceAll('-', '')
        ) ||
        !validateDate(personData?.birthdate) ||
        !Regex.phone.test(personData?.cellphone)
      ) {
        return
      }

      try {
        setIsLoading(true)
        const { error } = await supabase
          .from('people')
          .update({ ...personData })
          .match({ id: personData?.id })

        if (!error) {
          setIsLoading(false)
          return toast.success('Pessoa atualizada com sucesso!', {
            position: 'top-center',
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            progress: undefined,
          })
        } else {
          return toast.error('Ocorreu um erro ao atualizar a pessoa', {
            position: 'top-center',
            autoClose: 500,
            hideProgressBar: true,
          })
        }
      } catch (error) {
        setIsLoading(false)
        console.log({ error })
      }
    },
    [personData]
  )

  return (
    <>
      <Head>
        <title>{person?.name}</title>
      </Head>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-20 px-4 py-12 sm:px-6">
        {isLoading ? (
          <Loading />
        ) : (
          <form onSubmit={handleUpdatePerson}>
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
                      onChange={(e) => {
                        if (e.target.value?.length > 14) return

                        setPersonData((old) => ({
                          ...old,
                          cpf: Mask.cpf(e.target.value),
                        }))
                      }}
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
                      onChange={(e) => {
                        if (e.target.value?.length > 10) return

                        setPersonData((old) => ({
                          ...old,
                          birthdate: Mask.birthdate(e.target.value),
                        }))
                      }}
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
                      onChange={(e) => {
                        if (e.target.value?.length > 15) return

                        setPersonData((old) => ({
                          ...old,
                          cellphone: Mask.phone(e.target.value),
                        }))
                      }}
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
                      defaultValue={personData?.city_id}
                      onChange={(e) =>
                        setPersonData((old) => ({
                          ...old,
                          city_id: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    >
                      <>
                        <option value="" disabled>
                          Selecione uma cidade
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
                  disabled={!isAllFieldsFilled || isAllFieldsValuesTheSame}
                  title={
                    !isAllFieldsFilled
                      ? 'Preencha todos os campos'
                      : isAllFieldsValuesTheSame
                      ? 'Os valores dos campos não alteraram'
                      : ''
                  }
                  className="inline-flex justify-center rounded-md border border-transparent bg-green-500 py-2 px-4 text-sm font-medium text-white shadow-sm transition-colors duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-green-500 disabled:hover:opacity-60"
                >
                  Atualizar
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  )
}

export default Person

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext) => {
  const { id } = params || {}
  const { data } = await supabase.from('people').select('*').match({ id })
  const { data: cities } = await supabase.from('cities').select('*')

  return {
    props: {
      person: data?.[0],
      cities,
    },
    revalidate: 60 * 30, // = 30 minutos
  }
}
