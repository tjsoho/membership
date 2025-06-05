"use client";

import React from "react";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";

interface UserData {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  lastPurchaseDate: string | null;
  totalPurchaseAmount: number;
  coursesCount: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/users");

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch users");
        }

        const data = await res.json();
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch users"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-coastal-light-grey p-8 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-coastal-light-grey p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-coastal-light-grey p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-coastal-dark-teal">
            User Management
          </h1>
          <div className="text-sm text-coastal-dark-grey">
            Total Users: {users.length}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-coastal-light-grey/50">
                  <th className="text-left py-3 px-4 text-coastal-dark-grey font-medium">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-coastal-dark-grey font-medium">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-coastal-dark-grey font-medium">
                    Sign Up Date
                  </th>
                  <th className="text-left py-3 px-4 text-coastal-dark-grey font-medium">
                    Last Purchase
                  </th>
                  <th className="text-right py-3 px-4 text-coastal-dark-grey font-medium">
                    Courses
                  </th>
                  <th className="text-right py-3 px-4 text-coastal-dark-grey font-medium">
                    Total Spent
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-coastal-sand/50 hover:bg-coastal-light-grey/10"
                  >
                    <td className="py-3 px-4">
                      {user.name || "No name provided"}
                    </td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4">
                      {user.lastPurchaseDate
                        ? new Date(user.lastPurchaseDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "No purchases"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {user.coursesCount}
                    </td>
                    <td className="py-3 px-4 text-right">
                      ${user.totalPurchaseAmount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
