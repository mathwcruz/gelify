import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { parseCookies } from 'nookies'

import { PurchaseTransactionData } from '../../contexts/PurchaseTransactionContext'
import { Header } from '../../components/Header'
import { Search } from '../../components/Search'

import { supabase } from '../../services/supabase'
import { PurchaseTransactionItem } from '../../components/PurchaseTransaction/PurchaseTransactionItem'

interface PurchaseOrdersProps {
  purchases: PurchaseTransactionData[]
}

const PurchaseOrders = ({ purchases }: PurchaseOrdersProps) => {
  const [purchasesList, setPurchasesList] =
    useState<PurchaseTransactionData[]>(purchases)
  const [search, setSearch] = useState<string>('')

  return (
    <>
      <Head>
        <title>Ordens de compra</title>
      </Head>

      <Header />

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-20 px-4 py-12 sm:px-6">
        <div className="flex max-w-3xl flex-col items-center justify-center gap-2">
          <h1 className="text-center text-3xl font-bold text-black">
            Ordens de compra efetuadas
          </h1>
          <p className="text-base font-medium text-gray-600">
            Confira todas as suas compras já realizadas até o momento
          </p>
        </div>

        {purchasesList?.length > 0 ? (
          <div className="flex flex-col justify-center gap-4">
            <Search
              search={search}
              setSearch={setSearch}
              placeholder="Pesquisar por data da ordem de compra"
            />
            <ul className="flex w-72 flex-col justify-center gap-5 md:w-96">
              {purchasesList
                ?.filter((purchase) => {
                  if (!search) {
                    return purchase
                  }

                  if (
                    !!search &&
                    purchase?.date.toLowerCase().includes(search.toLowerCase())
                  ) {
                    return purchase
                  }
                })
                ?.map((purchase) => (
                  <PurchaseTransactionItem
                    purchase={purchase}
                    onRemovePurchaseTransaction={setPurchasesList}
                  />
                ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h1 className="text-center text-lg font-medium text-black">
              Não há ordens de compra cadastradas
            </h1>
            <Link href="/register/purchase-order">
              <a className="flex items-center justify-center rounded-lg border border-white bg-green-500 p-2 text-base font-semibold text-white transition-colors duration-300 hover:bg-green-600">
                Cadastrar ordem de compra
              </a>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

export default PurchaseOrders

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

  const { data: purchases } = await supabase
    .from('purchase')
    .select('*')
    .order('id', { ascending: true })

  const { data: purchasesItems } = await supabase
    .from('purchase_item')
    .select('*')
    .order('id', { ascending: true })

  const { data: products } = await supabase
    .from('product')
    .select('*')
    .order('id', { ascending: true })

  if (!purchases?.length) {
    return {
      props: {
        purchases: [],
      },
    }
  }

  const purchasesFormatted = purchases?.map((purchase) => {
    return {
      ...purchase,
      created_at: format(new Date(purchase?.created_at), 'dd/MM/yyyy', {
        locale: ptBR,
      }),
      purchase_items: [],
    }
  })

  let purchasesWithItems
  purchasesItems?.forEach((purchaseItem) => {
    purchasesWithItems = purchasesFormatted?.map((purchase) => {
      if (purchase?.id === purchaseItem?.purchase_id) {
        purchase?.purchase_items?.push({
          ...purchaseItem,
          product_description: products?.find(
            (product) => product?.id === purchaseItem?.product_id
          )?.description,
        })
      }

      return purchase
    })
  })

  return {
    props: {
      purchases: purchasesWithItems,
    },
  }
}
