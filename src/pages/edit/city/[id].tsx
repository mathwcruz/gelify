import { GetStaticProps, GetStaticPropsContext, GetStaticPaths } from 'next'
import Head from 'next/head'
import { FormEvent, useCallback, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { supabase } from '../../../services/supabase'
import { CityData } from '../../../contexts/CityContext'
import { Loading } from '../../../components/Loading'
import { Mask, Regex } from '../../../utils/formatters'

interface CityProps {
  city: CityData
}

const City = ({ city }: CityProps) => {
  const [cityData, setCityData] = useState<CityData>(city)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isCityActive, setIsCityActive] = useState<boolean>(!!city?.active)
  const [canUpdateCity, setCanUpdateCity] = useState<boolean>(false)
  const [isAllFieldsFilled, setIsAllFieldsFilled] = useState<boolean>(false)
  const [isAllFieldsValuesTheSame, setIsAllFieldsValuesTheSame] =
    useState<boolean>(false)

  useEffect(() => {
    const data: any = { ...cityData }
    delete data.active
    const initialCity: any = { ...city }
    delete initialCity.active

    const initialCityValues = Object.values(initialCity)
    const cityDataValues = Object.values(data)
    let bothDataHasTheSameValue = false

    bothDataHasTheSameValue = initialCityValues?.every(
      (value, index) => value === cityDataValues[index]
    )

    setIsAllFieldsValuesTheSame(bothDataHasTheSameValue)

    setIsAllFieldsFilled(
      Object.values(data)?.filter?.((value) => !!value)?.length === 4
    )
  }, [city, cityData])

  useEffect(() => {
    if (city?.active !== isCityActive && isAllFieldsFilled) {
      return setCanUpdateCity(true)
    }

    if (isAllFieldsFilled && !isAllFieldsValuesTheSame) {
      return setCanUpdateCity(true)
    }

    return setCanUpdateCity(false)
  }, [isAllFieldsFilled, isAllFieldsValuesTheSame, isCityActive])

  const handleUpdateCity = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()

      if (!Regex.cep.test(cityData?.cep)) {
        setIsLoading(false)

        toast.error('CEP inválido, informe um correto', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
        })
        return
      }

      try {
        const { error } = await supabase
          .from('city')
          .update({ ...cityData, active: isCityActive })
          .match({ id: city?.id })

        if (!error) {
          setIsLoading(false)
          return toast.success('Cidade atualizada com sucesso!', {
            position: 'top-center',
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            progress: undefined,
          })
        } else {
          return toast.error('Ocorreu um erro ao atualizar a cidade', {
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
    [cityData, isCityActive]
  )

  return (
    <>
      <Head>
        <title>Cidade de {city?.description}</title>
      </Head>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-20 px-4 py-12 sm:px-6">
        {isLoading ? (
          <Loading />
        ) : (
          <form onSubmit={handleUpdateCity}>
            <div className="overflow-hidden shadow sm:rounded-md">
              <div className="bg-white px-4 py-5 sm:p-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Descrição
                    </label>
                    <input
                      type="text"
                      name="description"
                      id="description"
                      value={cityData?.description}
                      onChange={(e) =>
                        setCityData((old) => ({
                          ...old,
                          description: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-400 focus:ring-green-400 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <label
                      htmlFor="cep"
                      className="block text-sm font-medium text-gray-700"
                    >
                      CEP
                    </label>
                    <input
                      type="text"
                      name="cep"
                      id="cep"
                      value={cityData?.cep}
                      onChange={(e) => {
                        if (e.target.value?.length > 9) return

                        setCityData((old) => ({
                          ...old,
                          cep: Mask.cep(e.target.value),
                        }))
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-400 focus:ring-green-400 sm:text-sm"
                    />
                  </div>
                </div>
                <p className="mt-3 w-full text-right text-sm font-medium text-black">
                  Criado em{' '}
                  {format(new Date(city.created_at), 'dd/MM/yyyy', {
                    locale: ptBR,
                  })}
                </p>
              </div>
              <div className="flex flex-row items-center justify-end gap-4 bg-gray-50 px-4 py-3 text-right sm:px-6">
                <div className="flex items-center justify-center gap-2">
                  <input
                    className="text-green-400 focus:text-green-400 focus:ring-green-400"
                    type="checkbox"
                    role="switch"
                    id="active"
                    checked={isCityActive}
                    onChange={() => setIsCityActive((old) => !old)}
                  />
                  <label
                    className="text-sm font-medium text-black"
                    htmlFor="active"
                  >
                    {isCityActive ? 'Ativa' : 'Inativa'}
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={!canUpdateCity}
                  title={
                    !isAllFieldsFilled
                      ? 'Preencha todos os campos'
                      : isAllFieldsValuesTheSame
                      ? 'Os valores dos campos não alteraram'
                      : ''
                  }
                  className="inline-flex justify-center rounded-md border border-transparent bg-green-500 py-2 px-4 text-sm font-medium text-white shadow-sm transition-colors duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-green-500"
                >
                  Salvar
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  )
}

export default City

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
  const { data } = await supabase.from('city').select('*').match({ id })

  return {
    props: {
      city: data?.[0],
    },
    revalidate: 60 * 30, // = 30 minutos
  }
}
