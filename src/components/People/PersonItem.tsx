import {
  PencilIcon,
  TrashIcon,
  OfficeBuildingIcon,
} from '@heroicons/react/outline'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { useCity } from '../../contexts/CityContext'
import { Person } from '../../pages/list/people'
import { Loading } from '../Loading'

interface PersonItemsProps {
  person: Person
  onRemovePerson: (id: string) => void
}

export const PersonItem = ({ person, onRemovePerson }: PersonItemsProps) => {
  const { getCityById } = useCity()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [personCity, setPersonCity] = useState<string | undefined>(undefined)

  useEffect(() => {
    setIsLoading(true)
    try {
      getCityById(person?.city_id || '').then((city) => {
        setPersonCity(city?.description || '')
      })
    } catch (error) {
      console.log({ error })
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <li
          className="flex flex-col gap-1 rounded-md border border-gray-400 px-3 py-2"
          key={person?.id}
        >
          <div className="mb-2 flex justify-between">
            <div className="flex flex-col justify-center gap-[6px]">
              <div className="flex flex-col justify-center">
                <span className="mb-[1px] block text-xs text-gray-500">
                  Nome
                </span>
                <h3 className="text-md text-left font-medium">
                  {person?.name}
                </h3>
              </div>
              <div className="flex w-full flex-row justify-between gap-[80px]">
                <div className="flex flex-col justify-center">
                  <span className="mb-[1px] block text-xs text-gray-500">
                    CPF
                  </span>
                  <span className="text-left text-sm font-medium">
                    {person?.cpf}
                  </span>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="mb-[1px] block text-xs text-gray-500">
                    Data de nascimento
                  </span>
                  <span className="text-left text-sm font-medium">
                    {person?.birthdate}
                  </span>
                </div>
              </div>
              <div className="flex w-full flex-row justify-between gap-[80px]">
                <div className="flex flex-col justify-center">
                  <span className="mb-[1px] block text-xs text-gray-500">
                    Número de celular
                  </span>
                  <span className="text-left text-sm font-medium">
                    {person?.cellphone}
                  </span>
                </div>
                <div className="mr-auto -ml-1 flex flex-col justify-center">
                  <span className="mb-[1px] block text-xs text-gray-500">
                    Cidade
                  </span>
                  <span className="text-left text-sm font-medium">
                    {personCity}
                    <Link href={`/edit/city/${person?.city_id}`}>
                      <a
                        title={`Visualizar ${personCity}`}
                        className="flex items-center"
                      >
                        <OfficeBuildingIcon className="h-4 w-4 text-green-400 transition-colors duration-300 ease-linear hover:text-green-600" />
                      </a>
                    </Link>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-1 self-start">
              <Link href={`/edit/person/${person?.id}`}>
                <a
                  title={`Editar ${person?.name}`}
                  className="flex items-center"
                >
                  <PencilIcon className="h-5 w-5 text-green-400 transition-colors duration-300 ease-linear hover:text-green-600" />
                </a>
              </Link>
              <button
                title={`Remover ${person?.name}`}
                onClick={() => onRemovePerson(person?.id)}
              >
                <TrashIcon className="h-5 w-5 text-red-400 transition-colors duration-300 ease-linear hover:text-red-600" />
              </button>
            </div>
          </div>
          <span className="self-end text-sm">
            Criado em{' '}
            <span className="font-semibold text-green-500">
              {person?.created_at}
            </span>
          </span>
        </li>
      )}
    </>
  )
}
