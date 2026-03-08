import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelect: (id: string) => void;
  productCount: number;
  sortBy: string;
  onSortChange: (value: string) => void;
  selectedGender: string;
  onGenderChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
}

const CategoryFilter = ({
  categories, selectedCategory, onSelect, productCount,
  sortBy, onSortChange, selectedGender, onGenderChange, selectedStatus, onStatusChange
}: CategoryFilterProps) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <section className="py-3 md:py-4 bg-background sticky top-[85px] md:top-[105px] z-40 border-b border-border/50">
      <div className="container mx-auto px-4">
        {/* Categories row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 md:gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                size="sm"
                className={`rounded-none px-4 md:px-5 h-10 min-h-[44px] font-body text-xs uppercase tracking-[0.12em] md:tracking-[0.15em] transition-all duration-300 shrink-0 ${
                  selectedCategory === category.id
                    ? "bg-accent text-accent-foreground border border-primary/30"
                    : "bg-transparent text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
                }`}
                onClick={() => onSelect(category.id)}
              >
                <span className="mr-1.5 text-sm">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={`shrink-0 h-10 min-h-[44px] gap-1.5 text-xs uppercase tracking-[0.12em] ${showFilters ? "text-primary" : "text-muted-foreground"}`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </Button>
        </div>

        {/* Filters row */}
        {showFilters && (
          <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
            <Select value={selectedGender} onValueChange={onGenderChange}>
              <SelectTrigger className="h-9 w-[110px] text-xs shrink-0">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="men">Men</SelectItem>
                <SelectItem value="women">Women</SelectItem>
                <SelectItem value="kids">Kids</SelectItem>
                <SelectItem value="unisex">Unisex</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="h-9 w-[110px] text-xs shrink-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="new">New Arrivals</SelectItem>
                <SelectItem value="on_sale">On Sale</SelectItem>
                <SelectItem value="in_stock">In Stock</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="h-9 w-[130px] text-xs shrink-0">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_low">Price: Low→High</SelectItem>
                <SelectItem value="price_high">Price: High→Low</SelectItem>
                <SelectItem value="name_az">Name: A→Z</SelectItem>
              </SelectContent>
            </Select>

            <span className="text-xs text-muted-foreground shrink-0 ml-auto">{productCount} items</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryFilter;
