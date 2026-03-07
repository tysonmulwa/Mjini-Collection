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
    <section className="py-4 bg-background sticky top-[105px] z-40 border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                size="sm"
                className={`rounded-none px-5 h-9 font-body text-xs uppercase tracking-[0.15em] transition-all duration-300 shrink-0 ${
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
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-body shrink-0">
            {productCount} {productCount === 1 ? "item" : "items"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CategoryFilter;
