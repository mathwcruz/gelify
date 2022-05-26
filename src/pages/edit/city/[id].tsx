import { GetStaticProps, GetStaticPropsContext, GetStaticPaths } from 'next'
import Head from 'next/head'
import { FormEvent, useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { supabase } from '../../../services/supabase'
import { Loading } from '../../../components/Loading'

interface CityProps {
  city: {
    id: string
    description: string
    created_at: string
  }
}

const City = ({ city }: CityProps) => {
  const [description, setDescription] = useState<string>(city.description)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleUpdateCity = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()

      if (!description?.trim()) {
        return toast.error('O campo descrição deve estar preenchido', {
          position: 'top-center',
          autoClose: 500,
          hideProgressBar: true,
        })
      }

      try {
        setIsLoading(true)
        const { error } = await supabase
          .from('cities')
          .update({ description })
          .match({ id: city?.id })

        if (!error) {
          setIsLoading(false)
          return toast.success('Cidade atualizada com sucesso!', {
            position: 'top-center',
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            progress: undefined,
          })
        } else {
          return toast.error('Ocorreu um erro ao atualizar a cidade', {
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
    [description]
  )

  return (
    <>
      <Head>
        <title>Cidade de {city?.description}</title>
      </Head>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-20 px-4 py-12 sm:px-6">
        {isLoading ? (
          <Loading />
        ) : (
          <form onSubmit={handleUpdateCity}>
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
                <p className="w-full text-right text-sm font-medium text-black">
                  Criado em{' '}
                  {format(new Date(city.created_at), 'dd/MM/yyyy', {
                    locale: ptBR,
                  })}
                </p>
              </div>
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-green-500 py-2 px-4 text-sm font-medium text-white shadow-sm transition-colors duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
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

export default City

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
  const { data } = await supabase.from('cities').select('*').match({ id })

  return {
    props: {
      city: data?.[0],
    },
    revalidate: 60 * 30, // = 30 minutos
  }
}
