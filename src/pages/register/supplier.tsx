import { NextPage } from 'next'
import Head from 'next/head'
import { FormEvent, useCallback, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { v4 as uuid } from 'uuid'

import { supabase } from '../../services/supabase'
import { Loading } from '../../components/Loading'
import { SupplierData } from '../../contexts/SupplierContext'
import { Mask, Regex } from '../../utils/formatters'

const SupplierRegister: NextPage = () => {
  const [supplierData, setSupplierData] = useState<SupplierData>(
    {} as SupplierData
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isAllFieldsFilled, setIsAllFieldsFilled] = useState<boolean>(false)

  useEffect(() => {
    setIsAllFieldsFilled(
      Object.values(supplierData).filter((value) => !!value)?.length === 4
    )
  }, [supplierData])

  const handleCreateSupplier = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setIsLoading(true)

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
        const { data } = await supabase
          .from('supplier')
          .insert({ ...supplierData, id: uuid() })

        if (!!data?.length) {
          setSupplierData({} as SupplierData)
          toast.success('Fornecedor cadastrado com sucesso!', {
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
    [supplierData]
  )

  return (
    <>
      <Head>
        <title>Cadastrar novo fornecedor</title>
      </Head>

      <div className="mx-auto mt-28 max-w-7xl px-4 sm:px-6 md:col-span-2">
        {isLoading ? (
          <Loading />
        ) : (
          <form onSubmit={handleCreateSupplier}>
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
              </div>
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  type="submit"
                  disabled={!isAllFieldsFilled}
                  title={!isAllFieldsFilled ? 'Preencha todos os campos' : ''}
                  className="inline-flex justify-center rounded-md border border-transparent bg-green-500 py-2 px-4 text-sm font-medium text-white shadow-sm transition-colors duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-green-500 disabled:hover:opacity-60"
                >
                  Cadastrar fornecedor
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  )
}

export default SupplierRegister