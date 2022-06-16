type SelectOptionsData = {
  id: string
  name: string
}

interface SelectProps<T> {
  field: string
  placeholder: string
  label: string
  options: T[]
  value: string
  setValue(value: string): void
}

export const Select = <T extends SelectOptionsData>({
  field,
  placeholder,
  label,
  options,
  value,
  setValue,
}: SelectProps<T>) => {
  return (
    <div className="flex flex-col gap-[2px]">
      <label
        htmlFor={field}
        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        {label}
      </label>
      <select
        id={field}
        name={field}
        defaultValue=""
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className=" mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow focus:border-green-500 focus:outline-none focus:ring-green-500 dark:bg-zinc-900 dark:focus:border-gray-300 dark:focus:ring-gray-300 sm:text-sm"
      >
        <>
          <option className="dark:text-gray-400" value="" disabled>
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
