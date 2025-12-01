"use client";

import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  session: {
    user: {
      email: string;
      role: string;
    };
  } | null;
}

export default function DashboardLayoutClient({
  children,
  session,
}: DashboardLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <DashboardSidebar
        session={session}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white shadow-lg border-b border-gray-200 sticky top-0 z-30">
          <div className="flex h-16 items-center justify-between px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
                <span className="text-xl font-bold text-white">T</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Talleres Lima</h1>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            </div>
            <div className="w-10" /> {/* Spacer para centrar */}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

