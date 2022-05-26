import { NextPage } from 'next'
import Head from 'next/head'
import { FormEvent, useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import { v4 as uuid } from 'uuid'

import { supabase } from '../../services/supabase'
import { Loading } from '../../components/Loading'

const CityRegister: NextPage = () => {
  const [description, setDescription] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleCreateCity = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setIsLoading(true)

      if (!description?.trim()) {
        setIsLoading(false)

        return toast.error('Preencha o campo, por favor', {
          position: 'top-center',
          autoClose: 500,
          hideProgressBar: true,
        })
      }

      try {
        const { data } = await supabase
          .from('cities')
          .insert({ id: uuid(), description })

        if (!!data?.length) {
          setDescription('')
          toast.success('Cidade cadastrada com sucesso!', {
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
    [description]
  )

  return (
    <>
      <Head>
        <title>Registar nova cidade</title>
      </Head>

      <div className="mx-auto mt-28 max-w-7xl px-4 sm:px-6 md:col-span-2">
        {isLoading ? (
          <Loading />
        ) : (
          <form onSubmit={handleCreateCity}>
            <div className="overflow-hidden shadow sm:rounded-md">
              <div className="bg-white px-4 py-5 sm:p-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
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
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-400 focus:ring-green-400 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-green-500 py-2 px-4 text-sm font-medium text-white shadow-sm transition-colors duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                >
                  Cadastrar cidade
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  )
}

export default CityRegister
