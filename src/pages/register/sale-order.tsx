import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { FormEvent, useCallback, useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import { parseCookies } from 'nookies'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { TrashIcon } from '@heroicons/react/solid'
import { toast } from 'react-toastify'

import {
  SalesItemData,
  SalesTransactionData,
} from '../../contexts/SalesTransactionContext'
import { ClientData } from '../../contexts/ClientContext'
import { ProductData } from '../../contexts/ProductContext'
import { Loading } from '../../components/Loading'
import { Header } from '../../components/Header'
import { SaleTransactionForm } from '../../components/SaleTransaction/SaleTransactionForm'
import { Mask } from '../../utils/formatters'
import { validateDate } from '../../utils/validations'

import { supabase } from '../../services/supabase'

interface SaleOrderRegisterProps {
  clients: ClientData[]
  products: ProductData[]
}

const SaleOrderRegister = ({ clients, products }: SaleOrderRegisterProps) => {
  const [saleTransactionData, setSaleTransactionData] =
    useState<SalesTransactionData>({} as SalesTransactionData)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [saleTransactionItems, setSaleTransactionItems] = useState<
    SalesItemData[]
  >([])
  const [saleTransactionItemsTotalValue, setSaleTransactionItemsTotalValue] =
    useState<number>(0)

  useEffect(
    () =>
      setSaleTransactionData((old) => ({
        ...old,
        date: format(new Date(), 'dd/MM/yyyy', {
          locale: ptBR,
        }),
      })),
    []
  )

  useEffect(() => {
    const total = saleTransactionItems.reduce(
      (acc, item) => acc + item?.total_value,
      0
    )

    setSaleTransactionItemsTotalValue(Number(total?.toFixed(2)))
  }, [saleTransactionItems])

  const groupSaleTransactionItemsProducts = useCallback((array) => {
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

  const handleRemoveSaleTransactionItem = useCallback((itemId) => {
    setSaleTransactionItems((old) => old?.filter((item) => item.id !== itemId))
  }, [])

  const handleCreateSaleTransaction = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setIsLoading(true)

      if (!validateDate(saleTransactionData?.date)) {
        setIsLoading(false)

        return toast.error('Data inválida, informe uma correta', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
        })
      }

      try {
        const { data, error } = await supabase.from('sale').insert({
          ...saleTransactionData,
          total_value: saleTransactionItemsTotalValue,
          id: uuid(),
        })

        if (error) {
          return toast.error('Erro ao criar a ordem de venda', {
            position: 'top-center',
            autoClose: 500,
            hideProgressBar: true,
          })
        }

        const saleTransactionId: string = data?.[0]?.id as string

        const saleTransactionItemsFormatted = saleTransactionItems?.map(
          (item) => {
            return {
              id: item?.id,
              quantity: item?.quantity,
              total_value: item?.total_value,
              product_id: item?.product_id,
              sale_id: saleTransactionId,
            }
          }
        )

        const saleTransactionItemsPromises = saleTransactionItemsFormatted?.map(
          async (item) => {
            try {
              await supabase.from('sale_item').insert({ ...item })
            } catch (error) {
              console.log({ error })
            }
          }
        )

        let allProductsSelected = saleTransactionItems?.map((item) => ({
          id: item?.product_id,
          quantity: item?.quantity,
          stock_quantity: item?.product_stock_quantity,
        }))

        allProductsSelected =
          groupSaleTransactionItemsProducts(allProductsSelected)

        const purchaseProductsSelected = allProductsSelected?.map(
          async (product) => {
            try {
              await supabase
                .from('product')
                .update({
                  stock_quantity:
                    (product?.stock_quantity || 0) - product?.quantity,
                })
                .match({ id: product?.id })
            } catch (error) {
              console.log({ error })
            }
          }
        )

        await Promise.all([
          saleTransactionItemsPromises,
          purchaseProductsSelected,
        ])

        setIsLoading(false)
        setSaleTransactionData({} as SalesTransactionData)
        setSaleTransactionItems([])
        toast.success('Ordem de venda criada com sucesso', {
          position: 'top-center',
          autoClose: 500,
          hideProgressBar: true,
        })
      } catch (error) {
        console.log(error)
        toast.error('Ocorreu um erro ao criar a ordem de venda', {
          position: 'top-center',
          autoClose: 500,
          hideProgressBar: true,
        })

        setIsLoading(false)
      }
    },
    [
      saleTransactionData,
      saleTransactionItems,
      groupSaleTransactionItemsProducts,
      saleTransactionItemsTotalValue,
    ]
  )

  return (
    <>
      <Head>
        <title>Cadastrar nova ordem de venda</title>
      </Head>

      <Header />

      <div className="mx-auto mt-28 max-w-7xl px-4 sm:px-6 md:col-span-2">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <form onSubmit={handleCreateSaleTransaction}>
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
                        value={saleTransactionData?.date}
                        onChange={(e) => {
                          if (e.target.value?.length > 10) return

                          setSaleTransactionData((old) => ({
                            ...old,
                            date: Mask.birthdate(e.target.value),
                          }))
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-400 focus:ring-green-400 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="client"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Cliente*
                      </label>
                      <select
                        id="client"
                        name="client"
                        defaultValue=""
                        onChange={(e) =>
                          setSaleTransactionData((old) => ({
                            ...old,
                            client_id: e.target.value,
                          }))
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      >
                        <>
                          <option value="" disabled>
                            Selecione o cliente
                          </option>
                          {clients?.map((client) => (
                            <option key={client?.id} value={client?.id}>
                              {client?.name}
                            </option>
                          ))}
                        </>
                      </select>
                    </div>
                    <div className="col-span-3">
                      <label
                        htmlFor="delivery_address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Endereço de envio*
                      </label>
                      <input
                        type="text"
                        name="delivery_address"
                        id="delivery_address"
                        autoComplete="off"
                        value={saleTransactionData?.delivery_address}
                        onChange={(e) =>
                          setSaleTransactionData((old) => ({
                            ...old,
                            delivery_address: e.target.value,
                          }))
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-400 focus:ring-green-400 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-3">
                      <label
                        htmlFor="observation"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Observações (opcional)
                      </label>
                      <textarea
                        rows={1}
                        name="observation"
                        id="observation"
                        autoComplete="off"
                        value={saleTransactionData?.observation}
                        onChange={(e) =>
                          setSaleTransactionData((old) => ({
                            ...old,
                            observation: e.target.value,
                          }))
                        }
                        className="mt-1 block w-full resize-x rounded-md border-gray-300 shadow-sm focus:border-green-400 focus:ring-green-400 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h4 className="text-left text-base font-semibold text-gray-800">
                      Adicione um novo item
                    </h4>
                    <SaleTransactionForm
                      products={products}
                      setSaleTransactionItems={setSaleTransactionItems}
                    />
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <button
                    type="submit"
                    disabled={
                      !saleTransactionItems.length ||
                      !saleTransactionData?.delivery_address ||
                      !saleTransactionData?.date ||
                      !saleTransactionData?.client_id
                    }
                    title={
                      !saleTransactionItems.length ||
                      !saleTransactionData?.delivery_address ||
                      !saleTransactionData?.date ||
                      !saleTransactionData?.client_id
                        ? 'Preencha todos os campos'
                        : ''
                    }
                    className="inline-flex justify-center rounded-md border border-transparent bg-green-500 py-2 px-4 text-sm font-medium text-white shadow-sm transition-colors duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-green-500 disabled:hover:opacity-60"
                  >
                    Cadastrar ordem de venda
                  </button>
                </div>
              </div>
            </form>
            {saleTransactionItems?.length > 0 && (
              <div className="mt-5 flex flex-col items-end rounded-md bg-white px-4 py-5 shadow sm:p-6">
                <div className="flex w-full flex-col self-start">
                  <h3 className="text-left text-base font-semibold text-gray-700">
                    Itens adicionados
                  </h3>
                  <ul className="mb-4 flex flex-col justify-center gap-4">
                    {saleTransactionItems?.map((item) => (
                      <li
                        key={item?.id}
                        className="flex w-full flex-row items-center justify-between border-b border-gray-300 pb-4"
                      >
                        <section className="mt-2 mr-10 flex w-full flex-row items-center justify-between gap-6">
                          <div className="flex flex-col items-center gap-1">
                            <strong className="text-base font-semibold text-gray-800">
                              Identificador (Id)
                            </strong>
                            <span className="max-w-[250px] text-center text-sm text-gray-700">
                              {item?.id}
                            </span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <strong className="text-base font-semibold text-gray-800">
                              Produto
                            </strong>
                            <span className="max-w-[120px] text-center text-sm text-gray-700">
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
                            handleRemoveSaleTransactionItem(item?.id)
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
                    }).format(saleTransactionItemsTotalValue || 0)}
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

  const { data: clients } = await supabase
    .from('client')
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
      clients,
      products,
    },
  }
}

export default SaleOrderRegister
