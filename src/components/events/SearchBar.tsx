import React, { useCallback } from "react";
import { debounce } from "lodash";

type Props = {
  onSearch: (query: string) => void;
};

const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const debounced = useCallback(debounce(onSearch, 500), []);

  return (
    <input
      type="text"
      placeholder="Search events..."
      onChange={(e) => debounced(e.target.value)}
      className="border px-4 py-2 rounded w-full sm:w-1/2"
    />
  );
};

export default SearchBar;
