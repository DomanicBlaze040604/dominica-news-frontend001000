import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  return (
    <div className="max-w-2xl mx-auto my-8 px-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search articles..."
          className="pl-10 h-12 text-base"
        />
      </div>
    </div>
  );
};

export default SearchBar;
