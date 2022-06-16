type SelectOptionsData = {
  id: string
  name: string
}

interface SelectProps<T> {
  field: string
  placeholder: string
  label: string
  multiple: boolean
  options: T[]
  setValue(value: string): void
}

export const Select = <T extends SelectOptionsData>({
  field,
  placeholder,
  label,
  multiple,
  options,
  setValue,
}: SelectProps<T>) => {
  return (
    <div className="flex flex-col gap-[2px]">
      <label
        htmlFor={field}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <select
        id={field}
        name={field}
        defaultValue=""
        multiple={multiple}
        onChange={(e) => setValue(e.target.value)}
        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      >
        <>
          <option value="" disabled>
            {placeholder}
          </option>
          {options?.map((option) => (
            <option key={option?.id} value={option?.id}>
              {option?.name}
            </option>
          ))}
        </>
      </select>
    </div>
  )
}
