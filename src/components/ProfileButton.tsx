'use client'

import { signOut, useSession } from 'next-auth/react'
import { Menu, Transition } from '@headlessui/react'
import { UserCircle } from 'lucide-react'
import { Fragment } from 'react'

export function ProfileButton() {
  const { data: session } = useSession()

  if (!session?.user) return null

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50">
        <UserCircle className="w-5 h-5" />
        <span className="ml-2">{session.user.name}</span>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => signOut()}
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                >
                  Log out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
} 