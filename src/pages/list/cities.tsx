import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import SimpleCrypto from 'simple-crypto-js'
import { parseCookies } from 'nookies'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
const simpleCrypto = new SimpleCrypto('@gelify:user')

import { CityData } from '../../contexts/CityContext'
import { Search } from '../../components/Search'
import { Header } from '../../components/Header'
import { CityItem } from '../../components/City/CityItem'

import { supabase } from '../../services/supabase'

interface CitiesProps {
  cities: CityData[]
}

const Cities = ({ cities }: CitiesProps) => {
  const [search, setSearch] = useState<string>('')

  return (
    <>
      <Head>
        <title>Cidades</title>
      </Head>

      <Header />

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-20 px-4 py-12 sm:px-6">
        <div className="flex max-w-3xl flex-col items-center justify-center gap-2">
          <h1 className="text-center text-3xl font-bold text-black dark:text-white">
            Cidades cadastradas
          </h1>
          <p className="text-base font-medium text-gray-600 dark:text-gray-200">
            Confira as cidades disponíveis no sistema
          </p>
        </div>

        {cities?.length > 0 ? (
          <div className="flex flex-col justify-center gap-4">
            <Search
              search={search}
              setSearch={setSearch}
              placeholder="Pesquisar por cidades"
            />
            <ul className="grid w-72 grid-cols-1 justify-center gap-7 md:w-[700px] md:grid-cols-2">
              {cities
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
                  <CityItem key={city?.id} city={city} />
                ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h1 className="text-center text-2xl font-medium text-black dark:text-white">
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

  const { data } = await supabase
    .from('city')
    .select('*')
    .order('id', { ascending: true })
    .match({ user_id: simpleCrypto.decrypt(cookies['user']) })

  const cities = data?.map((city) => {
    return {
      ...city,
      created_at: format(new Date(city?.created_at), 'dd/MM/yyyy', {
        locale: ptBR,
      }),
    }
  })

  return {
    props: {
      cities,
    },
  }
}
