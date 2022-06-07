import { ProductData } from '../../contexts/ProductContext'

interface PurchaseTransactionFormProps {
  products: ProductData[]
}

export const PurchaseTransactionForm = ({
  products,
}: PurchaseTransactionFormProps) => {
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
          // value={}
          onChange={() => {}}
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
          onChange={() => {}}
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
    </li>
  )
}
