import Link from 'next/link'
import { PencilIcon } from '@heroicons/react/outline'

import { SupplierData } from '../../contexts/SupplierContext'

interface SupplierItemProps {
  supplier: SupplierData
}

export const SupplierItem = ({ supplier }: SupplierItemProps) => {
  return (
    <li
      className="flex flex-col gap-1 rounded-md border border-gray-400 px-3 py-2"
      key={supplier?.id}
    >
      <div className="mb-2 flex justify-between">
        <div className="flex flex-col justify-center gap-[6px]">
          <div className="flex flex-col justify-center">
            <span className="mb-[1px] block text-xs text-gray-500 dark:text-gray-400">
              Nome
            </span>
            <h3 className="text-md text-left font-medium">{supplier?.name}</h3>
          </div>
          <div className="flex w-full flex-row justify-between gap-[80px]">
            <div className="flex flex-col justify-center">
              <span className="mb-[1px] block text-xs text-gray-500 dark:text-gray-400">
                CNPJ
              </span>
              <span className="text-left text-sm font-medium">
                {supplier?.cnpj}
              </span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="mb-[1px] block text-xs text-gray-500 dark:text-gray-400">
                Número de celular
              </span>
              <span className="text-left text-sm font-medium">
                {supplier?.cellphone}
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <span className="mb-[1px] block text-xs text-gray-500 dark:text-gray-400">
              Email
            </span>
            <span className="block max-w-[50px] text-left text-sm font-medium">
              {supplier?.email}
            </span>
          </div>
        </div>
        <div className="flex gap-1 self-start">
          <Link href={`/edit/supplier/${supplier?.id}`}>
            <a title={`Editar ${supplier?.name}`} className="flex items-center">
              <PencilIcon className="h-5 w-5 text-green-400 transition-colors duration-300 ease-linear hover:text-green-600" />
            </a>
          </Link>
        </div>
      </div>
      <div className="flex gap-2 self-end text-sm">
        <span className="text-left font-semibold text-black dark:text-white">
          {supplier?.active ? 'Ativo' : 'Inativo'}
        </span>
        <p>
          Criado em{' '}
          <span className="font-semibold text-green-500">
            {supplier?.created_at}
          </span>
        </p>
      </div>
    </li>
  )
}
