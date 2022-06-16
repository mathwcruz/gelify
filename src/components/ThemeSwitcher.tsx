import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { MoonIcon, SunIcon } from '@heroicons/react/outline'

interface ThemeSwitcherProps {
  className?: string
}

export const ThemeSwitcher = ({ className }: ThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme()

  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const isDark = () => theme === 'dark'

  return (
    <div className={className}>
      <button
        onClick={() => setTheme(isDark() ? 'light' : 'dark')}
        title={`Trocar tema para modo ${isDark() ? 'claro' : 'escuro'}`}
        className="flex items-center justify-center"
      >
        {isDark() ? (
          <SunIcon className="dark:text-white-100 h-5 w-5 text-black transition-opacity duration-150 ease-in-out hover:opacity-75 dark:text-white" />
        ) : (
          <MoonIcon className="dark:text-white-100 h-5 w-5 text-black transition-opacity duration-150 ease-in-out hover:opacity-75" />
        )}
      </button>
    </div>
  )
}
