import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { IdentificationIcon, TrashIcon } from '@heroicons/react/outline'

import { SalesTransactionData } from '../../contexts/SalesTransactionContext'
import { useClient } from '../../contexts/ClientContext'
import { Loading } from '../Loading'
import { SaleItem } from './SaleItem'

import { supabase } from '../../services/supabase'

interface SaleTransactionItemProps {
  sale: SalesTransactionData
  onRemoveSaleTransaction: any
}

export const SaleTransactionItem = ({
  sale,
  onRemoveSaleTransaction,
}: SaleTransactionItemProps) => {
  const { getClientById } = useClient()

  const [sellClient, setSellClient] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    setIsLoading(true)
    try {
      getClientById(sale?.client_id || '').then((client) => {
        setSellClient(client?.name || '')
      })
    } catch (error) {
      console.log({ error })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleRemoveSellTransaction = useCallback(
    async (sellId) => {
      try {
        setIsLoading(true)

        const sellTransactionItems = sale?.sells_items?.map(
          (sellItem) => sellItem?.id
        )

        const sellTransactionItemsPromises = sellTransactionItems?.map(
          async (sellItemId) => {
            try {
              await supabase
                .from('purchase_item')
                .delete()
                .match({ id: sellItemId })
            } catch (error) {
              console.log({ error })
            }
          }
        )

        await Promise.all(sellTransactionItemsPromises)

        const { data: sells, error } = await supabase
          .from('sell')
          .delete()
          .match({ id: sellId })

        if (!!error) {
          return toast.error('Ocorreu um erro ao remover a ordem de venda', {
            position: 'top-center',
            autoClose: 500,
            hideProgressBar: true,
          })
        }

        toast.success('Ordem de venda removida com sucesso', {
          position: 'top-center',
          autoClose: 1500,
          hideProgressBar: true,
        })

        onRemoveSaleTransaction(sells)
      } catch (error) {
        console.log({ error })
      } finally {
        setIsLoading(false)
      }
    },
    [onRemoveSaleTransaction]
  )

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <li
          className="flex flex-col gap-1 rounded-md border border-gray-400 px-3 py-2"
          key={sale?.id}
        >
          <div className="relative mb-2 flex">
            <div className="flex w-full flex-col justify-center gap-[6px]">
              <div className="flex flex-col justify-center">
                <span className="mb-[1px] block text-xs text-gray-500">
                  Data da compra
                </span>
                <h3 className="text-md text-left font-medium">{sale?.date}</h3>
              </div>
              <div className="flex w-full flex-row items-start justify-between gap-[50px]">
                <div className="flex flex-col justify-center">
                  <span className="mb-[1px] block text-xs text-gray-500">
                    Valor total
                  </span>
                  <span className="text-left text-sm font-medium">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(sale?.total_value || 0)}
                  </span>
                </div>
                <div className="mr-auto -ml-1 flex flex-col justify-center">
                  <span className="mb-[1px] block text-xs text-gray-500">
                    Cliente
                  </span>
                  <span className="text-left text-sm font-medium">
                    {sellClient}
                    <Link href={`/edit/supplier/${sale?.client_id}`}>
                      <a
                        title={`Visualizar ${sellClient}`}
                        className="flex items-center"
                      >
                        <IdentificationIcon className="h-5 w-5 text-green-400 transition-colors duration-300 ease-linear hover:text-green-600" />
                      </a>
                    </Link>
                  </span>
                </div>
              </div>
              <div className="flex w-full flex-row items-start justify-between gap-[200px]">
                <div className="flex flex-col justify-center">
                  <span className="mb-[1px] block text-xs text-gray-500">
                    Endereço de envio
                  </span>
                  <span className="text-left text-sm font-medium">
                    {sale?.delivery_address}
                  </span>
                </div>
              </div>
              {!!sale?.observation && (
                <div className="flex w-full flex-row items-start justify-between gap-[200px]">
                  <div className="flex flex-col justify-center">
                    <span className="mb-[1px] block text-xs text-gray-500">
                      Observações
                    </span>
                    <h3 className="text-md text-left font-medium">
                      {sale?.observation}
                    </h3>
                  </div>
                </div>
              )}
              <div className="mt-2 flex w-full flex-col justify-center gap-2">
                <h5 className="text-left text-sm font-semibold text-gray-600">
                  Itens vendidos
                </h5>
                <ul className="flex flex-col justify-center gap-2">
                  {sale?.sells_items?.map((saleItem) => (
                    <SaleItem key={saleItem?.id} saleItem={saleItem} />
                  ))}
                </ul>
              </div>
            </div>
            <div className="absolute top-0 right-0 flex gap-1 self-start">
              <button
                className="flex items-center justify-center"
                title="Remover ordem de compra"
                onClick={() => handleRemoveSellTransaction(sale?.id)}
              >
                <TrashIcon className="h-5 w-5 text-red-400 transition-colors duration-300 ease-linear hover:text-red-600" />
              </button>
            </div>
          </div>
          <div className="flex gap-2 self-end text-sm">
            <p>
              Criada em{' '}
              <span className="font-semibold text-green-500">
                {sale?.created_at}
              </span>
            </p>
          </div>
        </li>
      )}
    </>
  )
}
