import { SearchIcon } from '@heroicons/react/solid'

interface FilterSearchButtonProps {
  disabled: boolean
  onSearchData: () => void
}

export const FilterSearchButton = ({
  disabled,
  onSearchData,
}: FilterSearchButtonProps) => {
  return (
    <button
      type="button"
      disabled={disabled}
      title={!disabled ? 'Filtrar por dados inseridos' : ''}
      onClick={onSearchData}
      className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent bg-green-500 p-1 text-sm font-medium text-white shadow-sm transition-colors duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-green-500"
    >
      <SearchIcon className="h-5 w-5 text-gray-300" />
    </button>
  )
}
