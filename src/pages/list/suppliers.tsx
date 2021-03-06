import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import SimpleCrypto from 'simple-crypto-js'
import { parseCookies } from 'nookies'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
const simpleCrypto = new SimpleCrypto('@gelify:user')

import { SupplierData } from '../../contexts/SupplierContext'
import { Header } from '../../components/Header'
import { Search } from '../../components/Search'
import { SupplierItem } from '../../components/Supplier/SupplierItem'

import { supabase } from '../../services/supabase'

interface SuppliersProps {
  suppliers: SupplierData[]
}

const Suppliers = ({ suppliers }: SuppliersProps) => {
  const [search, setSearch] = useState<string>('')

  return (
    <>
      <Head>
        <title>Fornecedores</title>
      </Head>

      <Header />

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-20 px-4 py-12 sm:px-6">
        <div className="flex max-w-3xl flex-col items-center justify-center gap-2">
          <h1 className="text-center text-3xl font-bold text-black dark:text-white">
            Fornecedores cadastrados
          </h1>
          <p className="text-base font-medium text-gray-600 dark:text-gray-200">
            Confira os fornecedores que já foram cadastrados no sistema
          </p>
        </div>

        {suppliers?.length > 0 ? (
          <div className="flex flex-col justify-center gap-4">
            <Search
              search={search}
              setSearch={setSearch}
              placeholder="Pesquisar por fornecedores"
            />
            <ul className="grid w-72 grid-cols-1 items-start justify-center gap-7 md:w-[800px] md:grid-cols-2">
              {suppliers
                ?.filter((supplier) => {
                  if (!search) {
                    return supplier
                  }

                  if (
                    !!search &&
                    supplier?.name.toLowerCase().includes(search.toLowerCase())
                  ) {
                    return supplier
                  }
                })
                ?.map((supplier) => (
                  <SupplierItem key={supplier?.id} supplier={supplier} />
                ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h1 className="text-center text-2xl font-medium text-black dark:text-white">
              Não há fornecedores cadastrados
            </h1>
            <Link href="/register/supplier">
              <a className="flex items-center justify-center rounded-lg border border-white bg-green-500 p-2 text-base font-semibold text-white transition-colors duration-300 hover:bg-green-600">
                Cadastrar fornecedor
              </a>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

export default Suppliers

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
    .from('supplier')
    .select('*')
    .order('id', { ascending: true })
    .match({ user_id: simpleCrypto.decrypt(cookies['user']) })

  const suppliers = data?.map((supplier) => {
    return {
      ...supplier,
      created_at: format(new Date(supplier?.created_at), 'dd/MM/yyyy', {
        locale: ptBR,
      }),
    }
  })

  return {
    props: {
      suppliers,
    },
  }
}
