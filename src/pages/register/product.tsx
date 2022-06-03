import { NextPage } from 'next'
import Head from 'next/head'
import { FormEvent, useCallback, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { v4 as uuid } from 'uuid'

import { supabase } from '../../services/supabase'
import { Loading } from '../../components/Loading'
import { Header } from '../../components/Header'
import { ProductData } from '../../contexts/ProductContext'

const ProductRegister: NextPage = () => {
  const [productData, setProductData] = useState<ProductData>({} as ProductData)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isAllFieldsFilled, setIsAllFieldsFilled] = useState<boolean>(false)

  useEffect(() => {
    setIsAllFieldsFilled(
      Object.values(productData).filter((value) => !!value)?.length === 3
    )
  }, [productData])

  const handleCreateProduct = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setIsLoading(true)

      try {
        const { data } = await supabase
          .from('product')
          .insert({ ...productData, id: uuid(), active: true })

        if (!!data?.length) {
          setProductData({} as ProductData)
          toast.success('Produto cadastrado com sucesso!', {
            position: 'top-center',
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            progress: undefined,
          })

          setIsLoading(false)
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.log(error)
        setIsLoading(false)
      }
    },
    [productData]
  )

  return (
    <>
      <Head>
        <title>Cadastrar novo produto</title>
      </Head>

      <Header />

      <div className="mx-auto mt-28 max-w-7xl px-4 sm:px-6 md:col-span-2">
        {isLoading ? (
          <Loading />
        ) : (
          <form onSubmit={handleCreateProduct}>
            <div className="overflow-hidden shadow sm:rounded-md">
              <div className="bg-white px-4 py-5 sm:p-6">
                <div className="grid grid-cols-10 gap-6">
                  <div className="col-span-3">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Descrição
                    </label>
                    <input
                      type="text"
                      name="description"
                      id="description"
                      value={productData?.description}
                      onChange={(e) =>
                        setProductData((old) => ({
                          ...old,
                          description: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-400 focus:ring-green-400 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="unitary_value"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Valor unitário
                    </label>
                    <input
                      type="number"
                      name="unitary_value"
                      id="unitary_value"
                      autoComplete="off"
                      value={productData?.unitary_value}
                      onChange={(e) => {
                        setProductData((old) => ({
                          ...old,
                          unitary_value: Number(e.target.value),
                        }))
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-400 focus:ring-green-400 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="stock_quantity"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Quantidade em estoque
                    </label>
                    <input
                      type="number"
                      name="stock_quantity"
                      id="stock_quantity"
                      autoComplete="off"
                      value={productData?.stock_quantity}
                      onChange={(e) => {
                        setProductData((old) => ({
                          ...old,
                          stock_quantity: Math.round(Number(e.target.value)),
                        }))
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-400 focus:ring-green-400 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  type="submit"
                  disabled={!isAllFieldsFilled}
                  title={!isAllFieldsFilled ? 'Preencha todos os campos' : ''}
                  className="inline-flex justify-center rounded-md border border-transparent bg-green-500 py-2 px-4 text-sm font-medium text-white shadow-sm transition-colors duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-green-500 disabled:hover:opacity-60"
                >
                  Cadastrar produto
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  )
}

export default ProductRegister
