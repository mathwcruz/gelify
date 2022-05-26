import { PencilIcon, TrashIcon } from '@heroicons/react/outline'
import Link from 'next/link'

import { Person } from '../../pages/list/people'

interface PersonItemsProps {
  person: Person
  onRemovePerson: (id: string) => void
}

export const PersonItem = ({ person, onRemovePerson }: PersonItemsProps) => {
  return (
    <li
      className="flex flex-col gap-1 rounded-md border border-gray-400 px-3 py-2"
      key={person?.id}
    >
      <div className="mb-2 flex justify-between">
        <h3 className="text-left text-lg font-medium">{person?.name}</h3>
        <div className="flex gap-1">
          <Link href={`/edit/person/${person?.id}`}>
            <a title={`Editar ${person?.name}`} className="flex items-center">
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
          {person?.createdAt}
        </span>
      </span>
    </li>
  )
}
