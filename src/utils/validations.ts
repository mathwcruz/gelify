import { endOfToday, isValid, isBefore, isSameDay } from 'date-fns'

export function validateCPF(strCPF: string) {
  let sum
  let rest
  sum = 0
  if (
    strCPF === '00000000000' ||
    strCPF === '11111111111' ||
    strCPF === '22222222222' ||
    strCPF === '33333333333' ||
    strCPF === '44444444444' ||
    strCPF === '55555555555' ||
    strCPF === '66666666666' ||
    strCPF === '77777777777' ||
    strCPF === '88888888888' ||
    strCPF === '99999999999'
  )
    return false

  for (let i = 1; i <= 9; i++)
    sum = sum + parseInt(strCPF.substring(i - 1, i)) * (11 - i)
  rest = (sum * 10) % 11

  if (rest === 10 || rest === 11) rest = 0
  if (rest != parseInt(strCPF.substring(9, 10))) return false

  sum = 0
  for (let i = 1; i <= 10; i++)
    sum = sum + parseInt(strCPF.substring(i - 1, i)) * (12 - i)
  rest = (sum * 10) % 11

  if (rest === 10 || rest === 11) rest = 0
  if (rest != parseInt(strCPF.substring(10, 11))) return false
  return true
}

export function validateDate(date: string = '') {
  if (!date.length) return false

  let currentDateFormatted
  const dateParts = date.split('/')

  if (dateParts?.length === 3) {
    if (+dateParts[2] < 1900) return false
    if (+dateParts[1] >= 13) return false
    if (+dateParts[0] >= 32) return false
  }

  // return a Date Object base on "DD/MM/YYYY" date format
  currentDateFormatted = new Date(
    +dateParts[2],
    +dateParts[1] - 1,
    +dateParts[0]
  )

  const endDate = endOfToday()

  return (
    isValid(currentDateFormatted) &&
    (isBefore(currentDateFormatted, endDate) ||
      isSameDay(currentDateFormatted, endDate))
  )
}
