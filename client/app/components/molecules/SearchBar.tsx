import React, { useState, useRef, useEffect } from "react";
import { Search, X, Clock, Sparkles, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import useStorage from "@/app/hooks/state/useStorage";
import { motion, AnimatePresence } from "framer-motion";

type SearchFormValues = {
  searchQuery: string;
};

interface SearchBarProps {
  onSearch: (data: SearchFormValues) => void;
  placeholder?: string;
  suggestedCategories?: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search for products, brands, and more...",
  suggestedCategories = [
    "New Arrivals",
    "Best Sellers",
    "Sale Items",
    "Gift Ideas",
  ],
}) => {
  const { register, handleSubmit, setValue, watch } = useForm<SearchFormValues>(
    {
      defaultValues: {
        searchQuery: "",
      },
    }
  );

  const [recentQueries, setRecentQueries] = useStorage<string[]>(
    "recentQueries",
    []
  );
  const [isFocused, setIsFocused] = useState(false);
  const [isHoveringDropdown, setIsHoveringDropdown] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchQuery = watch("searchQuery");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Handle clicks outside search component
    const handleClickOutside = (event: MouseEvent) => {
      if (
        formRef.current &&
        !formRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (data: SearchFormValues) => {
    const query = data.searchQuery.trim();
    if (query && !recentQueries.includes(query)) {
      const updatedQueries = [query, ...recentQueries.slice(0, 4)];
      setRecentQueries(updatedQueries);
    }
    setIsFocused(false);
    onSearch(data);
  };

  const handleSelectRecentQuery = (query: string) => {
    setValue("searchQuery", query);
    setTimeout(() => {
      handleSubmit(handleSearch)();
    }, 100);
  };

  const clearSearch = () => {
    setValue("searchQuery", "");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const removeRecentQuery = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newQueries = [...recentQueries];
    newQueries.splice(index, 1);
    setRecentQueries(newQueries);
  };

  const showSearchResults = isFocused || isHoveringDropdown;

  return (
    <div className="relative w-full max-w-2xl">
      <form
        ref={formRef}
        onSubmit={handleSubmit(handleSearch)}
        className="relative"
      >
        <div className="flex items-center">
          <div className="relative flex items-center w-full">
            <span className="absolute left-4 text-indigo-600 transition-all duration-300">
              <Search
                className={`transition-all duration-300 ${
                  isFocused ? "text-indigo-600" : "text-gray-400"
                }`}
                size={20}
              />
            </span>

            <input
              type="text"
              placeholder={placeholder}
              className="w-full py-3 pl-12 pr-12 bg-white/95 rounded-full text-gray-800 placeholder-gray-400
               shadow-lg shadow-indigo-100/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm transition-all duration-300 hover:shadow-xl"
              {...register("searchQuery")}
              onFocus={() => setIsFocused(true)}
              ref={(e) => {
                inputRef.current = e;
                const { ref } = register("searchQuery");
                if (typeof ref === "function") {
                  ref(e);
                }
              }}
              autoComplete="off"
            />

            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-14 p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-all duration-200"
                >
                  <X size={16} />
                </motion.button>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="absolute right-3 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-indigo-500/50"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {showSearchResults && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute w-full mt-2 bg-white rounded-2xl shadow-xl z-[1000] border border-gray-100 overflow-hidden"
            onMouseEnter={() => setIsHoveringDropdown(true)}
            onMouseLeave={() => setIsHoveringDropdown(false)}
          >
            {recentQueries.length > 0 && (
              <>
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Clock size={14} className="mr-2" />
                    <span>Recent Searches</span>
                  </div>
                  <ul>
                    {recentQueries.map((query, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center p-2 cursor-pointer hover:bg-gray-50 rounded-lg text-gray-700 group transition-all duration-200"
                        onClick={() => handleSelectRecentQuery(query)}
                      >
                        <div className="flex items-center">
                          <Search size={14} className="mr-3 text-gray-400" />
                          <span>{query}</span>
                        </div>
                        <button
                          onClick={(e) => removeRecentQuery(index, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-full transition-opacity duration-200"
                        >
                          <X size={14} className="text-gray-500" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            <div className="p-3">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Sparkles size={14} className="mr-2 text-indigo-500" />
                <span>Popular Categories</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedCategories.map((category, index) => (
                  <button
                    key={index}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 rounded-full text-sm transition-colors duration-200"
                    onClick={() => handleSelectRecentQuery(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
