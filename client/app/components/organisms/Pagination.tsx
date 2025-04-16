"use client";
import React from "react";
import useQueryParams from "@/app/hooks/network/useQueryParams";

interface PaginationComponentProps {
  totalPages: number;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  totalPages,
}) => {
  const { query, updateQuery } = useQueryParams();
  const currentPage = Number(query.page) || 1;

  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    updateQuery({ page: newPage });
  };

  return (
    <div className="flex justify-end items-end space-x-2 m-2 mr-4">
      <button
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-1 rounded border border-blue-100 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      <button
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationComponent;
