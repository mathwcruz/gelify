import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { FormEvent, useCallback, useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import SimpleCrypto from 'simple-crypto-js'
import { parseCookies } from 'nookies'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { TrashIcon } from '@heroicons/react/solid'
import { toast } from 'react-toastify'
const simpleCrypto = new SimpleCrypto('@gelify:user')

import { useUser } from '../../contexts/UserContext'
import {
  PurchaseTransactionData,
  PurchaseItemData,
} from '../../contexts/PurchaseTransactionContext'
import { SupplierData } from '../../contexts/SupplierContext'
import { ProductData } from '../../contexts/ProductContext'
import { Loading } from '../../components/Loading'
import { Header } from '../../components/Header'
import { PurchaseTransactionForm } from '../../components/PurchaseTransaction/PurchaseTransactionForm'
import { Mask } from '../../utils/formatters'
import { validateDate } from '../../utils/validations'

import { supabase } from '../../services/supabase'

interface PurchaseOrderRegisterProps {
  suppliers: SupplierData[]
  products: ProductData[]
}

const PurchaseOrderRegister = ({
  suppliers,
  products,
}: PurchaseOrderRegisterProps) => {
  const { loggedUser } = useUser()

  const [purchaseTransactionData, setPurchaseTransactionData] =
    useState<PurchaseTransactionData>({} as PurchaseTransactionData)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [purchaseTransactionItems, setPurchaseTransactionItems] = useState<
    PurchaseItemData[]
  >([])
  const [
    purchaseTransactionItemsTotalValue,
    setPurchaseTransactionItemsTotalValue,
  ] = useState<number>(0)

  useEffect(
    () =>
      setPurchaseTransactionData((old) => ({
        ...old,
        date: format(new Date(), 'dd/MM/yyyy', {
          locale: ptBR,
        }),
      })),
    []
  )

  useEffect(() => {
    const total = purchaseTransactionItems.reduce(
      (acc, item) => acc + item?.total_value,
      0
    )

    setPurchaseTransactionItemsTotalValue(Number(total?.toFixed(2)))
  }, [purchaseTransactionItems])

  const groupPurchaseTransactionItemsProducts = useCallback((array) => {
    let result: any[] = []

    array?.reduce((acc: any, item: any) => {
      if (!acc[item?.id]) {
        acc[item.id] = {
          id: item.id,
          quantity: 0,
          stock_quantity: 0,
        }
        result.push(acc[item.id])
      }
      acc[item?.id].quantity += item.quantity
      acc[item?.id].stock_quantity = item?.stock_quantity
      return acc
    }, {})

    return result
  }, [])

  const handleRemovePurchaseTransactionItem = useCallback((itemId) => {
    setPurchaseTransactionItems((old) =>
      old?.filter((item) => item.id !== itemId)
    )
  }, [])

  const handleCreatePurchaseTransaction = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setIsLoading(true)

      if (!validateDate(purchaseTransactionData?.date)) {
        setIsLoading(false)

        return toast.error('Data inválida, informe uma correta', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
        })
      }

      try {
        const { data, error } = await supabase.from('purchase').insert({
          ...purchaseTransactionData,
          total_value: purchaseTransactionItemsTotalValue,
          id: uuid(),
          user_id: simpleCrypto.decrypt(loggedUser?.id || ''),
        })

        if (error) {
          return toast.error('Erro ao criar a ordem de compra', {
            position: 'top-center',
            autoClose: 500,
            hideProgressBar: true,
          })
        }

        const purchaseTransactionId: string = data?.[0]?.id as string

        const purchaseTransactionItemsFormatted = purchaseTransactionItems?.map(
          (item) => {
            return {
              id: item?.id,
              quantity: item?.quantity,
              total_value: item?.total_value,
              product_id: item?.product_id,
              purchase_id: purchaseTransactionId,
            }
          }
        )

        const purchaseTransactionItemsPromises =
          purchaseTransactionItemsFormatted?.map(async (item) => {
            try {
              await supabase.from('purchase_item').insert({
                ...item,
                user_id: simpleCrypto.decrypt(loggedUser?.id || ''),
              })
            } catch (error) {
              console.log({ error })
            }
          })

        let allProductsSelected = purchaseTransactionItems?.map((item) => ({
          id: item?.product_id,
          quantity: item?.quantity,
          stock_quantity: item?.product_stock_quantity,
        }))

        allProductsSelected =
          groupPurchaseTransactionItemsProducts(allProductsSelected)

        const purchaseProductsSelected = allProductsSelected?.map(
          async (product) => {
            try {
              await supabase
                .from('product')
                .update({
                  stock_quantity:
                    (product?.stock_quantity || 0) + product?.quantity,
                })
                .match({
                  id: product?.id,
                  user_id: simpleCrypto.decrypt(loggedUser?.id || ''),
                })
            } catch (error) {
              console.log({ error })
            }
          }
        )

        await Promise.all([
          purchaseTransactionItemsPromises,
          purchaseProductsSelected,
        ])

        setIsLoading(false)
        setPurchaseTransactionData({} as PurchaseTransactionData)
        setPurchaseTransactionItems([])
        toast.success('Ordem de compra criada com sucesso', {
          position: 'top-center',
          autoClose: 500,
          hideProgressBar: true,
        })
      } catch (error) {
        console.log(error)
        toast.error('Ocorreu um erro ao criar a ordem de compra', {
          position: 'top-center',
          autoClose: 500,
          hideProgressBar: true,
        })

        setIsLoading(false)
      }
    },
    [
      purchaseTransactionData,
      purchaseTransactionItems,
      groupPurchaseTransactionItemsProducts,
      purchaseTransactionItemsTotalValue,
      loggedUser,
    ]
  )

  return (
    <>
      <Head>
        <title>Cadastrar nova ordem de compra</title>
      </Head>

      <Header />

      <div className="mx-auto mt-28 max-w-7xl px-4 sm:px-6 md:col-span-2">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <form onSubmit={handleCreatePurchaseTransaction}>
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="bg-white px-4 py-5 sm:p-6">
                  <div className="mb-8 grid grid-cols-10 gap-6">
                    <div className="col-span-2">
                      <label
                        htmlFor="date"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Data da compra*
                      </label>
                      <input
                        type="text"
                        name="date"
                        id="date"
                        autoComplete="off"
                        value={purchaseTransactionData?.date}
                        onChange={(e) => {
                          if (e.target.value?.length > 10) return

                          setPurchaseTransactionData((old) => ({
                            ...old,
                            date: Mask.date(e.target.value),
                          }))
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-400 focus:ring-green-400 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="supplier"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Fornecedor*
                      </label>
                      <select
                        id="supplier"
                        name="supplier"
                        defaultValue=""
                        onChange={(e) =>
                          setPurchaseTransactionData((old) => ({
                            ...old,
                            supplier_id: e.target.value,
                          }))
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      >
                        <>
                          <option value="" disabled>
                            Selecione o fornecedor
                          </option>
                          {suppliers?.map((supplier) => (
                            <option key={supplier?.id} value={supplier?.id}>
                              {supplier?.name}
                            </option>
                          ))}
                        </>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h4 className="text-left text-base font-semibold text-gray-800">
                      Adicione um novo item à sua compra
                    </h4>
                    <PurchaseTransactionForm
                      products={products}
                      setPurchaseTransactionItems={setPurchaseTransactionItems}
                    />
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <button
                    type="submit"
                    disabled={
                      !purchaseTransactionItems.length ||
                      !purchaseTransactionData?.date ||
                      !purchaseTransactionData?.supplier_id
                    }
                    title={
                      !purchaseTransactionItems.length ||
                      !purchaseTransactionData?.date ||
                      !purchaseTransactionData?.supplier_id
                        ? 'Preencha todos os campos'
                        : ''
                    }
                    className="inline-flex justify-center rounded-md border border-transparent bg-green-500 py-2 px-4 text-sm font-medium text-white shadow-sm transition-colors duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-green-500 disabled:hover:opacity-60"
                  >
                    Cadastrar ordem de compra
                  </button>
                </div>
              </div>
            </form>
            {purchaseTransactionItems?.length > 0 && (
              <div className="mt-5 flex flex-col items-end rounded-md bg-white px-4 py-5 shadow sm:p-6">
                <div className="flex w-full flex-col self-start">
                  <h3 className="text-left text-base font-semibold text-gray-700">
                    Itens adicionados
                  </h3>
                  <ul className="my-4 flex flex-col justify-center gap-4">
                    {purchaseTransactionItems?.map((item) => (
                      <li
                        key={item?.id}
                        className="flex w-full flex-row items-center justify-between border-b border-gray-300 pb-4"
                      >
                        <section className="mt-2 mr-10 flex w-full flex-row items-center justify-around gap-6">
                          <div className="flex flex-col items-center gap-1">
                            <strong className="text-base font-semibold text-gray-800">
                              Identificador (Id)
                            </strong>
                            <span className="w-[250px] text-center text-sm text-gray-700">
                              {item?.id}
                            </span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <strong className="text-base font-semibold text-gray-800">
                              Produto
                            </strong>
                            <span className="w-[120px] text-center text-sm text-gray-700">
                              {item?.product_description}
                            </span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <strong className="text-base font-semibold text-gray-800">
                              Quantidade
                            </strong>
                            <span className="max-w-[120px] text-center text-sm text-gray-700">
                              {item?.quantity}
                            </span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <strong className="text-base font-semibold text-gray-800">
                              Valor unitário
                            </strong>
                            <span className="max-w-[120px] text-center text-sm text-gray-700">
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              }).format(item?.product_unitary_value || 0)}
                            </span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <strong className="text-base font-semibold text-gray-800">
                              Subtotal
                            </strong>
                            <span className="max-w-[120px] text-center text-sm text-gray-700">
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              }).format(item?.total_value || 0)}
                            </span>
                          </div>
                        </section>
                        <button
                          title={`Remover ${item?.product_description}`}
                          onClick={() =>
                            handleRemovePurchaseTransactionItem(item?.id)
                          }
                        >
                          <TrashIcon className="w-5 text-red-500" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-row items-center justify-center gap-1">
                  <p className="text-base font-semibold text-gray-700">
                    Total acumulado
                  </p>
                  <span className="text-sm font-normal text-black">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(purchaseTransactionItemsTotalValue || 0)}
                  </span>
                </div>
              </div>
            )}
          </>
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

  const { data: suppliers } = await supabase
    .from('supplier')
    .select('*')
    .match({ active: true })
    .order('id', { ascending: true })

  const { data: products } = await supabase
    .from('product')
    .select('*')
    .match({ active: true })
    .order('id', { ascending: true })

  return {
    props: {
      suppliers,
      products,
    },
  }
}

export default PurchaseOrderRegister
