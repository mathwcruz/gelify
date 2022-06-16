import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import SimpleCrypto from 'simple-crypto-js'
import { parseCookies } from 'nookies'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
const simpleCrypto = new SimpleCrypto('@gelify:user')

import { ProductData } from '../../contexts/ProductContext'
import { Header } from '../../components/Header'
import { ProductItem } from '../../components/Product/ProductItem'
import { Search } from '../../components/Search'

import { supabase } from '../../services/supabase'

interface ProductsProps {
  products: ProductData[]
}

const Products = ({ products }: ProductsProps) => {
  const [search, setSearch] = useState<string>('')

  return (
    <>
      <Head>
        <title>Produtos</title>
      </Head>

      <Header />

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-20 px-4 py-12 sm:px-6">
        <div className="flex max-w-3xl flex-col items-center justify-center gap-2">
          <h1 className="text-center text-3xl font-bold text-black">
            Produtos cadastrados
          </h1>
          <p className="text-base font-medium text-gray-600">
            Confira os produtos que já foram cadastrados no sistema
          </p>
        </div>

        {products?.length > 0 ? (
          <div className="flex flex-col justify-center gap-4">
            <Search
              search={search}
              setSearch={setSearch}
              placeholder="Pesquisar por produtos"
            />
            <ul className="grid w-72 grid-cols-1 justify-center gap-7 md:w-[700px] md:grid-cols-2">
              {products
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
                  <ProductItem key={product?.id} product={product} />
                ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h1 className="text-center text-2xl font-medium text-black">
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

  const { data } = await supabase
    .from('product')
    .select('*')
    .order('id', { ascending: true })
    .match({ user_id: simpleCrypto.decrypt(cookies['user']) })

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
  }
}
