// Importing the dependencies
import React, { useState } from "react";

// define pprop type for the filtering
type ProductFilterProps = {
  onSearch: (query: string) => void;
  onSort: (sortOrder: "newest" | "oldest") => void;
};

// Define the ProductFilter component that take two functions as props to process searching and sorting
const ProductFilter: React.FC<ProductFilterProps> = ({ onSearch, onSort }) => {
  // define sort state
  const [sortOrder, setSortOrder] = useState<"oldest" | "newest">("oldest");

  // function to handle searching
  const handleSearch = (searchQuery: string) => {
    onSearch(searchQuery);
  };

  // function to handle sorting
  const handleSort = () => {
    const newSortOrder = sortOrder === "oldest" ? "newest" : "oldest";
    setSortOrder(newSortOrder);
    onSort(newSortOrder);
  };

  // return filter bar
  return (
    <div className="flex-1">
      <div className="flex justify-between items-center bg-gray-300 py-4 px-md-16 px-5  mb-4 rounded-xl my-2">
        {/* input to search */}
        <input
          type="text"
          placeholder="Search by name"
          className="p-2 w-72 border border-gray-300 rounded"
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />

        {/* select - option to sort (newest or oldest) */}
        <select
          className="p-2 border border-gray-300 rounded"
          onChange={handleSort}>
          <option value="asc">Sort (Newest)</option>
          <option value="desc">Sort (Oldest)</option>
        </select>
      </div>
    </div>
  );
};

export default ProductFilter;
