import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal, X } from "lucide-react";
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
  selectedShoeType: string;
  onShoeTypeChange: (value: string) => void;
}

const genderOptions = [
  { value: "all", label: "All" },
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "kids", label: "Kids" },
  { value: "unisex", label: "Unisex" },
];

const statusOptions = [
  { value: "all", label: "All" },
  { value: "new", label: "New Arrivals" },
  { value: "on_sale", label: "On Sale" },
  { value: "in_stock", label: "In Stock" },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price_low", label: "Price: Low → High" },
  { value: "price_high", label: "Price: High → Low" },
  { value: "name_az", label: "Name: A → Z" },
];

const CategoryFilter = ({
  categories, selectedCategory, onSelect, productCount,
  sortBy, onSortChange, selectedGender, onGenderChange, selectedStatus, onStatusChange
}: CategoryFilterProps) => {
  const [open, setOpen] = useState(false);

  const activeFilterCount = [
    selectedGender !== "all" ? 1 : 0,
    selectedStatus !== "all" ? 1 : 0,
    sortBy !== "newest" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const clearAll = () => {
    onGenderChange("all");
    onStatusChange("all");
    onSortChange("newest");
  };

  return (
    <section className="py-3 md:py-4 bg-background sticky top-[85px] md:top-[105px] z-40 border-b border-border/50">
      <div className="container mx-auto px-4">
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

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 h-10 min-h-[44px] gap-1.5 text-xs uppercase tracking-[0.12em] text-muted-foreground relative"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[360px] overflow-y-auto">
              <SheetHeader className="mb-6">
                <div className="flex items-center justify-between">
                  <SheetTitle className="font-display text-lg">Filters & Sort</SheetTitle>
                  {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs text-muted-foreground h-8">
                      Clear all
                    </Button>
                  )}
                </div>
              </SheetHeader>

              <div className="space-y-6">
                {/* Category */}
                <div>
                  <h4 className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-body font-semibold mb-3">Category</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <Button
                        key={cat.id}
                        variant="outline"
                        size="sm"
                        className={`h-9 text-xs font-body ${
                          selectedCategory === cat.id
                            ? "bg-primary text-primary-foreground border-primary"
                            : "text-muted-foreground"
                        }`}
                        onClick={() => { onSelect(cat.id); }}
                      >
                        <span className="mr-1">{cat.icon}</span>{cat.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <h4 className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-body font-semibold mb-3">Gender</h4>
                  <div className="flex flex-wrap gap-2">
                    {genderOptions.map((opt) => (
                      <Button
                        key={opt.value}
                        variant="outline"
                        size="sm"
                        className={`h-9 text-xs font-body ${
                          selectedGender === opt.value
                            ? "bg-primary text-primary-foreground border-primary"
                            : "text-muted-foreground"
                        }`}
                        onClick={() => onGenderChange(opt.value)}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <h4 className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-body font-semibold mb-3">Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((opt) => (
                      <Button
                        key={opt.value}
                        variant="outline"
                        size="sm"
                        className={`h-9 text-xs font-body ${
                          selectedStatus === opt.value
                            ? "bg-primary text-primary-foreground border-primary"
                            : "text-muted-foreground"
                        }`}
                        onClick={() => onStatusChange(opt.value)}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <h4 className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-body font-semibold mb-3">Sort By</h4>
                  <div className="flex flex-wrap gap-2">
                    {sortOptions.map((opt) => (
                      <Button
                        key={opt.value}
                        variant="outline"
                        size="sm"
                        className={`h-9 text-xs font-body ${
                          sortBy === opt.value
                            ? "bg-primary text-primary-foreground border-primary"
                            : "text-muted-foreground"
                        }`}
                        onClick={() => onSortChange(opt.value)}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Product count */}
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground font-body">{productCount} items found</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  );
};

export default CategoryFilter;
