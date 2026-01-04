"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Header } from "@/components/layout/header";

/**
 * Dashboard Layout
 * 
 * This layout is used for all routes under /dashboard/*
 * It includes:
 * - RoleSwitcher component (via DashboardSidebar)
 * - Role-based sidebar items
 * - Settings section
 * - Logout button
 * 
 * This is separate from the public layout which uses the regular Sidebar component.
 * RoleProvider is available globally from root layout.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:ps-72">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main>{children}</main>
      </div>
    </div>
  );
}

