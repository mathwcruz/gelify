import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import SimpleCrypto from 'simple-crypto-js'
import { parseCookies } from 'nookies'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
const simpleCrypto = new SimpleCrypto('@gelify:user')

import { SalesTransactionData } from '../../contexts/SalesTransactionContext'
import { Header } from '../../components/Header'
import { Search } from '../../components/Search'
import { SaleTransactionItem } from '../../components/SaleTransaction/SaleTransactionItem'

import { supabase } from '../../services/supabase'

interface SaleOrdersProps {
  sells: SalesTransactionData[]
}

const SaleOrders = ({ sells }: SaleOrdersProps) => {
  const [sellsList, setSellsList] = useState<SalesTransactionData[]>(sells)
  const [search, setSearch] = useState<string>('')

  return (
    <>
      <Head>
        <title>Ordens de venda</title>
      </Head>

      <Header />

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-20 px-4 py-12 sm:px-6">
        <div className="flex max-w-3xl flex-col items-center justify-center gap-2">
          <h1 className="text-center text-3xl font-bold text-black">
            Ordens de venda realizadas
          </h1>
          <p className="text-base font-medium text-gray-600">
            Confira todas as suas vendas já realizadas até o momento
          </p>
        </div>

        {sellsList?.length > 0 ? (
          <div className="flex flex-col justify-center gap-4">
            <Search
              search={search}
              setSearch={setSearch}
              placeholder="Pesquisar por data da ordem de venda"
            />
            <ul className="flex w-72 flex-col justify-center gap-5 md:w-96">
              {sellsList
                ?.filter((sale) => {
                  if (!search) {
                    return sale
                  }

                  if (
                    !!search &&
                    sale?.date.toLowerCase().includes(search.toLowerCase())
                  ) {
                    return sale
                  }
                })
                ?.map((sale) => (
                  <SaleTransactionItem
                    sale={sale}
                    onRemoveSaleTransaction={setSellsList}
                  />
                ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h1 className="text-center text-lg font-medium text-black">
              Não há ordens de venda cadastradas
            </h1>
            <Link href="/register/sale-order">
              <a className="flex items-center justify-center rounded-lg border border-white bg-green-500 p-2 text-base font-semibold text-white transition-colors duration-300 hover:bg-green-600">
                Cadastrar ordem de venda
              </a>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

export default SaleOrders

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

  const userId = simpleCrypto.decrypt(cookies['user'])

  const { data: sells } = await supabase
    .from('sale')
    .select('*')
    .order('id', { ascending: true })
    .match({ user_id: userId })

  const { data: sellsItems } = await supabase
    .from('sale_item')
    .select('*')
    .order('id', { ascending: true })
    .match({ user_id: userId })

  const { data: products } = await supabase
    .from('product')
    .select('*')
    .order('id', { ascending: true })
    .match({ user_id: userId })

  if (!sells?.length) {
    return {
      props: {
        sells: [],
      },
    }
  }

  const sellsFormatted = sells?.map((sale) => {
    return {
      ...sale,
      created_at: format(new Date(sale?.created_at), 'dd/MM/yyyy', {
        locale: ptBR,
      }),
      sells_items: [],
    }
  })

  let sellsWithItems
  sellsItems?.forEach((saleItem) => {
    sellsWithItems = sellsFormatted?.map((sale) => {
      if (sale?.id === saleItem?.sale_id) {
        sale?.sells_items?.push({
          ...saleItem,
          product_description: products?.find(
            (product) => product?.id === saleItem?.product_id
          )?.description,
        })
      }

      return sale
    })
  })

  return {
    props: {
      sells: sellsWithItems,
    },
  }
}
