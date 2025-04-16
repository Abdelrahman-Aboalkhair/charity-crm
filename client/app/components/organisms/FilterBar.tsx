"use client";
import { useGetAllCategoriesQuery } from "@/app/store/apis/CategoryApi";
import CheckBox from "../atoms/CheckBox";
import RadioButton from "../atoms/RadioButton";
import { Filter, SortAsc, RefreshCcw } from "lucide-react"; // Added RefreshCcw for the clear buttons
import { useForm } from "react-hook-form";
import { useFilterHandlers } from "@/app/hooks/useFilterHandlers";

const FilterBar: React.FC = () => {
  const { control } = useForm();
  const { data } = useGetAllCategoriesQuery({});

  const sortOptions = [
    { label: "Price: Low to High", value: "price:asc", id: 1, type: "price" },
    { label: "Price: High to Low", value: "price:desc", id: 2, type: "price" },
    {
      label: "Newest Arrivals",
      value: "createdAt:desc",
      id: 3,
      type: "createdAt",
    },
    {
      label: "Oldest Products",
      value: "createdAt:asc",
      id: 4,
      type: "createdAt",
    },
  ];

  const {
    query,
    handleFilterChange,
    handleSortChange,
    resetFilters,
    resetSorting,
  } = useFilterHandlers(data?.categories || [], sortOptions);

  // Reset Filters
  const handleClearFilters = () => {
    resetFilters();
  };

  // Reset Sorting
  const handleClearSorting = () => {
    resetSorting();
  };

  return (
    <aside className="w-[16%] min-h-screen p-6 border-r border-gray-200">
      <div className="space-y-6">
        {/* Filters */}
        <div className="border-gray-200">
          <h3 className="text-md font-semibold text-gray-700 mb-6 flex justify-start items-center gap-1">
            <Filter size={19} /> Filters
          </h3>
          <CheckBox
            className="pb-[20px]"
            control={control}
            name="BestSelling"
            label="Best selling"
            onChangeExtra={handleFilterChange}
          />
          <CheckBox
            className="pb-[20px]"
            control={control}
            name="featured"
            label="Featured"
            onChangeExtra={handleFilterChange}
          />
          {data?.categories.map((category, index) => (
            <div
              key={category.id}
              className={
                index === data.categories.length - 1 ? "" : "pb-[20px]"
              }
            >
              <CheckBox
                control={control}
                name={category.slug}
                label={category.name}
                onChangeExtra={handleFilterChange}
              />
            </div>
          ))}
        </div>

        {/* Clear Filters Button */}
        <div className="flex justify-between items-center mt-4">
          <button
            className="text-red-500 flex items-center gap-2"
            onClick={handleClearFilters}
          >
            <RefreshCcw size={16} /> Clear Filters
          </button>
        </div>

        {/* Divider */}
        <div className="border border-gray-200 w-[16.4rem]" />

        {/* Sorting */}
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-6 flex items-center justify-start gap-1">
            <SortAsc size={22} /> Sorting
          </h3>
          {sortOptions.map((opt, index) => (
            <div
              key={opt.id}
              className={index === sortOptions.length - 1 ? "" : "pb-[20px]"}
            >
              <RadioButton
                control={control}
                name="sort"
                value={opt.value}
                currentValue={
                  query[opt.type === "price" ? "priceSort" : "createdAtSort"]
                }
                label={opt.label}
                onChangeExtra={() => handleSortChange(opt.value, opt.type)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            className="text-red-500 flex items-center gap-2"
            onClick={handleClearSorting}
          >
            <RefreshCcw size={16} /> Clear Sorting
          </button>
        </div>
      </div>
    </aside>
  );
};

export default FilterBar;
