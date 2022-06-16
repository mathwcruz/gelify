import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useState, useCallback, useEffect } from 'react'
import SimpleCrypto from 'simple-crypto-js'
import { parseCookies } from 'nookies'
import { format, isBefore, isAfter, isSameDay } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import _ from 'lodash'
import { toast } from 'react-toastify'
import { RefreshIcon } from '@heroicons/react/solid'
const simpleCrypto = new SimpleCrypto('@gelify:user')

import { SalesTransactionData } from '../../contexts/SalesTransactionContext'
import { ClientData } from '../../contexts/ClientContext'
import { Header } from '../../components/Header'
import { SaleTransactionItem } from '../../components/SaleTransaction/SaleTransactionItem'
import { FinalDate, InitialDate } from '../../components/Filter/Date'
import { Select } from '../../components/Filter/Select'
import { FilterSearchButton } from '../../components/Filter/FilterSearchButton'
import { Loading } from '../../components/Loading'
import { validateDate } from '../../utils/validations'

import { supabase } from '../../services/supabase'

interface SaleFilterData {
  initialDate: string
  finalDate: string
  client: string
}

interface SaleOrdersProps {
  sales: SalesTransactionData[]
  clients: ClientData[]
}

const SaleOrders = ({ sales, clients }: SaleOrdersProps) => {
  const [salesList, setSalesList] = useState<SalesTransactionData[]>(sales)
  const [saleFilterData, setSaleFilterData] = useState<SaleFilterData>(
    {} as SaleFilterData
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSomeFieldFilled, setIsSomeFieldFilled] = useState<boolean>(false)

  const handleResetFilterData = useCallback(() => {
    setSaleFilterData({
      finalDate: '',
      initialDate: '',
      client: '',
    } as SaleFilterData)

    setSalesList(sales)

    toast.success('Filtros resetados', {
      position: 'top-center',
      autoClose: 500,
      hideProgressBar: true,
    })
  }, [])

  const handleSearchSaleOrders = useCallback(() => {
    setIsLoading(true)

    const isAllFieldsFilledAndValid =
      Object.values(saleFilterData).filter(
        (value) => !!value && typeof value === 'string'
      )?.length >= 2

    if (
      isAllFieldsFilledAndValid &&
      !!validateDate(saleFilterData?.initialDate) &&
      !!validateDate(saleFilterData?.finalDate)
    ) {
      const salesFiltered = sales
        ?.filter(
          (sale) =>
            (isSameDay(
              new Date(saleFilterData?.initialDate),
              new Date(sale?.date)
            ) ||
              isAfter(
                new Date(sale?.date),
                new Date(saleFilterData?.initialDate)
              )) &&
            (isSameDay(
              new Date(saleFilterData?.finalDate),
              new Date(sale?.date)
            ) ||
              isBefore(
                new Date(sale?.date),
                new Date(saleFilterData?.finalDate)
              ))
        )
        ?.filter((purchase) =>
          !!saleFilterData?.client
            ? purchase?.client_id === saleFilterData?.client
            : purchase
        )

      setSalesList(salesFiltered)

      setIsLoading(false)

      return toast.success('Lista atualizada conforme filtros', {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: true,
      })
    }

    return toast.error('Confira os campos informados e tente novamente.', {
      position: 'top-center',
      autoClose: 500,
      hideProgressBar: true,
    })
  }, [saleFilterData])

  useEffect(() => {
    setIsSomeFieldFilled(
      Object.values(saleFilterData)?.some(
        (value) => typeof value === 'string' && !!value
      )
    )
  }, [saleFilterData])

  return (
    <>
      <Head>
        <title>Ordens de venda</title>
      </Head>

      <Header />

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-20 px-4 py-12 sm:px-6">
        <div className="flex max-w-3xl flex-col items-center justify-center gap-2">
          <h1 className="text-center text-3xl font-bold text-black dark:text-white">
            Ordens de venda realizadas
          </h1>
          <p className="text-base font-medium text-gray-600 dark:text-gray-200">
            Confira todas as suas vendas já realizadas até o momento
          </p>
        </div>

        {sales?.length > 0 ? (
          <main className="flex w-full max-w-3xl flex-col items-center justify-center gap-12">
            <div className="flex flex-row items-center justify-center gap-4">
              <section className="-mt-5 grid w-full grid-cols-3 items-center justify-center gap-3">
                <InitialDate
                  initialDate={saleFilterData?.initialDate}
                  setInitialDate={(value) =>
                    setSaleFilterData((old) => ({
                      ...old,
                      initialDate: value,
                    }))
                  }
                />
                <FinalDate
                  finalDate={saleFilterData?.finalDate}
                  setFinalDate={(value) =>
                    setSaleFilterData((old) => ({
                      ...old,
                      finalDate: value,
                    }))
                  }
                />
                <Select
                  field="client"
                  placeholder="Selecione o cliente"
                  label="Cliente"
                  options={clients}
                  value={saleFilterData?.client}
                  setValue={(value) =>
                    setSaleFilterData((old) => ({
                      ...old,
                      client: value,
                    }))
                  }
                />
              </section>
              <section className="flex flex-row items-center justify-center gap-2">
                <FilterSearchButton
                  disabled={!isSomeFieldFilled}
                  onSearchData={handleSearchSaleOrders}
                />
                <button
                  type="button"
                  title="Limpar filtros"
                  disabled={!isSomeFieldFilled}
                  onClick={handleResetFilterData}
                  className=" mt-1 inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent bg-green-500 p-1 text-sm font-medium text-white shadow transition-colors duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-green-500 dark:text-gray-300 dark:disabled:opacity-60"
                >
                  <RefreshIcon className="h-5 w-5 text-gray-300 dark:text-gray-200" />
                </button>
              </section>
            </div>
            {isLoading ? (
              <Loading />
            ) : (
              <ul className="grid w-72 grid-cols-1 justify-center gap-7 md:w-[400px]">
                {salesList?.length > 0 ? (
                  <>
                    {salesList?.map((sale) => (
                      <SaleTransactionItem sale={sale} />
                    ))}
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                    <h1 className="text-center text-2xl font-medium text-black dark:text-white">
                      Não há ordens de venda com os filtros informados
                    </h1>
                    <p className="text-center text-base font-normal text-gray-700">
                      Pesquise por outros filtros ou até mesmo clique no botão
                      abaixo para cadastrar uma nova ordem de venda
                    </p>
                    <Link href="/register/sale-order">
                      <a className="mt-2 flex w-60 items-center justify-center self-center rounded-lg border border-white bg-green-500 p-2 text-base font-semibold text-white transition-colors duration-300 hover:bg-green-600">
                        Cadastrar ordem de venda
                      </a>
                    </Link>
                  </div>
                )}
              </ul>
            )}
          </main>
        ) : (
          <div className="flex flex-col gap-4">
            <h1 className="text-center text-2xl font-medium text-black dark:text-white">
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

  const { data: clients } = await supabase
    .from('client')
    .select('*')
    .order('id', { ascending: true })
    .match({ user_id: userId })

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
      sales: sellsWithItems,
      clients,
    },
  }
}
