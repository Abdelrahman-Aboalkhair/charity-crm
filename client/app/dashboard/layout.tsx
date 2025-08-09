"use client";
import BreadCrumb from "@/app/components/feedback/BreadCrumb";
import Sidebar from "../components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <BreadCrumb />
        </header>

        <div className="px-4"></div>

        <main className="flex-1 p-2 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
