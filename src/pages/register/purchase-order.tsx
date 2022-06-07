import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { FormEvent, useCallback, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { v4 as uuid } from 'uuid'
import { parseCookies } from 'nookies'

import { supabase } from '../../services/supabase'
import { Loading } from '../../components/Loading'
import { Header } from '../../components/Header'
import { PurchaseTransactionData } from '../../contexts/PurchaseTransactionContext'
import { SupplierData } from '../../contexts/SupplierContext'
import { ProductData } from '../../contexts/ProductContext'
import { Mask } from '../../utils/formatters'
import { validateDate } from '../../utils/validations'
import { PurchaseTransactionForm } from '../../components/PurchaseTransaction/PurchaseTransactionForm'

interface PurchaseOrderRegisterProps {
  suppliers: SupplierData[]
  products: ProductData[]
}

const PurchaseOrderRegister = ({
  suppliers,
  products,
}: PurchaseOrderRegisterProps) => {
  const [purchaseTransactionData, setPurchaseTransactionData] =
    useState<PurchaseTransactionData>({} as PurchaseTransactionData)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(
    () => console.log({ purchaseTransactionData }),
    [purchaseTransactionData]
  )

  const handleCreatePurchaseTransaction = useCallback(
    async (event: FormEvent) => {
      event.preventDefault()
      setIsLoading(true)

      if (!validateDate(purchaseTransactionData?.date)) {
        setIsLoading(false)

        return toast.error('Data inválida, informe uma correta', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
        })
      }

      // try {
      //   const { data, error } = await supabase.from('purchase').insert({
      //     ...purchaseTransactionData,
      //     id: uuid(),
      //   })

      //   if (!error) {
      //     toast.success('Ordem de compra criada com sucesso', {
      //       position: 'top-center',
      //       autoClose: 500,
      //       hideProgressBar: true,
      //     })
      //   }

      //   const purchaseTransactionId: string = data?.[0]?.id

      //   setIsLoading(false)
      //   setPurchaseTransactionData({} as PurchaseTransactionData)
      // } catch (error) {
      //   console.log(error)
      //   toast.error('Ocorreu um erro ao criar a ordem de compra', {
      //     position: 'top-center',
      //     autoClose: 500,
      //     hideProgressBar: true,
      //   })

      //   setIsLoading(false)
      // }
    },
    [purchaseTransactionData]
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
          <form onSubmit={handleCreatePurchaseTransaction}>
            <div className="overflow-hidden shadow sm:rounded-md">
              <div className="bg-white px-4 py-5 sm:p-6">
                <div className="mb-8 grid grid-cols-10 gap-6">
                  <div className="col-span-2">
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Data da compra
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
                          date: Mask.birthdate(e.target.value),
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
                      Fornecedor
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
                  <PurchaseTransactionForm products={products} />
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  type="submit"
                  // disabled={!isAllFieldsFilled}
                  // title={!isAllFieldsFilled ? 'Preencha todos os campos' : ''}
                  className="inline-flex justify-center rounded-md border border-transparent bg-green-500 py-2 px-4 text-sm font-medium text-white shadow-sm transition-colors duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-green-500 disabled:hover:opacity-60"
                >
                  Cadastrar ordem de compra
                </button>
              </div>
            </div>
          </form>
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
