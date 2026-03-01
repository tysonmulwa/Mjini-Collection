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
    <section className="py-6 border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                className={`rounded-full px-5 py-2 font-body text-sm transition-all ${
                  selectedCategory === category.id
                    ? "gradient-brand text-primary-foreground border-0 shadow-md"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
                onClick={() => onSelect(category.id)}
              >
                <span className="mr-1.5">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground font-body shrink-0">
            {productCount} {productCount === 1 ? "product" : "products"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CategoryFilter;
