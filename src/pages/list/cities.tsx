import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { toast } from 'react-toastify'

import { useCity } from '../../contexts/CityContext'
import { Loading } from '../../components/Loading'
import { Search } from '../../components/Search'
import { CityItem } from '../../components/Cities/CityItem'

import { supabase } from '../../services/supabase'

export type City = {
  id: string
  description: string
  createdAt: string
}

interface CitiesProps {
  cities: City[]
}

const Cities = ({ cities }: CitiesProps) => {
  const { getCities } = useCity()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [citiesList, setCitiesList] = useState<City[]>(cities || [])
  const [search, setSearch] = useState<string>('')

  const handleRemoveCity = useCallback(async (id) => {
    try {
      setIsLoading(true)

      const { error } = await supabase.from('cities').delete().match({ id })

      if (!!error) {
        setIsLoading(false)
        return toast.error('Ocorreu um erro ao remover esta cidade', {
          position: 'top-center',
          autoClose: 500,
          hideProgressBar: true,
        })
      }

      toast.success('Cidade removida com sucesso!', {
        position: 'top-center',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        progress: undefined,
      })

      const data = await getCities()

      if (data?.length > 0) {
        const cities = data?.map((city) => {
          return {
            ...city,
            createdAt: format(new Date(city?.created_at), 'dd/MM/yyyy', {
              locale: ptBR,
            }),
          }
        })

        setCitiesList(cities)
      }
    } catch (error) {
      console.log({ error })
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Lista de Cidades</title>
      </Head>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-20 px-4 py-12 sm:px-6">
        <div className="flex max-w-3xl flex-col items-center justify-center gap-2">
          <h1 className="text-center text-3xl font-bold text-black">
            Cidades cadastradas
          </h1>
          <p className="text-base font-medium text-gray-600">
            Confira as cidades disponíveis no sistema
          </p>
        </div>

        {isLoading ? (
          <Loading />
        ) : citiesList?.length > 0 ? (
          <div className="flex flex-col justify-center gap-4">
            <Search
              search={search}
              setSearch={setSearch}
              placeholder="Pesquisa por cidades"
            />
            <ul className="flex w-80 flex-col justify-center gap-5">
              {citiesList
                ?.filter((city) => {
                  if (!search) {
                    return city
                  }

                  if (
                    !!search &&
                    city?.description
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  ) {
                    return city
                  }
                })
                ?.map((city) => (
                  <CityItem
                    key={city?.id}
                    city={city}
                    onRemoveCity={handleRemoveCity}
                  />
                ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h1 className="text-center text-lg font-medium text-black">
              Não há cidades cadastradas
            </h1>
            <Link href="/register/city">
              <a className="flex items-center justify-center rounded-lg border border-white bg-green-500 p-2 text-base font-semibold text-white transition-colors duration-300 hover:bg-green-600">
                Cadastrar cidade
              </a>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

export default Cities

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await supabase
    .from('cities')
    .select('*')
    .order('id', { ascending: true })

  const cities = data?.map((city) => {
    return {
      id: city?.id,
      description: city?.description,
      createdAt: format(new Date(city?.created_at), 'dd/MM/yyyy', {
        locale: ptBR,
      }),
    }
  })

  return {
    props: {
      cities,
    },
    revalidate: 60 * 30, // = 30 minutos
  }
}
