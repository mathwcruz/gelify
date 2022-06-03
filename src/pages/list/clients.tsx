import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { Search } from '../../components/Search'
import { Header } from '../../components/Header'
import { ClientItem } from '../../components/Client/ClientItem'
import { ClientData } from '../../contexts/ClientContext'

import { supabase } from '../../services/supabase'

interface ClientsProps {
  clients: ClientData[]
}

const Clients = ({ clients }: ClientsProps) => {
  const [search, setSearch] = useState<string>('')

  return (
    <>
      <Head>
        <title>Clientes</title>
      </Head>

      <Header />

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-20 px-4 py-12 sm:px-6">
        <div className="flex max-w-3xl flex-col items-center justify-center gap-2">
          <h1 className="text-center text-3xl font-bold text-black">
            Clientes cadastrados
          </h1>
          <p className="text-base font-medium text-gray-600">
            Confira os clientes que já foram cadastrados no sistema
          </p>
        </div>

        {clients?.length > 0 ? (
          <div className="flex flex-col justify-center gap-4">
            <Search
              search={search}
              setSearch={setSearch}
              placeholder="Pesquisar por clientes"
            />
            <ul className="flex w-72 flex-col justify-center gap-5 md:w-96">
              {clients
                ?.filter((client) => {
                  if (!search) {
                    return client
                  }

                  if (
                    !!search &&
                    client?.name.toLowerCase().includes(search.toLowerCase())
                  ) {
                    return client
                  }
                })
                ?.map((person) => (
                  <ClientItem key={person?.id} client={person} />
                ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h1 className="text-center text-lg font-medium text-black">
              Não há clientes cadastrados
            </h1>
            <Link href="/register/client">
              <a className="flex items-center justify-center rounded-lg border border-white bg-green-500 p-2 text-base font-semibold text-white transition-colors duration-300 hover:bg-green-600">
                Cadastrar cliente
              </a>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

export default Clients

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await supabase
    .from('client')
    .select('*')
    .order('id', { ascending: true })

  const clients = data?.map((client) => {
    return {
      ...client,
      created_at: format(new Date(client?.created_at), 'dd/MM/yyyy', {
        locale: ptBR,
      }),
    }
  })

  return {
    props: {
      clients,
    },
    revalidate: 60 * 30, // = 30 minutos
  }
}
