import Link from 'next/link'
import { useEffect, useState } from 'react'
import { IdentificationIcon } from '@heroicons/react/outline'

import { PurchaseTransactionData } from '../../contexts/PurchaseTransactionContext'
import { useSupplier } from '../../contexts/SupplierContext'
import { Loading } from '../Loading'
import { PurchaseItem } from './PurchaseItem'

interface PurchaseTransactionItemProps {
  purchase: PurchaseTransactionData
}

export const PurchaseTransactionItem = ({
  purchase,
}: PurchaseTransactionItemProps) => {
  const { getSupplierById } = useSupplier()

  const [purchaseSupplier, setPurchaseSupplier] = useState<string | undefined>(
    undefined
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    setIsLoading(true)

    try {
      getSupplierById(purchase?.supplier_id || '').then((supplier) => {
        setPurchaseSupplier(supplier?.name || '')
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
          key={purchase?.id}
        >
          <div className="mb-2 flex">
            <div className="flex w-full flex-col justify-center gap-[6px]">
              <div className="flex flex-col justify-center">
                <span className="mb-[1px] block text-xs text-gray-500 dark:text-gray-400">
                  Data da compra
                </span>
                <h3 className="text-md text-left font-medium">
                  {purchase?.date}
                </h3>
              </div>
              <div className="flex w-full flex-row items-start justify-between gap-[50px]">
                <div className="flex flex-col justify-center">
                  <span className="mb-[1px] block text-xs text-gray-500 dark:text-gray-400">
                    Valor total
                  </span>
                  <span className="text-left text-sm font-medium">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(purchase?.total_value || 0)}
                  </span>
                </div>
                <div className="mr-auto -ml-1 flex flex-col justify-center">
                  <span className="mb-[1px] block text-xs text-gray-500 dark:text-gray-400">
                    Fornecedor
                  </span>
                  <span className="text-left text-sm font-medium">
                    {purchaseSupplier}
                    <Link href={`/edit/supplier/${purchase?.supplier_id}`}>
                      <a
                        title={`Visualizar ${purchaseSupplier}`}
                        className="flex items-center"
                      >
                        <IdentificationIcon className="h-5 w-5 text-green-400 transition-colors duration-300 ease-linear hover:text-green-600" />
                      </a>
                    </Link>
                  </span>
                </div>
              </div>
              <div className="mt-2 flex w-full flex-col justify-center gap-2">
                <h5 className="text-left text-sm font-semibold text-gray-600 dark:text-gray-200">
                  Itens comprados
                </h5>
                <ul className="flex flex-col justify-center gap-2">
                  {purchase?.purchase_items?.map((purchaseItem) => (
                    <PurchaseItem
                      key={purchaseItem?.id}
                      purchaseItem={purchaseItem}
                    />
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="flex gap-2 self-end text-sm">
            <p>
              Criada em{' '}
              <span className="font-semibold text-green-500">
                {purchase?.created_at}
              </span>
            </p>
          </div>
        </li>
      )}
    </>
  )
}
