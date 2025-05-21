import { ChangeEvent } from "react";
import { Loader2 } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  isLoading = false,
}: SearchBarProps) {
  return (
    <div className="relative mb-6">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10 focus:ring-2 focus:ring-sky-500 focus:outline-none"
      />
      {isLoading && (
        <div className="absolute inset-y-0 right-3 flex items-center">
          <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
        </div>
      )}
    </div>
  );
}
