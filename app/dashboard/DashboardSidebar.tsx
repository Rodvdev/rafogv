"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardSidebarProps {
  session: {
    user: {
      email: string;
      role: string;
    };
  } | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function DashboardSidebar({
  session,
  isOpen = false,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";

  const navItems = [
    {
      name: "Talleres",
      href: "/dashboard",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      name: "Usuarios",
      href: "/dashboard/users",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      requiresSuperAdmin: true,
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex relative h-screen w-64 flex-col bg-white shadow-xl">
        <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
            <span className="text-xl font-bold text-white">T</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Talleres Lima</h1>
            <p className="text-xs text-gray-500">Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              if (item.requiresSuperAdmin && !isSuperAdmin) {
                return null;
              }
              const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/dashboard");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-gray-200 bg-white p-4">
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-medium text-gray-700">{session?.user?.email}</p>
              <p className="text-xs text-gray-500">{session?.user?.role}</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (onClose) onClose();
              signOut({ callbackUrl: "/signin" });
            }}
            className="flex w-full items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-all hover:bg-red-100"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
              <span className="text-xl font-bold text-white">T</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Talleres Lima</h1>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100"
          >
            <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              if (item.requiresSuperAdmin && !isSuperAdmin) {
                return null;
              }
              const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/dashboard");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-gray-200 bg-white p-4">
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-medium text-gray-700">{session?.user?.email}</p>
              <p className="text-xs text-gray-500">{session?.user?.role}</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (onClose) onClose();
              signOut({ callbackUrl: "/signin" });
            }}
            className="flex w-full items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-all hover:bg-red-100"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}
