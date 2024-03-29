import Link from 'next/link'
import { Fragment, useState, useEffect } from 'react'
import { FaPowerOff } from 'react-icons/fa'
import { Popover, Transition } from '@headlessui/react'
import { MenuIcon, XIcon, UserCircleIcon } from '@heroicons/react/outline'
import { ChevronDownIcon } from '@heroicons/react/solid'

import { useUser } from '../contexts/UserContext'
import { solutions } from '../utils/solutions'
import { ThemeSwitcher } from './ThemeSwitcher'

export const Header = () => {
  const { handleLogoutUser, loggedUser } = useUser()

  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <Popover className="relative bg-white dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start gap-4 md:gap-10 lg:w-0 lg:flex-1">
            <a href="/">
              <span className="sr-only">Gelify</span>
              <img
                src="/favicon.png"
                className="h-8 sm:h-10"
                alt="Gelify"
                title="Gelify"
              />
            </a>
            <section className="flex flex-row items-center justify-center gap-[7px]">
              <UserCircleIcon className="h-6 w-6 text-green-600" />
              <div className="flex flex-col justify-center">
                <h4 className="w-full max-w-[350px] text-left text-sm font-semibold text-black dark:text-white">
                  {loggedUser?.name}
                </h4>
                <p className="w-full max-w-[350px] text-left text-xs font-medium text-gray-500 dark:text-gray-200">
                  {loggedUser?.email}
                </p>
              </div>
            </section>
          </div>
          <div className="-my-2 -mr-2 md:hidden">
            <Popover.Button className="focus:ring-text-green-400 inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset  dark:text-gray-200">
              <span className="sr-only">Abrir menu</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
          </div>
          <Popover.Group as="nav" className="hidden space-x-10 md:flex">
            <Popover className="relative">
              {({ open }: { open: boolean }) => (
                <>
                  <Popover.Button
                    className={classNames(
                      open
                        ? 'text-gray-900 dark:text-gray-200'
                        : 'text-gray-500 dark:text-gray-300',
                      'focus:ring-text-green-400 group inline-flex items-center rounded-md bg-white p-1 text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:bg-zinc-900 dark:hover:text-gray-200 '
                    )}
                  >
                    <span>Cadastros</span>
                    <ChevronDownIcon
                      className={classNames(
                        open
                          ? 'text-gray-600 dark:text-gray-200'
                          : 'text-gray-400 dark:text-gray-200',
                        'ml-2 h-5 w-5 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                      )}
                      aria-hidden="true"
                    />
                  </Popover.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute z-10 -ml-4 mt-3 w-screen max-w-md transform px-2 sm:px-0 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2">
                      <div className="overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5">
                        <div className="relative grid grid-cols-2 gap-8 bg-white px-5 py-6 dark:bg-zinc-800  sm:gap-8 sm:p-8">
                          {solutions?.REGISTER?.map((item) => (
                            <Link key={item?.name} href={item.href}>
                              <a
                                key={item.name}
                                className="-m-3 flex items-center rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-zinc-700"
                              >
                                <item.icon
                                  className="h-6 w-6 flex-shrink-0 text-green-500"
                                  aria-hidden="true"
                                />
                                <div className="ml-4">
                                  <p className="text-base font-medium text-gray-900 dark:text-gray-300">
                                    {item.name}
                                  </p>
                                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {item.description}
                                  </p>
                                </div>
                              </a>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
            <Popover className="relative">
              {({ open }: { open: boolean }) => (
                <>
                  <Popover.Button
                    className={classNames(
                      open
                        ? 'text-gray-900 dark:text-gray-200'
                        : 'text-gray-500 dark:text-gray-300',
                      'focus:ring-text-green-400 group inline-flex items-center rounded-md bg-white p-1 text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:bg-zinc-900 dark:hover:text-gray-200'
                    )}
                  >
                    <span>Listagem</span>
                    <ChevronDownIcon
                      className={classNames(
                        open
                          ? 'text-gray-600 dark:text-gray-200'
                          : 'text-gray-400 dark:text-gray-200',
                        'ml-2 h-5 w-5 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                      )}
                      aria-hidden="true"
                    />
                  </Popover.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute z-10 -ml-4 mt-3 w-screen max-w-md transform px-2 sm:px-0 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2">
                      <div className=" overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5">
                        <div className="relative grid grid-cols-2 gap-8 bg-white px-5 py-6 dark:bg-zinc-800  sm:gap-8 sm:p-8">
                          {solutions?.LIST?.map((item) => (
                            <Link key={item?.name} href={item.href}>
                              <a
                                key={item.name}
                                className="-m-3 flex items-center rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-zinc-700"
                              >
                                <item.icon
                                  className="h-6 w-6 flex-shrink-0 text-green-500"
                                  aria-hidden="true"
                                />
                                <div className="ml-4">
                                  <p className="text-base font-medium text-gray-900 dark:text-gray-300">
                                    {item.name}
                                  </p>
                                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {item.description}
                                  </p>
                                </div>
                              </a>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          </Popover.Group>
          <section className="flex flex-row items-center justify-center gap-3">
            <ThemeSwitcher />
            <button
              onClick={handleLogoutUser}
              title="Encerrar sessão"
              className="flex items-center justify-center transition-opacity duration-150 ease-in-out hover:opacity-75"
            >
              <FaPowerOff size={16} color="red" />
            </button>
          </section>
        </div>
      </div>

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="absolute inset-x-0 top-0 origin-top-right transform p-2 transition md:hidden"
        >
          <div className=" divide-y-2 divide-gray-50 rounded-lg bg-white shadow ring-1 ring-black ring-opacity-5 dark:divide-gray-500 dark:bg-zinc-900">
            <div className="px-5 pt-5 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <img
                    src="/favicon.png"
                    className="h-8 w-auto"
                    alt="Gelify"
                    title="Gelify"
                  />
                </div>
                <div className="-mr-2">
                  <Popover.Button className="focus:ring-text-green-400 inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset  dark:text-gray-200">
                    <span className="sr-only">Fechar menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  {solutions?.LIST?.map((item) => (
                    <Link key={item?.name} href={item.href}>
                      <a
                        key={item.name}
                        className="-m-3 flex items-center rounded-lg p-3 hover:bg-gray-50"
                      >
                        <item.icon
                          className="h-6 w-6 flex-shrink-0 text-green-500"
                          aria-hidden="true"
                        />
                        <div className="ml-4">
                          <p className="text-base font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.description}
                          </p>
                        </div>
                      </a>
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  {solutions?.REGISTER?.map((item) => (
                    <Link key={item?.name} href={item.href}>
                      <a
                        key={item.name}
                        className="-m-3 flex items-center rounded-lg p-3 hover:bg-gray-50"
                      >
                        <item.icon
                          className="h-6 w-6 flex-shrink-0 text-green-500"
                          aria-hidden="true"
                        />
                        <div className="ml-4">
                          <p className="text-base font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.description}
                          </p>
                        </div>
                      </a>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
