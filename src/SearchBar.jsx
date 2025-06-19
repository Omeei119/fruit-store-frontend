import React, { useState } from "react";
import "./SearchBar.css"; // Import your own styles

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    onSearch(value); // Pass the query back to the parent
  };

  return (
    <div className="search-bar ">
      <input
        type="text"
        value={query}
        onChange={handleSearchChange}
        placeholder="Search for products"
      />
    </div>
  );
}

export default SearchBar;
