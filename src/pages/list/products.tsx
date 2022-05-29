import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { toast } from 'react-toastify'

import { Loading } from '../../components/Loading'
import { Search } from '../../components/Search'
import { ProductItem } from '../../components/Product/ProductItem'
import { useProduct, ProductData } from '../../contexts/ProductContext'

import { supabase } from '../../services/supabase'

interface ProductsProps {
  products: ProductData[]
}

const Products = ({ products }: ProductsProps) => {
  const { getProducts } = useProduct()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [productsList, setProductsList] = useState<ProductData[]>(
    products || []
  )
  const [search, setSearch] = useState<string>('')

  const handleRemoveProduct = useCallback(
    async (id) => {
      try {
        setIsLoading(true)

        const { error } = await supabase.from('product').delete().match({ id })

        if (!!error) {
          setIsLoading(false)
          return toast.error('Ocorreu um erro ao remover este produto', {
            position: 'top-center',
            autoClose: 500,
            hideProgressBar: true,
          })
        }

        toast.success('Produto removido com sucesso!', {
          position: 'top-center',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
        })

        const data = await getProducts()

        if (data?.length > 0) {
          const products = data?.map((product) => {
            return {
              ...product,
              created_at: format(new Date(product?.created_at), 'dd/MM/yyyy', {
                locale: ptBR,
              }),
            }
          })

          setProductsList(products)
        }
      } catch (error) {
        console.log({ error })
      } finally {
        setIsLoading(false)
      }
    },
    [getProducts]
  )

  return (
    <>
      <Head>
        <title>Produtos</title>
      </Head>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-20 px-4 py-12 sm:px-6">
        <div className="flex max-w-3xl flex-col items-center justify-center gap-2">
          <h1 className="text-center text-3xl font-bold text-black">
            Produtos cadastrados
          </h1>
          <p className="text-base font-medium text-gray-600">
            Confira os produtos que já foram cadastrados no sistema
          </p>
        </div>

        {isLoading ? (
          <Loading />
        ) : productsList?.length > 0 ? (
          <div className="flex flex-col justify-center gap-4">
            <Search
              search={search}
              setSearch={setSearch}
              placeholder="Pesquisar por produtos"
            />
            <ul className="flex w-72 flex-col justify-center gap-5 md:w-96">
              {productsList
                ?.filter((product) => {
                  if (!search) {
                    return product
                  }

                  if (
                    !!search &&
                    product?.description
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  ) {
                    return product
                  }
                })
                ?.map((product) => (
                  <ProductItem
                    key={product?.id}
                    product={product}
                    onRemoveProduct={handleRemoveProduct}
                  />
                ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h1 className="text-center text-lg font-medium text-black">
              Não há produtos cadastrados
            </h1>
            <Link href="/register/product">
              <a className="flex items-center justify-center rounded-lg border border-white bg-green-500 p-2 text-base font-semibold text-white transition-colors duration-300 hover:bg-green-600">
                Cadastrar produtos
              </a>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

export default Products

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await supabase
    .from('product')
    .select('*')
    .order('id', { ascending: true })

  const products = data?.map((product) => {
    return {
      ...product,
      created_at: format(new Date(product?.created_at), 'dd/MM/yyyy', {
        locale: ptBR,
      }),
    }
  })

  return {
    props: {
      products,
    },
    revalidate: 60 * 30, // = 30 minutos
  }
}
