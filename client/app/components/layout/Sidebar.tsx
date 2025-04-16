"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import useStorage from "@/app/hooks/state/useStorage";
import { useSignOutMutation } from "@/app/store/apis/AuthApi";
import { useAppDispatch } from "@/app/store/hooks";
import { clearUser } from "@/app/store/slices/AuthSlice";

import {
  LayoutDashboard,
  CreditCard,
  Users,
  LogOut,
  PanelsRightBottom,
  ShieldCheck,
  UserPlus,
  PhoneCall,
  CalendarCheck,
  HandCoins,
  PlusCircle,
  MapPinned,
  Users2,
  FileBarChart2,
  PhoneForwarded,
  BarChart3,
} from "lucide-react";
import DashboardSearchBar from "../molecules/DashboardSearchbar";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useStorage<boolean>("sidebarOpen", true, "local");
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [signout] = useSignOutMutation();

  const sections = useMemo(
    () => [
      {
        title: "Overview",
        links: [
          { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        ],
      },
      {
        title: "Donor Management",
        links: [
          { name: "Donors", href: "/donors", icon: Users },
          { name: "Add Donor", href: "/donors/new", icon: UserPlus },
          { name: "Calls", href: "/calls", icon: PhoneCall },
          { name: "Reservations", href: "/reservations", icon: CalendarCheck },
        ],
      },
      {
        title: "Donations",
        links: [
          { name: "Donations", href: "/donations", icon: HandCoins },
          { name: "Add Donation", href: "/donations/new", icon: PlusCircle },
          { name: "Payment History", href: "/payments", icon: CreditCard },
        ],
      },
      {
        title: "Location Management",
        links: [
          {
            name: "Governates",
            href: "/locations/governorates",
            icon: MapPinned,
          },
          { name: "Cities", href: "/locations/cities", icon: Map },
        ],
      },
      {
        title: "User Access",
        links: [
          { name: "Volunteers", href: "/volunteers", icon: Users2 },
          { name: "Admins", href: "/admins", icon: ShieldCheck },
        ],
      },
      {
        title: "Reports & Analytics",
        links: [
          { name: "Reports", href: "/reports", icon: FileBarChart2 },
          {
            name: "Call Analytics",
            href: "/analytics/calls",
            icon: PhoneForwarded,
          },
          {
            name: "Donation Stats",
            href: "/analytics/donations",
            icon: BarChart3,
          },
        ],
      },
    ],
    []
  );

  const prependDashboard = (href: string) =>
    href.startsWith("/dashboard") ? href : `/dashboard${href}`;

  const handleSignOut = async () => {
    try {
      await signout().unwrap();
      dispatch(clearUser());
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const SidebarLink = ({
    name,
    href,
    Icon,
  }: {
    name: string;
    href: string;
    Icon: React.ElementType;
  }) => {
    const fullHref = prependDashboard(href);
    const isActive = pathname === fullHref;

    return (
      <Link
        href={fullHref}
        className={`relative group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
          isActive
            ? "bg-indigo-100 text-indigo-600 font-medium shadow-sm"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <motion.div whileHover={{ scale: 1.1 }}>
          <Icon
            className={`h-5 w-5 transition ${
              isActive ? "text-indigo-600" : "group-hover:text-black"
            }`}
          />
        </motion.div>
        {isOpen && <span className="text-sm">{name}</span>}
      </Link>
    );
  };

  return (
    <motion.aside
      initial={{ width: 80 }}
      animate={{
        width: isOpen ? 260 : 80,
        transition: { duration: 0.3, ease: "easeInOut" },
      }}
      className="bg-white border-r border-gray-200 shadow-lg min-h-fit flex flex-col p-4 justify-between"
    >
      <div>
        <div className="flex items-center justify-between my-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 flex items-center justify-end rounded-lg transition"
          >
            <PanelsRightBottom size={24} className="text-gray-700" />
          </button>
          <DashboardSearchBar />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-2">
          {sections.map((section, idx) => (
            <div key={section.title} className="mb-2">
              {isOpen && (
                <h3 className="text-xs font-medium uppercase tracking-wider text-gray-400 ml-4 mb-2">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.links.map((link) => (
                  <SidebarLink
                    key={link.name}
                    name={link.name}
                    href={link.href}
                    Icon={link.icon}
                  />
                ))}
              </div>
              {idx < sections.length - 1 && (
                <hr className="my-3 border-t border-gray-200" />
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 transition-all duration-300 group"
        >
          <LogOut className="h-5 w-5 text-red-500 group-hover:text-red-600" />
          {isOpen && (
            <span className="text-sm font-medium text-red-600">Sign Out</span>
          )}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
