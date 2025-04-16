"use client";
import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGetAllSectionsQuery } from "@/app/store/apis/SectionApi";
import { useGetAllOrdersQuery } from "@/app/store/apis/OrderApi";
import { useGetAllPaymentsQuery } from "@/app/store/apis/PaymentApi";
import { useGetAllPagesQuery } from "@/app/store/apis/PageApi";
import { useGetAllBannersQuery } from "@/app/store/apis/BannerApi";
import { useGetAllWidgetsQuery } from "@/app/store/apis/WidgetApi";
import { useGetAllThemesQuery } from "@/app/store/apis/ThemeApi";
import { useGetAllProductsQuery } from "@/app/store/apis/ProductApi";
import { useGetAllCategoriesQuery } from "@/app/store/apis/CategoryApi";
import {
  useGetAllAdminsQuery,
  useGetAllUsersQuery,
} from "@/app/store/apis/UserApi";

interface SearchResult {
  type:
    | "section"
    | "order"
    | "payment"
    | "page"
    | "banner"
    | "widget"
    | "theme"
    | "product"
    | "category"
    | "user"
    | "admin";
  id: string | number;
  title: string;
  description?: string;
  action: () => void;
}

interface DashboardSearchBarProps {
  placeholder?: string;
  className?: string;
}

const DashboardSearchBar: React.FC<DashboardSearchBarProps> = ({
  placeholder = "Search dashboard (Ctrl + K)",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  // RTK Queries for all entities
  const { data: sectionsData } = useGetAllSectionsQuery({});
  const { data: ordersData } = useGetAllOrdersQuery({});
  const { data: paymentsData } = useGetAllPaymentsQuery({});
  const { data: pagesData } = useGetAllPagesQuery({});
  const { data: bannersData } = useGetAllBannersQuery({});
  const { data: widgetsData } = useGetAllWidgetsQuery({});
  const { data: themesData } = useGetAllThemesQuery({});
  const { data: productsData } = useGetAllProductsQuery({});
  const { data: categoriesData } = useGetAllCategoriesQuery({});
  const { data: usersData } = useGetAllUsersQuery({});
  const { data: adminsData } = useGetAllAdminsQuery({});

  // Normalize data into search results
  const searchResults: SearchResult[] = [
    ...(sectionsData?.sections || []).map((s) => ({
      type: "section" as const,
      id: s.id,
      title: s.title,
      description: `Type: ${s.type}`,
      action: () => router.push(`/dashboard/sections/${s.id}`),
    })),
    ...(ordersData?.orders || []).map((o) => ({
      type: "order" as const,
      id: o.id,
      title: `Order #${o.id}`,
      description: o.status,
      action: () => router.push(`/orders/${o.id}`),
    })),
    ...(paymentsData?.payments || []).map((p) => ({
      type: "payment" as const,
      id: p.id,
      title: `Payment #${p.id}`,
      description: `$${p.amount} - ${p.status}`,
      action: () => router.push(`/dashboard/payments/${p.id}`),
    })),
    ...(pagesData?.pages || []).map((p) => ({
      type: "page" as const,
      id: p.id,
      title: p.title,
      description: p.slug,
      action: () => router.push(`/dashboard/pages/${p.id}`),
    })),
    ...(bannersData?.banners || []).map((b) => ({
      type: "banner" as const,
      id: b.id,
      title: b.title,
      description: b.type,
      action: () => router.push(`/dashboard/banners/${b.id}`),
    })),
    ...(widgetsData?.widgets || []).map((w) => ({
      type: "widget" as const,
      id: w.id,
      title: w.title,
      description: w.type,
      action: () => router.push(`/dashboard/widgets/${w.id}`),
    })),
    ...(themesData?.themes || []).map((t) => ({
      type: "theme" as const,
      id: t.id,
      title: t.name,
      description: t.status,
      action: () => router.push(`/dashboard/themes/${t.id}`),
    })),
    ...(productsData?.products || []).map((p) => ({
      type: "product" as const,
      id: p.id,
      title: p.name,
      description: `$${p.price}`,
      action: () => router.push(`/dashboard/products/${p.id}`),
    })),
    ...(categoriesData?.categories || []).map((c) => ({
      type: "category" as const,
      id: c.id,
      title: c.name,
      description: c.description,
      action: () => router.push(`/dashboard/categories/${c.id}`),
    })),
    ...(usersData?.users || []).map((u) => ({
      type: "user" as const,
      id: u.id,
      title: u.name,
      description: u.email,
      action: () => router.push(`/dashboard/users/${u.id}`),
    })),
    ...(adminsData?.admins || []).map((a) => ({
      type: "admin" as const,
      id: a.id,
      title: a.name,
      description: a.role,
      action: () => router.push(`/dashboard/admins/${a.id}`),
    })),
  ].filter((result) =>
    `${result.title} ${result.description || ""}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  // Ctrl + K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        if (!isOpen) setQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Handler to navigate and close modal
  const handleResultClick = (action: () => void) => {
    action(); // Perform navigation
    setIsOpen(false); // Close modal
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${className}`}
        aria-label="Open dashboard search (Ctrl + K)"
        title="Search (Ctrl + K)"
      >
        <Search size={24} />
      </button>

      {/* MODAL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-4 border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative flex items-center">
                <Search className="absolute left-3 text-gray-500" size={20} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholder}
                  className="w-full py-3 pl-10 pr-12 border-b border-gray-200 focus:outline-none focus:border-teal-500 text-gray-800 text-sm"
                  autoFocus
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute right-3 text-gray-500 hover:text-gray-700"
                  aria-label="Close search"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-2 max-h-96 overflow-y-auto">
                {query && searchResults.length === 0 ? (
                  <p className="p-3 text-gray-500 text-sm">No results found.</p>
                ) : (
                  searchResults.map((result) => (
                    <motion.div
                      key={`${result.type}-${result.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors flex items-center justify-between"
                      onClick={() => handleResultClick(result.action)}
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {result.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {result.description}
                        </p>
                      </div>
                      <span className="text-xs text-teal-600 font-medium">
                        {result.type.charAt(0).toUpperCase() +
                          result.type.slice(1)}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="mt-2 text-xs text-gray-500 text-center">
                Press Ctrl + K to close
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardSearchBar;
