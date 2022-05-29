import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { toast } from 'react-toastify'

import { Loading } from '../../components/Loading'
import { Search } from '../../components/Search'
import { SupplierItem } from '../../components/Supplier/SupplierItem'
import { useSupplier, SupplierData } from '../../contexts/SupplierContext'

import { supabase } from '../../services/supabase'

interface SuppliersProps {
  suppliers: SupplierData[]
}

const Suppliers = ({ suppliers }: SuppliersProps) => {
  const { getSuppliers } = useSupplier()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [suppliersList, setSuppliersList] = useState<SupplierData[]>(
    suppliers || []
  )
  const [search, setSearch] = useState<string>('')

  const handleRemoveSupplier = useCallback(
    async (id) => {
      try {
        setIsLoading(true)

        const { error } = await supabase.from('supplier').delete().match({ id })

        if (!!error) {
          setIsLoading(false)
          return toast.error('Ocorreu um erro ao remover este fornecedor', {
            position: 'top-center',
            autoClose: 500,
            hideProgressBar: true,
          })
        }

        toast.success('Fornecedor removido com sucesso!', {
          position: 'top-center',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
        })

        const data = await getSuppliers()

        if (data?.length > 0) {
          const suppliers = data?.map((supplier) => {
            return {
              ...supplier,
              created_at: format(new Date(supplier?.created_at), 'dd/MM/yyyy', {
                locale: ptBR,
              }),
            }
          })

          setSuppliersList(suppliers)
        }
      } catch (error) {
        console.log({ error })
      } finally {
        setIsLoading(false)
      }
    },
    [getSuppliers]
  )

  return (
    <>
      <Head>
        <title>Fornecedores</title>
      </Head>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-20 px-4 py-12 sm:px-6">
        <div className="flex max-w-3xl flex-col items-center justify-center gap-2">
          <h1 className="text-center text-3xl font-bold text-black">
            Fornecedores cadastrados
          </h1>
          <p className="text-base font-medium text-gray-600">
            Confira os fornecedores que já foram cadastrados no sistema
          </p>
        </div>

        {isLoading ? (
          <Loading />
        ) : suppliersList?.length > 0 ? (
          <div className="flex flex-col justify-center gap-4">
            <Search
              search={search}
              setSearch={setSearch}
              placeholder="Pesquisar por fornecedores"
            />
            <ul className="flex w-72 flex-col justify-center gap-5 md:w-96">
              {suppliersList
                ?.filter((supplier) => {
                  if (!search) {
                    return supplier
                  }

                  if (
                    !!search &&
                    supplier?.name.toLowerCase().includes(search.toLowerCase())
                  ) {
                    return supplier
                  }
                })
                ?.map((supplier) => (
                  <SupplierItem
                    key={supplier?.id}
                    supplier={supplier}
                    onRemoveSupplier={handleRemoveSupplier}
                  />
                ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h1 className="text-center text-lg font-medium text-black">
              Não há fornecedores cadastrados
            </h1>
            <Link href="/register/supplier">
              <a className="flex items-center justify-center rounded-lg border border-white bg-green-500 p-2 text-base font-semibold text-white transition-colors duration-300 hover:bg-green-600">
                Cadastrar fornecedor
              </a>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

export default Suppliers

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await supabase
    .from('supplier')
    .select('*')
    .order('id', { ascending: true })

  const suppliers = data?.map((supplier) => {
    return {
      ...supplier,
      created_at: format(new Date(supplier?.created_at), 'dd/MM/yyyy', {
        locale: ptBR,
      }),
    }
  })

  return {
    props: {
      suppliers,
    },
    revalidate: 60 * 30, // = 30 minutos
  }
}