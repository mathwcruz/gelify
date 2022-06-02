import { PencilIcon } from '@heroicons/react/outline'
import Link from 'next/link'

import { ProductData } from '../../contexts/ProductContext'

interface ProductItemProps {
  product: ProductData
}

export const ProductItem = ({ product }: ProductItemProps) => {
  return (
    <li
      className="flex flex-col gap-1 rounded-md border border-gray-400 px-3 py-2"
      key={product?.id}
    >
      <div className="mb-2 flex justify-between">
        <div className="flex flex-col justify-center gap-[6px]">
          <div className="flex flex-col justify-center">
            <span className="mb-[1px] block text-xs text-gray-500">
              Descrição
            </span>
            <h3 className="text-md text-left font-medium">
              {product?.description}
            </h3>
          </div>
          <div className="flex w-full flex-row justify-between gap-[80px]">
            <div className="flex flex-col justify-center">
              <span className="mb-[1px] block text-xs text-gray-500">
                Valor unitário
              </span>
              <span className="text-left text-sm font-medium">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(product?.unitary_value || 0)}
              </span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="mb-[1px] block text-xs text-gray-500">
                Quantidade em estoque
              </span>
              <span className="text-left text-sm font-medium">
                {product?.stock_quantity}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-1 self-start">
          <Link href={`/edit/product/${product?.id}`}>
            <a
              title={`Editar ${product?.description}`}
              className="flex items-center"
            >
              <PencilIcon className="h-5 w-5 text-green-400 transition-colors duration-300 ease-linear hover:text-green-600" />
            </a>
          </Link>
        </div>
      </div>
      <div className="flex gap-2 self-end text-sm">
        <span className="text-left font-semibold text-black">
          {product?.active ? 'Ativo' : 'Inativo'}
        </span>
        <p>
          Criado em{' '}
          <span className="font-semibold text-green-500">
            {product?.created_at}
          </span>
        </p>
      </div>
    </li>
  )
}
