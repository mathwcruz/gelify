import { PencilIcon, TrashIcon } from '@heroicons/react/outline'
import Link from 'next/link'

import { City } from '../../pages/list/cities'

interface CityItemsProps {
  city: City
  onRemoveCity: (id: string) => void
}

export const CityItem = ({ city, onRemoveCity }: CityItemsProps) => {
  return (
    <li
      className="flex flex-col gap-1 rounded-md border border-gray-400 px-3 py-2"
      key={city?.id}
    >
      <div className="mb-2 flex justify-between">
        <h3 className="text-left text-lg font-medium">{city?.description}</h3>
        <div className="flex gap-1">
          <Link href={`/edit/${city?.id}`}>
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
        <span className="font-semibold text-green-500">{city?.createdAt}</span>
      </span>
    </li>
  )
}
