import { FormEvent, useCallback, useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { toast } from 'react-toastify'
import { PlusCircleIcon } from '@heroicons/react/solid'

import { ProductData } from '../../contexts/ProductContext'
import { SalesItemData } from '../../contexts/SalesTransactionContext'
import { supabase } from '../../services/supabase'

type SaleTransactionProductData = {
  unitary_value: number
  stock_quantity: number
  description: string
}

interface PurchaseTransactionFormProps {
  products: ProductData[]
  saleTransactionItems: SalesItemData[]
  setSaleTransactionItems: any
}

export const SaleTransactionForm = ({
  products,
  saleTransactionItems,
  setSaleTransactionItems,
}: PurchaseTransactionFormProps) => {
  const [saleTransactionDataItem, setSaleTransactionDataItem] =
    useState<SalesItemData>({} as SalesItemData)
  const [productData, setProductData] = useState<SaleTransactionProductData>(
    {} as SaleTransactionProductData
  )
  const [isProductQuantityMoreThanStock, setIsProductQuantityMoreThanStock] =
    useState<boolean>(false)

  const validateProductStockQuantity = useCallback(
    (productQuantity: number) => {
      if (productQuantity > productData?.stock_quantity) {
        return false
      }

      return true
    },
    [productData.stock_quantity]
  )

  useEffect(() => {
    if (saleTransactionDataItem?.quantity > 0) {
      const enoughProductQuantity = validateProductStockQuantity(
        saleTransactionDataItem?.quantity
      )
      setIsProductQuantityMoreThanStock(!enoughProductQuantity)
    }
  }, [saleTransactionDataItem?.quantity, productData?.description])

  useEffect(() => {
    if (saleTransactionItems?.length > 0) {
      const allProductItemTransactions = saleTransactionItems?.filter(
        (item) => item?.product_id === saleTransactionDataItem?.product_id
      )

      const totalQuantity = allProductItemTransactions?.reduce(
        (acc, cur) => acc + cur?.quantity,
        0
      )

      const enoughProductQuantity = validateProductStockQuantity(
        totalQuantity + saleTransactionDataItem?.quantity
      )

      setIsProductQuantityMoreThanStock(!enoughProductQuantity)
    }
  }, [saleTransactionItems, saleTransactionDataItem])

  const handleAddNewPurchaseTransactionItem = useCallback(
    (e: FormEvent) => {
      e.preventDefault()

      setSaleTransactionItems((old: any) => [
        ...old,
        {
          ...saleTransactionDataItem,
          total_value:
            productData?.unitary_value * saleTransactionDataItem?.quantity,
          product_description: productData?.description,
          product_unitary_value: productData?.unitary_value,
          product_stock_quantity: productData?.stock_quantity,
          id: uuid(),
          sale_id: undefined,
        },
      ])

      setSaleTransactionDataItem({} as SalesItemData)

      toast.success('Item adicionado com sucesso', {
        position: 'top-center',
        autoClose: 500,
        hideProgressBar: true,
      })
    },
    [saleTransactionDataItem, productData]
  )

  const handleGetProductData = useCallback(async (productId: string) => {
    try {
      const { data } = await supabase
        .from('product')
        .select('*')
        .match({ id: productId })

      if (data?.length) {
        const { description, stock_quantity, unitary_value } =
          data?.[0] as SaleTransactionProductData
        setProductData({ description, stock_quantity, unitary_value })
      }
    } catch (error) {
      console.log({ error })
    }
  }, [])

  return (
    <li className="flex w-full max-w-lg flex-row items-center gap-6">
      <div className="relative w-full">
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Quantidade*
        </label>
        <input
          type="number"
          name="quantity"
          id="quantity"
          autoComplete="off"
          value={Number(saleTransactionDataItem?.quantity) ?? null}
          onChange={(e) =>
            setSaleTransactionDataItem((old) => ({
              ...old,
              quantity: Number(e.target.value),
            }))
          }
          className={` mt-1 block w-full rounded-md border-gray-300 shadow focus:border-green-400 focus:ring-green-400 dark:bg-zinc-900 sm:text-sm ${
            isProductQuantityMoreThanStock
              ? 'hover:border-red-500 focus:border-red-500 focus:ring-red-400'
              : ''
          }`}
        />
        <span
          className={`absolute -bottom-5 block text-left text-xs font-semibold text-red-400 ${
            isProductQuantityMoreThanStock
              ? 'opacity-100 transition-opacity duration-150 ease-in-out'
              : 'opacity-0'
          }`}
        >
          Estoque insuficiente
        </span>
      </div>
      <div className="w-full">
        <label
          htmlFor="supplier"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Produto*
        </label>
        <select
          id="product"
          name="product"
          defaultValue=""
          value={saleTransactionDataItem?.product_id ?? ''}
          onChange={async (e) => {
            e.preventDefault()

            setSaleTransactionDataItem((old) => ({
              ...old,
              product_id: e.target.value,
            }))

            await handleGetProductData(e.target.value)
          }}
          className=" mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow focus:border-green-400 focus:outline-none focus:ring-green-400 dark:bg-zinc-900 sm:text-sm"
        >
          <>
            <option className="dark:text-gray-400" value="" disabled>
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
        className="mt-6 flex items-center justify-center transition-opacity duration-200 ease-in-out hover:opacity-80 focus:outline disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:opacity-30 dark:disabled:opacity-50 dark:disabled:hover:opacity-50"
        title={
          !saleTransactionDataItem?.product_id ||
          saleTransactionDataItem?.quantity <= 0 ||
          !saleTransactionDataItem?.quantity ||
          isProductQuantityMoreThanStock
            ? 'Preencha os campos ao lado'
            : 'Adicionar item'
        }
        disabled={
          !saleTransactionDataItem?.product_id ||
          saleTransactionDataItem?.quantity <= 0 ||
          !saleTransactionDataItem?.quantity ||
          isProductQuantityMoreThanStock
        }
        onClick={handleAddNewPurchaseTransactionItem}
      >
        <PlusCircleIcon className="w-6 text-green-400" />
      </button>
    </li>
  )
}
