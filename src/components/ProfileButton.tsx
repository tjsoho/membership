"use client";

import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { RiMenu3Line } from "react-icons/ri";
import { motion } from "framer-motion";
import { ContactModal } from "./ContactModal";

export function ProfileButton() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      <Menu as="div" className="relative">
        <Menu.Button
          as={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full 
                   bg-gradient-to-r from-coastal-dark-teal to-coastal-light-teal
                   text-white font-medium shadow-lg hover:shadow-xl
                   transition-shadow duration-200"
        >
          <RiMenu3Line className="w-5 h-5" />
          <span>Menu</span>
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-150"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className="absolute right-0 mt-2 w-56 origin-top-right 
                     bg-white rounded-2xl shadow-xl 
                     border border-coastal-sand/20
                     focus:outline-none divide-y divide-coastal-sand/10"
          >
            <div className="p-2">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className={`${
                      active ? "bg-coastal-light-grey" : ""
                    } flex w-full items-center gap-2 px-4 py-3 rounded-xl text-sm
                      text-coastal-dark-grey hover:text-coastal-dark-teal
                      transition-colors duration-150`}
                  >
                    Contact
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/terms"
                    className={`${
                      active ? "bg-coastal-light-grey" : ""
                    } flex items-center gap-2 px-4 py-3 rounded-xl text-sm
                      text-coastal-dark-grey hover:text-coastal-dark-teal
                      transition-colors duration-150`}
                  >
                    Terms & Conditions
                  </Link>
                )}
              </Menu.Item>
            </div>

            {/* Logout Section */}
            <div className="p-2">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => {
                      signOut({ redirect: false });
                    }}
                    className={`${
                      active ? "bg-red-50" : ""
                    } flex w-full items-center gap-2 px-4 py-3 rounded-xl text-sm
                      text-red-600 hover:text-red-700 transition-colors duration-150`}
                  >
                    Log out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  );
}
