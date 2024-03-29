import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import SimpleCrypto from 'simple-crypto-js'
import { parseCookies } from 'nookies'
import { format, isBefore, isAfter, isSameDay } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import enUS from 'date-fns/locale/en-US'
import _ from 'lodash'
import { toast } from 'react-toastify'
import { RefreshIcon } from '@heroicons/react/solid'
const simpleCrypto = new SimpleCrypto('@gelify:user')

import { PurchaseTransactionData } from '../../contexts/PurchaseTransactionContext'
import { SupplierData } from '../../contexts/SupplierContext'
import { Header } from '../../components/Header'
import { PurchaseTransactionItem } from '../../components/PurchaseTransaction/PurchaseTransactionItem'
import { FinalDate, InitialDate } from '../../components/Filter/Date'
import { Select } from '../../components/Filter/Select'
import { FilterSearchButton } from '../../components/Filter/FilterSearchButton'
import { Loading } from '../../components/Loading'
import { formatDateToEnUS, validateDate } from '../../utils/validations'

import { supabase } from '../../services/supabase'

interface PurchaseFilterData {
  initialDate: string
  finalDate: string
  supplier: string
}

interface PurchaseOrdersProps {
  purchases: PurchaseTransactionData[]
  suppliers: SupplierData[]
}

const PurchaseOrders = ({ purchases, suppliers }: PurchaseOrdersProps) => {
  const [purchasesList, setPurchasesList] =
    useState<PurchaseTransactionData[]>(purchases)
  const [purchaseFilterData, setPurchaseFilterData] =
    useState<PurchaseFilterData>({} as PurchaseFilterData)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSomeFieldFilled, setIsSomeFieldFilled] = useState<boolean>(false)

  const handleResetFilterData = useCallback(() => {
    setPurchaseFilterData({
      finalDate: '',
      initialDate: '',
      supplier: '',
    } as PurchaseFilterData)

    setPurchasesList(purchases)

    toast.success('Filtros resetados', {
      position: 'top-center',
      autoClose: 500,
      hideProgressBar: true,
    })
  }, [])

  const handleSearchPurchaseOrders = useCallback(() => {
    setIsLoading(true)

    const isAllFieldsFilledAndValid =
      Object.values(purchaseFilterData).filter(
        (value) => !!value && typeof value === 'string'
      )?.length >= 2

    if (
      isAllFieldsFilledAndValid &&
      !!validateDate(purchaseFilterData?.initialDate) &&
      !!validateDate(purchaseFilterData?.finalDate)
    ) {
      const purchasesFiltered = purchases
        ?.filter(
          (purchase) =>
            (isSameDay(
              formatDateToEnUS(purchase?.date),
              formatDateToEnUS(purchaseFilterData?.initialDate)
            ) ||
              isAfter(
                formatDateToEnUS(purchase?.date),
                formatDateToEnUS(purchaseFilterData?.initialDate)
              )) &&
            (isSameDay(
              formatDateToEnUS(purchase?.date),
              formatDateToEnUS(purchaseFilterData?.finalDate)
            ) ||
              isBefore(
                formatDateToEnUS(purchase?.date),
                formatDateToEnUS(purchaseFilterData?.finalDate)
              ))
        )
        ?.filter((purchase) => {
          if (!!purchaseFilterData?.supplier) {
            return purchase?.supplier_id === purchaseFilterData?.supplier
          }

          return purchase
        })

      setPurchasesList(purchasesFiltered)
      setIsLoading(false)

      return toast.success('Lista atualizada conforme filtros', {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: true,
      })
    }

    setIsLoading(false)

    return toast.error('Confira os campos informados e tente novamente.', {
      position: 'top-center',
      autoClose: 500,
      hideProgressBar: true,
    })
  }, [purchaseFilterData, formatDateToEnUS])

  useEffect(() => {
    setIsSomeFieldFilled(
      Object.values(purchaseFilterData)?.some(
        (value) => typeof value === 'string' && !!value
      )
    )
  }, [purchaseFilterData])

  return (
    <>
      <Head>
        <title>Ordens de compra</title>
      </Head>

      <Header />

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-20 px-4 py-12 sm:px-6">
        <div className="flex max-w-3xl flex-col items-center justify-center gap-2">
          <h1 className="text-center text-3xl font-bold text-black dark:text-white">
            Ordens de compra efetuadas
          </h1>
          <p className="text-base font-medium text-gray-600 dark:text-gray-200">
            Confira todas as suas compras já realizadas até o momento
          </p>
        </div>

        {purchases?.length > 0 ? (
          <main className="flex w-full max-w-3xl flex-col items-center justify-center gap-12">
            <div className="flex flex-row items-center justify-center gap-4">
              <section className="-mt-5 grid w-full grid-cols-3 items-center justify-center gap-3">
                <InitialDate
                  initialDate={purchaseFilterData?.initialDate}
                  setInitialDate={(value) =>
                    setPurchaseFilterData((old) => ({
                      ...old,
                      initialDate: value,
                    }))
                  }
                />
                <FinalDate
                  finalDate={purchaseFilterData?.finalDate}
                  setFinalDate={(value) =>
                    setPurchaseFilterData((old) => ({
                      ...old,
                      finalDate: value,
                    }))
                  }
                />
                <Select
                  field="supplier"
                  placeholder="Selecione o fornecedor"
                  label="Fornecedor"
                  options={suppliers}
                  value={purchaseFilterData?.supplier}
                  setValue={(value) =>
                    setPurchaseFilterData((old) => ({
                      ...old,
                      supplier: value,
                    }))
                  }
                />
              </section>
              <section className="flex flex-row items-center justify-center gap-2">
                <FilterSearchButton
                  disabled={!isSomeFieldFilled}
                  onSearchData={handleSearchPurchaseOrders}
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
              <>
                {purchasesList?.length > 0 ? (
                  <ul className="grid w-72 grid-cols-1 items-start justify-center gap-7 md:w-[750px] md:grid-cols-2">
                    {purchasesList?.map((purchase) => (
                      <PurchaseTransactionItem purchase={purchase} />
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col gap-3">
                    <h1 className="text-center text-2xl font-medium text-black dark:text-white">
                      Não há ordens de compra com os filtros informados
                    </h1>
                    <p className="max-w-[450px] self-center text-center text-base font-normal text-gray-700 dark:text-gray-200">
                      Pesquise por outros filtros ou até mesmo clique no botão
                      abaixo para cadastrar uma nova ordem de compra
                    </p>
                    <Link href="/register/purchase-order">
                      <a className="mt-2 flex w-60 items-center justify-center self-center rounded-lg border border-white bg-green-500 p-2 text-base font-semibold text-white transition-colors duration-300 hover:bg-green-600">
                        Cadastrar ordem de compra
                      </a>
                    </Link>
                  </div>
                )}
              </>
            )}
          </main>
        ) : (
          <div className="flex flex-col gap-4">
            <h1 className="text-center text-2xl font-medium text-black dark:text-white">
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

  const userId = simpleCrypto.decrypt(cookies['user'])

  const { data: suppliers } = await supabase
    .from('supplier')
    .select('*')
    .order('id', { ascending: true })
    .match({ user_id: userId })

  const { data: purchases } = await supabase
    .from('purchase')
    .select('*')
    .order('id', { ascending: true })
    .match({ user_id: userId })

  const { data: purchasesItems } = await supabase
    .from('purchase_item')
    .select('*')
    .order('id', { ascending: true })
    .match({ user_id: userId })

  const { data: products } = await supabase
    .from('product')
    .select('*')
    .order('id', { ascending: true })
    .match({ user_id: userId })

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
      suppliers,
    },
  }
}
