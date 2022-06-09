import { FormEvent, useCallback, useState } from 'react'
import { PlusCircleIcon } from '@heroicons/react/solid'
import { v4 as uuid } from 'uuid'
import { toast } from 'react-toastify'

import { ProductData } from '../../contexts/ProductContext'
import { PurchaseItemData } from '../../contexts/PurchaseTransactionContext'
import { supabase } from '../../services/supabase'

type PurchaseTransactionProductData = {
  unitary_value: number
  stock_quantity: number
  description: string
}

interface PurchaseTransactionFormProps {
  products: ProductData[]
  setPurchaseTransactionItems: any
}

export const PurchaseTransactionForm = ({
  products,
  setPurchaseTransactionItems,
}: PurchaseTransactionFormProps) => {
  const [purchaseTransactionDataItem, setPurchaseTransactionDataItem] =
    useState<PurchaseItemData>({} as PurchaseItemData)
  const [productData, setProductData] =
    useState<PurchaseTransactionProductData>(
      {} as PurchaseTransactionProductData
    )

  const handleAddNewPurchaseTransactionItem = useCallback(
    (e: FormEvent) => {
      e.preventDefault()

      setPurchaseTransactionItems((old: any) => [
        ...old,
        {
          ...purchaseTransactionDataItem,
          total_value:
            productData?.unitary_value * purchaseTransactionDataItem?.quantity,
          product_description: productData?.description,
          product_unitary_value: productData?.unitary_value,
          product_stock_quantity: productData?.stock_quantity,
          id: uuid(),
          purchase_id: undefined,
        },
      ])

      setPurchaseTransactionDataItem({} as PurchaseItemData)

      toast.success('Item adicionado com sucesso', {
        position: 'top-center',
        autoClose: 500,
        hideProgressBar: true,
      })
    },
    [purchaseTransactionDataItem, productData]
  )

  const handleGetProductData = useCallback(async (productId: string) => {
    try {
      const { data } = await supabase
        .from('product')
        .select('*')
        .match({ id: productId })

      if (data?.length) {
        const { description, stock_quantity, unitary_value } =
          data?.[0] as PurchaseTransactionProductData
        setProductData({ description, stock_quantity, unitary_value })
      }
    } catch (error) {
      console.log({ error })
    }
  }, [])

  return (
    <li className="flex w-full max-w-lg flex-row items-center gap-6">
      <div className="w-full">
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-gray-700"
        >
          Quantidade
        </label>
        <input
          type="number"
          name="quantity"
          id="quantity"
          autoComplete="off"
          value={Number(purchaseTransactionDataItem?.quantity) ?? null}
          onChange={(e) =>
            setPurchaseTransactionDataItem((old) => ({
              ...old,
              quantity: Number(e.target.value),
            }))
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-400 focus:ring-green-400 sm:text-sm"
        />
      </div>
      <div className="w-full">
        <label
          htmlFor="supplier"
          className="block text-sm font-medium text-gray-700"
        >
          Produto
        </label>
        <select
          id="product"
          name="product"
          defaultValue=""
          value={purchaseTransactionDataItem?.product_id ?? ''}
          onChange={async (e) => {
            e.preventDefault()

            setPurchaseTransactionDataItem((old) => ({
              ...old,
              product_id: e.target.value,
            }))

            await handleGetProductData(e.target.value)
          }}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <>
            <option value="" disabled>
              Selecione o produto
            </option>
            {products?.map((product) => (
              <option key={product?.id} value={product?.id}>
                {product?.description}
              </option>
            ))}
          </>
        </select>
      </div>
      <button
        className="mt-6 flex items-center justify-center transition-opacity duration-200 ease-in-out hover:opacity-80 focus:outline disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:opacity-30"
        title="Adicionar item"
        disabled={
          !purchaseTransactionDataItem?.product_id ||
          purchaseTransactionDataItem?.quantity <= 0 ||
          !purchaseTransactionDataItem?.quantity
        }
        onClick={handleAddNewPurchaseTransactionItem}
      >
        <PlusCircleIcon className="w-6 text-green-400" />
      </button>
    </li>
  )
}
