import Link from 'next/link'
import { TagIcon } from '@heroicons/react/outline'

import { SalesItemData } from '../../contexts/SalesTransactionContext'

interface SaleItemProps {
  saleItem: SalesItemData
}

export const SaleItem = ({ saleItem }: SaleItemProps) => {
  return (
    <li
      className="flex flex-col justify-center border-b border-gray-300 pb-2"
      key={saleItem?.id}
    >
      <div className="mb-2 flex w-full flex-row justify-between gap-[60px]">
        <div className="flex w-full flex-col justify-center">
          <span className="mb-[1px] block text-xs text-gray-500">Produto</span>
          <span className="flex flex-row items-center justify-center gap-2 text-left text-sm font-medium">
            {saleItem?.product_description}
            <Link href={`/edit/product/${saleItem?.product_id}`}>
              <a
                title={`Visualizar ${saleItem?.product_description}`}
                className="flex w-full items-center"
              >
                <TagIcon className="h-5 w-5 text-green-400 transition-colors duration-300 ease-linear hover:text-green-600" />
              </a>
            </Link>
          </span>
        </div>
      </div>
      <div className="flex w-full flex-row justify-between gap-[60px]">
        <div className="flex flex-col items-center justify-center">
          <span className="mb-[1px] block text-xs text-gray-500">
            Quantidade
          </span>
          <span className="text-left text-sm font-medium">
            {saleItem?.quantity}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="mb-[1px] block text-xs text-gray-500">
            Valor total
          </span>
          <span className="text-left text-sm font-medium">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(saleItem?.total_value || 0)}
          </span>
        </div>
      </div>
    </li>
  )
}
