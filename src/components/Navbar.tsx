"use client";

import Link from "next/link";
import { ProfileButton } from "./ProfileButton";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { RiDashboardLine, RiAdminLine, RiBookLine } from "react-icons/ri";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-coastal-sand/20 shadow-sm"
    >
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-coastal-dark-teal hover:text-coastal-light-teal transition-colors"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-coastal-dark-teal to-coastal-light-teal flex items-center justify-center"
              >
                <RiDashboardLine className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-lg font-semibold bg-gradient-to-r from-coastal-dark-teal to-coastal-light-teal bg-clip-text text-transparent">
                Savvy Biz Hub
              </span>
            </Link>

            {/* Navigation Links - Only shown to admin */}
            {session?.user?.email === "tjcarroll1@me.com" && (
              <div className="hidden md:flex items-center gap-6">
                <motion.div whileHover={{ y: -2 }}>
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                             transition-colors relative group"
                  >
                    <RiAdminLine className="w-4 h-4" />
                    <span>Admin</span>
                    <motion.div
                      className="absolute inset-0 bg-coastal-light-grey/10 rounded-full -z-10"
                      initial={false}
                      animate={
                        pathname.startsWith("/admin")
                          ? { opacity: 1 }
                          : { opacity: 0 }
                      }
                    />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ y: -2 }}>
                  <Link
                    href="/admin/courses"
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                             transition-colors relative group"
                  >
                    <RiBookLine className="w-4 h-4" />
                    <span>Courses</span>
                    <motion.div
                      className="absolute inset-0 bg-coastal-light-grey/10 rounded-full -z-10"
                      initial={false}
                      animate={
                        pathname.startsWith("/courses")
                          ? { opacity: 1 }
                          : { opacity: 0 }
                      }
                    />
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Right side - Profile */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center"
          >
            <ProfileButton />
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
