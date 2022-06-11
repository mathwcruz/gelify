import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { FormEvent, useCallback, useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import SimpleCrypto from 'simple-crypto-js'
import { parseCookies } from 'nookies'
import { toast } from 'react-toastify'
const simpleCrypto = new SimpleCrypto('@gelify:user')

import { CityData } from '../../contexts/CityContext'
import { useUser } from '../../contexts/UserContext'
import { Header } from '../../components/Header'
import { Loading } from '../../components/Loading'
import { Mask, Regex } from '../../utils/formatters'

import { supabase } from '../../services/supabase'

const CityRegister: NextPage = () => {
  const { userId } = useUser()

  const [cityData, setCityData] = useState<CityData>({} as CityData)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isAllFieldsFilled, setIsAllFieldsFilled] = useState<boolean>(false)

  useEffect(() => {
    setIsAllFieldsFilled(
      Object.values(cityData).filter((value) => !!value)?.length === 2
    )
  }, [cityData])

  const handleCreateCity = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setIsLoading(true)

      if (!Regex.cep.test(cityData?.cep)) {
        setIsLoading(false)

        toast.error('CEP inválido, informe um correto', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
        })
        return
      }

      console.log(simpleCrypto.decrypt(userId || ''))
      try {
        const { data } = await supabase.from('city').insert({
          ...cityData,
          id: uuid(),
          active: true,
          user_id: simpleCrypto.decrypt(userId || ''),
        })

        if (!!data?.length) {
          setCityData({} as CityData)
          toast.success('Cidade cadastrada com sucesso!', {
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
    [cityData]
  )

  return (
    <>
      <Head>
        <title>Cadastrar nova cidade</title>
      </Head>

      <Header />

      <div className="mx-auto mt-28 max-w-7xl px-4 sm:px-6 md:col-span-2">
        {isLoading ? (
          <Loading />
        ) : (
          <form onSubmit={handleCreateCity}>
            <div className="overflow-hidden shadow sm:rounded-md">
              <div className="bg-white px-4 py-5 sm:p-6">
                <div className="grid grid-cols-7 gap-6">
                  <div className="col-span-4 sm:col-span-2">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Descrição*
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
                      CEP*
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
              </div>
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  type="submit"
                  disabled={!isAllFieldsFilled}
                  title={!isAllFieldsFilled ? 'Preencha todos os campos' : ''}
                  className="inline-flex justify-center rounded-md border border-transparent bg-green-500 py-2 px-4 text-sm font-medium text-white shadow-sm transition-colors duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-green-500 disabled:hover:opacity-60"
                >
                  Cadastrar cidade
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  )
}

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

  return {
    props: {},
  }
}

export default CityRegister
