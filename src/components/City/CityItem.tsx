import Link from 'next/link'
import { PencilIcon } from '@heroicons/react/outline'

import { CityData } from '../../contexts/CityContext'

interface CityItemProps {
  city: CityData
}

export const CityItem = ({ city }: CityItemProps) => {
  return (
    <li
      className="flex flex-col gap-1 rounded-md border border-gray-400 px-3 py-2"
      key={city?.id}
    >
      <div className="mb-2 flex justify-between">
        <div className="flex flex-col justify-center">
          <h3 className="text-left text-lg font-semibold">
            {city?.description}
          </h3>
          <span className="text-left text-sm font-medium text-gray-500">
            {city?.cep}
          </span>
        </div>
        <div className="flex gap-1 self-start">
          <Link href={`/edit/city/${city?.id}`}>
            <a
              title={`Editar ${city?.description}`}
              className="flex items-center"
            >
              <PencilIcon className="h-5 w-5 text-green-400 transition-colors duration-300 ease-linear hover:text-green-600" />
            </a>
          </Link>
        </div>
      </div>
      <div className="flex gap-2 self-end text-sm">
        <span className="text-left font-semibold text-black">
          {city?.active ? 'Ativa' : 'Inativa'}
        </span>
        <p>
          Criado em{' '}
          <span className="font-semibold text-green-500">
            {city?.created_at}
          </span>
        </p>
      </div>
    </li>
  )
}
