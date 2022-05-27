import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { toast } from 'react-toastify'

import { Loading } from '../../components/Loading'
import { Search } from '../../components/Search'
import { PersonItem } from '../../components/People/PersonItem'
import { usePerson } from '../../contexts/PersonContext'

import { supabase } from '../../services/supabase'

export type Person = {
  id: string
  name: string
  cpf: string
  birthdate: string
  cellphone: string
  city_id?: string
  created_at: string
}

interface PeopleProps {
  people: Person[]
}

const People = ({ people }: PeopleProps) => {
  const { getPeople } = usePerson()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [peopleList, setPeopleList] = useState<Person[]>(people || [])
  const [search, setSearch] = useState<string>('')

  const handleRemovePerson = useCallback(
    async (id) => {
      try {
        setIsLoading(true)

        const { error } = await supabase.from('people').delete().match({ id })

        if (!!error) {
          setIsLoading(false)
          return toast.error('Ocorreu um erro ao remover esta pessoa', {
            position: 'top-center',
            autoClose: 500,
            hideProgressBar: true,
          })
        }

        toast.success('Pessoa removida com sucesso!', {
          position: 'top-center',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
        })

        const data = await getPeople()

        if (data?.length > 0) {
          const people = data?.map((person) => {
            return {
              ...person,
              created_at: format(new Date(person?.created_at), 'dd/MM/yyyy', {
                locale: ptBR,
              }),
            }
          })

          setPeopleList(people)
        }
      } catch (error) {
        console.log({ error })
      } finally {
        setIsLoading(false)
      }
    },
    [getPeople]
  )

  return (
    <>
      <Head>
        <title>Lista de Pessoas</title>
      </Head>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-20 px-4 py-12 sm:px-6">
        <div className="flex max-w-3xl flex-col items-center justify-center gap-2">
          <h1 className="text-center text-3xl font-bold text-black">
            Pessoas cadastradas
          </h1>
          <p className="text-base font-medium text-gray-600">
            Confira as pessoas que já foram cadastradas no sistema
          </p>
        </div>

        {isLoading ? (
          <Loading />
        ) : peopleList?.length > 0 ? (
          <div className="flex flex-col justify-center gap-4">
            <Search
              search={search}
              setSearch={setSearch}
              placeholder="Pesquisa por pessoas"
            />
            <ul className="flex w-72 flex-col justify-center gap-5 md:w-96">
              {peopleList
                ?.filter((person) => {
                  if (!search) {
                    return person
                  }

                  if (
                    !!search &&
                    person?.name.toLowerCase().includes(search.toLowerCase())
                  ) {
                    return person
                  }
                })
                ?.map((person) => (
                  <PersonItem
                    key={person?.id}
                    person={person}
                    onRemovePerson={handleRemovePerson}
                  />
                ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h1 className="text-center text-lg font-medium text-black">
              Não há pessoas cadastradas
            </h1>
            <Link href="/register/person">
              <a className="flex items-center justify-center rounded-lg border border-white bg-green-500 p-2 text-base font-semibold text-white transition-colors duration-300 hover:bg-green-600">
                Cadastrar pessoa
              </a>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

export default People

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await supabase
    .from('people')
    .select('*')
    .order('id', { ascending: true })

  const people = data?.map((person) => {
    return {
      ...person,
      created_at: format(new Date(person?.created_at), 'dd/MM/yyyy', {
        locale: ptBR,
      }),
    }
  })

  return {
    props: {
      people,
    },
    revalidate: 60 * 30, // = 30 minutos
  }
}
