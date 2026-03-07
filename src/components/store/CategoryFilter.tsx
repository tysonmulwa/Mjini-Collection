import { Button } from "@/components/ui/button";

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
}

const CategoryFilter = ({ categories, selectedCategory, onSelect, productCount }: CategoryFilterProps) => {
  return (
    <section className="py-5 bg-background sticky top-[88px] z-40 border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                size="sm"
                className={`rounded-full px-5 h-9 font-body text-sm transition-all duration-300 shrink-0 ${
                  selectedCategory === category.id
                    ? "gradient-brand text-primary-foreground shadow-md hover:shadow-lg scale-[1.02]"
                    : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                onClick={() => onSelect(category.id)}
              >
                <span className="mr-1.5 text-base">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground font-body shrink-0 tabular-nums bg-secondary/60 px-3 py-1.5 rounded-full">
            {productCount} {productCount === 1 ? "item" : "items"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CategoryFilter;
