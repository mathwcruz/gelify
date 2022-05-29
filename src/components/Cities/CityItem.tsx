import { PencilIcon, TrashIcon } from '@heroicons/react/outline'
import Link from 'next/link'

import { CityData } from '../../contexts/CityContext'

interface CityItemsProps {
  city: CityData
  onRemoveCity: (id: string) => void
}

export const CityItem = ({ city, onRemoveCity }: CityItemsProps) => {
  return (
    <li
      className="flex flex-col gap-1 rounded-md border border-gray-400 px-3 py-2"
      key={city?.id}
    >
      <div className="mb-2 flex justify-between">
        <div className="flex flex-col justify-center">
          <h3 className="font-semi text-left text-lg">{city?.description}</h3>
          <span className="text-left text-sm font-medium text-gray-500">
            {city?.cep}
          </span>
        </div>
        <div className="flex gap-1">
          <Link href={`/edit/city/${city?.id}`}>
            <a
              title={`Editar ${city?.description}`}
              className="flex items-center"
            >
              <PencilIcon className="h-5 w-5 text-green-400 transition-colors duration-300 ease-linear hover:text-green-600" />
            </a>
          </Link>
          <button
            title={`Remover ${city?.description}`}
            onClick={() => onRemoveCity(city?.id)}
          >
            <TrashIcon className="h-5 w-5 text-red-400 transition-colors duration-300 ease-linear hover:text-red-600" />
          </button>
        </div>
      </div>
      <span className="self-end text-sm">
        Criado em{' '}
        <span className="font-semibold text-green-500">{city?.created_at}</span>
      </span>
    </li>
  )
}
