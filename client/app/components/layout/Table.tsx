import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import useQueryParams from "@/app/hooks/network/useQueryParams";
import { Loader2, ArrowUpDown, FileText, RefreshCw } from "lucide-react";
import SearchBar from "../molecules/SearchBar";
import PaginationComponent from "../organisms/Pagination";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: any) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

interface TableProps {
  data: any[];
  columns: Column[];
  isLoading?: boolean;
  emptyMessage?: string;
  title?: string;
  subtitle?: string;
  onRefresh?: () => void;
  showHeader?: boolean;
  showPaginationDetails?: boolean;
  showSearchBar?: boolean;
  totalPages?: number;
  totalResults?: number;
  resultsPerPage?: number;
  currentPage?: number;
  expandable?: boolean; // New prop to enable expandable rows
  expandedRowId?: string | null; // ID of the currently expanded row
  renderExpandedRow?: (row: any) => React.ReactNode; // Function to render expanded content
  className?: string; // Allow custom Tailwind classes
}

const Table: React.FC<TableProps> = ({
  data,
  columns,
  isLoading = false,
  emptyMessage = "No data available",
  title,
  subtitle,
  onRefresh,
  showHeader = true,
  showSearchBar = true,
  showPaginationDetails = true,
  totalPages,
  totalResults,
  resultsPerPage,
  currentPage,
  expandable = false,
  expandedRowId = null,
  renderExpandedRow,
  className = "",
}) => {
  const { query, updateQuery } = useQueryParams();
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Parse the sort parameter from the query (e.g., "price:asc")
  useEffect(() => {
    if (query.sort) {
      const [field, direction] = (query.sort as string).split(":");
      setSortKey(field || null);
      setSortDirection((direction as "asc" | "desc") || "asc");
    } else {
      setSortKey(null);
      setSortDirection("asc");
    }
  }, [query.sort]);

  // Handle sorting and update URL with combined sort parameter
  const handleSort = (key: string) => {
    const newSortDirection =
      sortKey === key && sortDirection === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortDirection(newSortDirection);
    const sortValue = `${key}:${newSortDirection}`;
    updateQuery({ sort: sortValue });
  };

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      updateQuery({ searchQuery: searchQuery || "" });
    }, 300),
    [updateQuery]
  );

  const handleSearch = (data: { searchQuery: string }) => {
    debouncedSearch(data.searchQuery);
  };

  if (!Array.isArray(data)) {
    return (
      <div className="text-center py-12 text-gray-600">{emptyMessage}</div>
    );
  }

  return (
    <div
      className={`w-full bg-white rounded-xl shadow-sm border border-blue-50 overflow-hidden ${className}`}
    >
      {showHeader && (
        <div className="p-4 sm:p-6 border-b border-blue-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {(title || subtitle) && (
            <div>
              {title && (
                <h2 className="font-semibold text-lg text-gray-800">{title}</h2>
              )}
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          )}

          <p className="text-[15px] text-gray-700 pt-[15px] pb-[6px]">
            Showing {totalResults !== undefined ? totalResults : 0} results
            {currentPage ? ` (Page ${currentPage})` : ""}
            {totalResults !== undefined && totalResults > 0 && resultsPerPage
              ? `, showing ${resultsPerPage} items per page`
              : ""}
          </p>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {showSearchBar && <SearchBar onSearch={handleSearch} />}
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              >
                <RefreshCw size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table Content */}
      <div className="w-full overflow-x-auto scrollbar-hide">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-${
                    column.align || "left"
                  } text-blue-700 font-medium text-sm ${
                    column.width ? `w-${column.width}` : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && (
                      <button
                        onClick={() => handleSort(column.key)}
                        className={`p-1 rounded hover:bg-blue-100 ${
                          sortKey === column.key
                            ? "text-blue-600"
                            : "text-blue-300"
                        }`}
                      >
                        <ArrowUpDown
                          size={14}
                          className={
                            sortKey === column.key
                              ? "transform transition-transform"
                              : ""
                          }
                        />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-16">
                  <div className="flex flex-col items-center justify-center text-blue-400">
                    <Loader2 size={30} className="animate-spin mb-2" />
                    <span>Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((row, rowIndex) => (
                <React.Fragment key={row.id || row._id || rowIndex}>
                  <tr className="hover:bg-blue-50/50 transition-colors text-sm">
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-6 py-4 text-${column.align || "left"} ${
                          rowIndex % 2 === 0 ? "bg-white" : "bg-blue-50/30"
                        }`}
                      >
                        {column.render ? column.render(row) : row[column.key]}
                      </td>
                    ))}
                  </tr>
                  {/* Expanded Row */}
                  {expandable &&
                    expandedRowId === (row.id || row._id) &&
                    renderExpandedRow && (
                      <tr>
                        <td colSpan={columns.length} className="p-0">
                          {renderExpandedRow(row)}
                        </td>
                      </tr>
                    )}
                </React.Fragment>
              ))
            ) : (
              <>
                <tr>
                  <td colSpan={columns.length} className="text-center py-16">
                    <div className="flex flex-col items-center text-blue-300">
                      <FileText size={32} className="mb-2 opacity-50" />
                      <p>{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      {showPaginationDetails && totalPages !== undefined && (
        <div className="p-4 border-t border-blue-100">
          <PaginationComponent totalPages={totalPages} />
        </div>
      )}
    </div>
  );
};

export default Table;
