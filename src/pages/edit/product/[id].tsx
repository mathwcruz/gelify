import { GetStaticProps, GetStaticPropsContext, GetStaticPaths } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FormEvent, useCallback, useState, useEffect } from 'react'
import { parseCookies } from 'nookies'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { toast } from 'react-toastify'

import { ProductData } from '../../../contexts/ProductContext'
import { Loading } from '../../../components/Loading'
import { Header } from '../../../components/Header'

import { supabase } from '../../../services/supabase'

interface ProductProps {
  product: ProductData
}

const Product = ({ product }: ProductProps) => {
  const { push } = useRouter()

  const [productData, setProductData] = useState<ProductData>(product)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isProductActive, setIsProductActive] = useState<boolean>(
    !!product?.active
  )
  const [canUpdateProduct, setCanUpdateProduct] = useState<boolean>(false)
  const [isAllFieldsFilled, setIsAllFieldsFilled] = useState<boolean>(false)
  const [isAllFieldsValuesTheSame, setIsAllFieldsValuesTheSame] =
    useState<boolean>(false)

  useEffect(() => {
    setIsLoading(true)
    const isUserAuthenticated = !!parseCookies(undefined)?.['user']

    if (!isUserAuthenticated) {
      push('/login')
    } else {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const data: any = { ...productData }
    delete data.active
    const initialProduct: any = { ...product }
    delete initialProduct.active

    const initialProductValues = Object.values(initialProduct)
    const productDataValues = Object.values(data)
    let bothDataHasTheSameValue = false

    bothDataHasTheSameValue = initialProductValues?.every(
      (value, index) => value === productDataValues[index]
    )

    setIsAllFieldsValuesTheSame(bothDataHasTheSameValue)

    setIsAllFieldsFilled(
      Object.values(data).filter((value) => !!value)?.length === 5
    )
  }, [product, productData])

  useEffect(() => {
    if (product?.active !== isProductActive && isAllFieldsFilled) {
      return setCanUpdateProduct(true)
    }

    if (isAllFieldsFilled && !isAllFieldsValuesTheSame) {
      return setCanUpdateProduct(true)
    }

    return setCanUpdateProduct(false)
  }, [isAllFieldsFilled, isAllFieldsValuesTheSame, isProductActive])

  const handleUpdateProduct = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()

      try {
        setIsLoading(true)
        const { error } = await supabase
          .from('product')
          .update({ ...productData, active: isProductActive })
          .match({ id: product?.id })

        if (!error) {
          setIsLoading(false)
          return toast.success('Produto atualizado com sucesso!', {
            position: 'top-center',
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            progress: undefined,
          })
        } else {
          return toast.error('Ocorreu um erro ao atualizar o produto', {
            position: 'top-center',
            autoClose: 500,
            hideProgressBar: true,
          })
        }
      } catch (error) {
        setIsLoading(false)
        console.log({ error })
      }
    },
    [productData, isProductActive]
  )

  return (
    <>
      <Head>
        <title>Produto | {product?.description}</title>
      </Head>

      <Header />

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-20 px-4 py-12 sm:px-6">
        {isLoading ? (
          <Loading />
        ) : (
          <form onSubmit={handleUpdateProduct}>
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
                <p className="mt-3 w-full text-right text-sm font-medium text-black">
                  Criado em{' '}
                  {format(new Date(product?.created_at), 'dd/MM/yyyy', {
                    locale: ptBR,
                  })}
                </p>
              </div>
              <div className="flex flex-row items-center justify-end gap-4 bg-gray-50 px-4 py-3 text-right sm:px-6">
                <div className="flex items-center justify-center gap-2">
                  <input
                    className="text-green-400 focus:text-green-400 focus:ring-green-400"
                    type="checkbox"
                    role="switch"
                    id="active"
                    checked={isProductActive}
                    onChange={() => setIsProductActive((old) => !old)}
                  />
                  <label
                    className="text-sm font-medium text-black"
                    htmlFor="active"
                  >
                    {isProductActive ? 'Ativo' : 'Inativo'}
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={!canUpdateProduct}
                  title={
                    !isAllFieldsFilled
                      ? 'Preencha todos os campos'
                      : isAllFieldsValuesTheSame
                      ? 'Os valores dos campos não alteraram'
                      : ''
                  }
                  className="inline-flex justify-center rounded-md border border-transparent bg-green-500 py-2 px-4 text-sm font-medium text-white shadow-sm transition-colors duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-green-500"
                >
                  Salvar
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  )
}

export default Product

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext) => {
  const { id } = params || {}
  const { data } = await supabase.from('product').select('*').match({ id })

  return {
    props: {
      product: data?.[0],
    },
    revalidate: 60 * 30, // = 30 minutos
  }
}
