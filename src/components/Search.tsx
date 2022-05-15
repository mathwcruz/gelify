interface SearchProps {
  search: string
  setSearch: (search: string) => void
  placeholder: string
}

export const Search = ({ search, setSearch, placeholder }: SearchProps) => {
  return (
    <div className="flex justify-center">
      <div className="mb-3 xl:w-96">
        <div className="input-group relative mb-4 flex w-full flex-wrap items-center justify-center gap-1">
          <input
            type="search"
            className="form-control relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
            placeholder={placeholder}
            aria-label={placeholder}
            aria-describedby="button-addon2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
