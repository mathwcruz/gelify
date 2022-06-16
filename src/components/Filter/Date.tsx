import { Mask } from '../../utils/formatters'

interface InitialDateProps {
  initialDate: string
  setInitialDate: (date: string) => void
}

interface FinalDateProps {
  finalDate: string
  setFinalDate: (date: string) => void
}

export const InitialDate = ({
  initialDate,
  setInitialDate,
}: InitialDateProps) => {
  return (
    <div className="flex flex-col gap-[2px]">
      <label
        htmlFor="initialDate"
        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        Data inicial*
      </label>
      <input
        type="text"
        name="initialDate"
        id="initialDate"
        autoComplete="off"
        value={initialDate}
        onChange={(e) => {
          if (e.target.value?.length > 10) return

          setInitialDate(Mask.date(e.target.value))
        }}
        className=" mt-1 block rounded-md border-gray-300 shadow focus:border-green-400 focus:ring-green-400 dark:bg-zinc-900 dark:focus:border-gray-300 dark:focus:ring-gray-300 sm:text-sm"
      />
    </div>
  )
}

export const FinalDate = ({ finalDate, setFinalDate }: FinalDateProps) => {
  return (
    <div className="flex flex-col gap-[2px]">
      <label
        htmlFor="initialDate"
        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        Data final*
      </label>
      <input
        type="text"
        name="initialDate"
        id="initialDate"
        autoComplete="off"
        value={finalDate}
        onChange={(e) => {
          if (e.target.value?.length > 10) return

          setFinalDate(Mask.date(e.target.value))
        }}
        className=" mt-1 block rounded-md border-gray-300 shadow focus:border-green-400 focus:ring-green-400 dark:bg-zinc-900 dark:focus:border-gray-300 dark:focus:ring-gray-300 sm:text-sm"
      />
    </div>
  )
}
