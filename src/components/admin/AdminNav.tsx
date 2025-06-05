"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const routes = {
  "/admin": "Admin",
  "/admin/courses": "Courses",
  "/admin/users": "Users",
  "/admin/reports": "Reports",
  "/admin/settings": "Settings",
};

export function AdminNav() {
  const pathname = usePathname();
  const pathSegments = pathname?.split("/").filter(Boolean) || [];

  return (
    <div className="bg-white border-b border-coastal-sand">
      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="text-coastal-dark-teal hover:text-coastal-teal transition-colors"
            >
              <HomeIcon className="h-6 w-6" />
            </Link>
            <nav className="ml-8 flex space-x-8">
              {Object.entries(routes).map(([path, label]) => (
                <Link
                  key={path}
                  href={path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === path
                      ? "bg-coastal-dark-teal text-white"
                      : "text-coastal-dark-grey hover:text-coastal-dark-teal hover:bg-coastal-light-grey/50"
                  } transition-colors`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center text-sm text-coastal-dark-grey">
          <Link
            href="/admin/dashboard"
            className="hover:text-coastal-dark-teal transition-colors"
          >
            Admin
          </Link>
          {pathSegments.slice(1).map((segment, index) => (
            <div key={segment} className="flex items-center">
              <ChevronRightIcon className="h-4 w-4 mx-2 text-coastal-sand" />
              <Link
                href={`/admin/${pathSegments.slice(1, index + 2).join("/")}`}
                className={`capitalize ${
                  index === pathSegments.length - 2
                    ? "text-coastal-dark-teal font-medium"
                    : "hover:text-coastal-dark-teal transition-colors"
                }`}
              >
                {segment}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
