import { GetStaticProps, GetStaticPropsContext, GetStaticPaths } from 'next'
import Head from 'next/head'
import { FormEvent, useCallback, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { supabase } from '../../../services/supabase'
import { SupplierData } from '../../../contexts/SupplierContext'
import { Loading } from '../../../components/Loading'
import { Header } from '../../../components/Header'
import { Mask, Regex } from '../../../utils/formatters'

interface SupplierProps {
  supplier: SupplierData
}

const Supplier = ({ supplier }: SupplierProps) => {
  const [supplierData, setSupplierData] = useState<SupplierData>(supplier)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSupplierActive, setIsSupplierActive] = useState<boolean>(
    !!supplier?.active
  )
  const [canUpdateSupplier, setCanUpdateSupplier] = useState<boolean>(false)
  const [isAllFieldsFilled, setIsAllFieldsFilled] = useState<boolean>(false)
  const [isAllFieldsValuesTheSame, setIsAllFieldsValuesTheSame] =
    useState<boolean>(false)

  useEffect(() => {
    const data: any = { ...supplierData }
    delete data.active
    const initialSupplier: any = { ...supplier }
    delete initialSupplier.active

    const initialSupplierValues = Object.values(supplier)
    const supplierDataValues = Object.values(supplierData)
    let bothDataHasTheSameValue = false

    bothDataHasTheSameValue = initialSupplierValues?.every(
      (value, index) => value === supplierDataValues[index]
    )

    setIsAllFieldsValuesTheSame(bothDataHasTheSameValue)

    setIsAllFieldsFilled(
      Object.values(supplierData).filter((value) => !!value)?.length === 6
    )
  }, [supplier, supplierData])

  useEffect(() => {
    if (supplier?.active !== isSupplierActive && isAllFieldsFilled) {
      return setCanUpdateSupplier(true)
    }

    if (isAllFieldsFilled && !isAllFieldsValuesTheSame) {
      return setCanUpdateSupplier(true)
    }

    return setCanUpdateSupplier(false)
  }, [isAllFieldsFilled, isAllFieldsValuesTheSame, isSupplierActive])

  const handleUpdateSupplier = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()

      if (!Regex.email.test(supplierData?.email)) {
        setIsLoading(false)

        toast.error('Email inválido, informe um correto', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
        })
      }

      if (!Regex.phone.test(supplierData?.cellphone)) {
        setIsLoading(false)

        toast.error('Telefone inválido, informe um correto', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
        })
      }

      if (!Regex.cnpj.test(supplierData?.cnpj)) {
        setIsLoading(false)

        toast.error('CNPJ inválido, informe um correto', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
        })
      }

      if (
        !Regex.email.test(supplierData?.email) ||
        !Regex.phone.test(supplierData?.cellphone) ||
        !Regex.cnpj.test(supplierData?.cnpj)
      ) {
        return
      }

      try {
        setIsLoading(true)
        const { error } = await supabase
          .from('supplier')
          .update({ ...supplierData, active: isSupplierActive })
          .match({ id: supplier?.id })

        if (!error) {
          setIsLoading(false)
          return toast.success('Fornecedor atualizado com sucesso!', {
            position: 'top-center',
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            progress: undefined,
          })
        } else {
          return toast.error('Ocorreu um erro ao atualizar o fornecedor', {
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
    [supplierData, isSupplierActive]
  )

  return (
    <>
      <Head>
        <title>Fornecedor | {supplier?.name}</title>
      </Head>

      <Header />

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-20 px-4 py-12 sm:px-6">
        {isLoading ? (
          <Loading />
        ) : (
          <form onSubmit={handleUpdateSupplier}>
            <div className="overflow-hidden shadow sm:rounded-md">
              <div className="bg-white px-4 py-5 sm:p-6">
                <div className="grid grid-cols-10 gap-6">
                  <div className="col-span-3">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nome
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={supplierData?.name}
                      onChange={(e) =>
                        setSupplierData((old) => ({
                          ...old,
                          name: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-400 focus:ring-green-400 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      autoComplete="off"
                      value={supplierData?.email}
                      onChange={(e) => {
                        setSupplierData((old) => ({
                          ...old,
                          email: e.target.value,
                        }))
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-400 focus:ring-green-400 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="cellphone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Número de celular
                    </label>
                    <input
                      type="text"
                      name="cellphone"
                      id="cellphone"
                      autoComplete="off"
                      value={supplierData?.cellphone}
                      onChange={(e) => {
                        if (e.target.value?.length > 15) return

                        setSupplierData((old) => ({
                          ...old,
                          cellphone: Mask.phone(e.target.value),
                        }))
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-400 focus:ring-green-400 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="cnpj"
                      className="block text-sm font-medium text-gray-700"
                    >
                      CNPJ
                    </label>
                    <input
                      type="text"
                      name="cnpj"
                      id="cnpj"
                      autoComplete="off"
                      value={supplierData?.cnpj}
                      onChange={(e) => {
                        if (e.target.value?.length > 18) return

                        setSupplierData((old) => ({
                          ...old,
                          cnpj: Mask.cnpj(e.target.value),
                        }))
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-400 focus:ring-green-400 sm:text-sm"
                    />
                  </div>
                </div>
                <p className="mt-3 w-full text-right text-sm font-medium text-black">
                  Criado em{' '}
                  {format(new Date(supplier?.created_at), 'dd/MM/yyyy', {
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
                    checked={isSupplierActive}
                    onChange={() => setIsSupplierActive((old) => !old)}
                  />
                  <label
                    className="text-sm font-medium text-black"
                    htmlFor="active"
                  >
                    {isSupplierActive ? 'Ativo' : 'Inativo'}
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={!canUpdateSupplier}
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

export default Supplier

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
  const { data } = await supabase.from('supplier').select('*').match({ id })

  return {
    props: {
      supplier: data?.[0],
    },
    revalidate: 60 * 30, // = 30 minutos
  }
}
