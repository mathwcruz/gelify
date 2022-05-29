import {
  PencilIcon,
  TrashIcon,
  OfficeBuildingIcon,
} from '@heroicons/react/outline'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { useCity } from '../../contexts/CityContext'
import { ClientData } from '../../contexts/ClientContext'
import { Loading } from '../Loading'

interface ClientItemsProps {
  client: ClientData
  onRemoveClient: (id: string) => void
}

export const ClientItem = ({ client, onRemoveClient }: ClientItemsProps) => {
  const { getCityById } = useCity()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [clientCity, setClientCity] = useState<string | undefined>(undefined)

  useEffect(() => {
    setIsLoading(true)
    try {
      getCityById(client?.city_id || '').then((city) => {
        setClientCity(city?.description || '')
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
          key={client?.id}
        >
          <div className="mb-2 flex justify-between">
            <div className="flex flex-col justify-center gap-[6px]">
              <div className="flex flex-col justify-center">
                <span className="mb-[1px] block text-xs text-gray-500">
                  Nome
                </span>
                <h3 className="text-md text-left font-medium">
                  {client?.name}
                </h3>
              </div>
              <div className="flex w-full flex-row justify-between gap-[80px]">
                <div className="flex flex-col justify-center">
                  <span className="mb-[1px] block text-xs text-gray-500">
                    CPF
                  </span>
                  <span className="text-left text-sm font-medium">
                    {client?.cpf}
                  </span>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="mb-[1px] block text-xs text-gray-500">
                    Data de nascimento
                  </span>
                  <span className="text-left text-sm font-medium">
                    {client?.birthdate}
                  </span>
                </div>
              </div>
              <div className="flex w-full flex-row justify-between gap-[80px]">
                <div className="flex flex-col justify-center">
                  <span className="mb-[1px] block text-xs text-gray-500">
                    Número de celular
                  </span>
                  <span className="text-left text-sm font-medium">
                    {client?.cellphone}
                  </span>
                </div>
                <div className="mr-auto -ml-1 flex flex-col justify-center">
                  <span className="mb-[1px] block text-xs text-gray-500">
                    Cidade
                  </span>
                  <span className="text-left text-sm font-medium">
                    {clientCity}
                    <Link href={`/edit/city/${client?.city_id}`}>
                      <a
                        title={`Visualizar ${clientCity}`}
                        className="flex items-center"
                      >
                        <OfficeBuildingIcon className="h-4 w-4 text-green-400 transition-colors duration-300 ease-linear hover:text-green-600" />
                      </a>
                    </Link>
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="mb-[1px] block text-xs text-gray-500">
                  Email
                </span>
                <span className="block max-w-[50px] text-left text-sm font-medium">
                  {client?.email}
                </span>
              </div>
            </div>
            <div className="flex gap-1 self-start">
              <Link href={`/edit/client/${client?.id}`}>
                <a
                  title={`Editar ${client?.name}`}
                  className="flex items-center"
                >
                  <PencilIcon className="h-5 w-5 text-green-400 transition-colors duration-300 ease-linear hover:text-green-600" />
                </a>
              </Link>
              <button
                title={`Remover ${client?.name}`}
                onClick={() => onRemoveClient(client?.id)}
              >
                <TrashIcon className="h-5 w-5 text-red-400 transition-colors duration-300 ease-linear hover:text-red-600" />
              </button>
            </div>
          </div>
          <span className="self-end text-sm">
            Criado em{' '}
            <span className="font-semibold text-green-500">
              {client?.created_at}
            </span>
          </span>
        </li>
      )}
    </>
  )
}