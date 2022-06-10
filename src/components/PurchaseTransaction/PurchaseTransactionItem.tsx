import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { IdentificationIcon, TrashIcon } from '@heroicons/react/outline'

import { PurchaseTransactionData } from '../../contexts/PurchaseTransactionContext'
import { useSupplier } from '../../contexts/SupplierContext'
import { Loading } from '../Loading'
import { PurchaseItem } from './PurchaseItem'

import { supabase } from '../../services/supabase'

interface PurchaseTransactionItemProps {
  purchase: PurchaseTransactionData
  onRemovePurchaseTransaction: any
}

export const PurchaseTransactionItem = ({
  purchase,
  onRemovePurchaseTransaction,
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

  const handleRemovePurchaseTransaction = useCallback(
    async (purchaseId) => {
      try {
        setIsLoading(true)

        const purchaseTransactionItems = purchase?.purchase_items?.map(
          (purchaseItem) => purchaseItem?.id
        )

        const purchaseTransactionItemsPromises = purchaseTransactionItems?.map(
          async (purchaseItemId) => {
            try {
              await supabase
                .from('purchase_item')
                .delete()
                .match({ id: purchaseItemId })
            } catch (error) {
              console.log({ error })
            }
          }
        )

        await Promise.all(purchaseTransactionItemsPromises)

        const { data: purchases, error } = await supabase
          .from('purchase')
          .delete()
          .match({ id: purchaseId })

        if (!!error) {
          return toast.error('Ocorreu um erro ao remover a ordem de compra', {
            position: 'top-center',
            autoClose: 500,
            hideProgressBar: true,
          })
        }

        toast.success('Ordem de compra removida com sucesso', {
          position: 'top-center',
          autoClose: 1500,
          hideProgressBar: true,
        })

        onRemovePurchaseTransaction(purchases)
      } catch (error) {
        console.log({ error })
      } finally {
        setIsLoading(false)
      }
    },
    [onRemovePurchaseTransaction]
  )

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <li
          className="flex flex-col gap-1 rounded-md border border-gray-400 px-3 py-2"
          key={purchase?.id}
        >
          <div className="mb-2 flex justify-between">
            <div className="flex flex-col justify-center gap-[6px]">
              <div className="flex flex-col justify-center">
                <span className="mb-[1px] block text-xs text-gray-500">
                  Data da compra
                </span>
                <h3 className="text-md text-left font-medium">
                  {purchase?.date}
                </h3>
              </div>
              <div className="flex w-full flex-row items-start justify-between gap-[200px]">
                <div className="flex flex-col justify-center">
                  <span className="mb-[1px] block text-xs text-gray-500">
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
                  <span className="mb-[1px] block text-xs text-gray-500">
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
              <div className="flex w-full flex-col justify-center gap-2">
                <h5 className="text-left text-sm font-semibold text-gray-600">
                  Itens comprados
                </h5>
                <ul className="flex flex-col justify-center gap-2">
                  {purchase?.purchase_items?.map((purchaseItem) => (
                    <PurchaseItem purchaseItem={purchaseItem} />
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex gap-1 self-start">
              <button
                className="flex items-center justify-center"
                title="Remover ordem de compra"
                onClick={() => handleRemovePurchaseTransaction(purchase?.id)}
              >
                <TrashIcon className="h-5 w-5 text-red-400 transition-colors duration-300 ease-linear hover:text-red-600" />
              </button>
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
