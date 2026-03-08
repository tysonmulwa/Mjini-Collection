import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
    <section className="py-3 md:py-4 bg-background sticky top-[85px] md:top-[105px] z-40 border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="gap-3 flex-row flex items-center justify-between rounded-2xl">
          <div className="flex items-center gap-1.5 md:gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
            {categories.map((category) =>
            <Button
              key={category.id}
              variant="ghost"
              size="sm"
              className={`rounded-none px-4 md:px-5 h-10 min-h-[44px] font-body text-xs uppercase tracking-[0.12em] md:tracking-[0.15em] transition-all duration-300 shrink-0 ${
              selectedCategory === category.id ?
              "bg-accent text-accent-foreground border border-primary/30" :
              "bg-transparent text-muted-foreground hover:text-foreground border border-transparent hover:border-border"}`
              }
              onClick={() => onSelect(category.id)}>
              
                <span className="mr-1.5 text-sm">{category.icon}</span>
                {category.name}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>);

};

export default CategoryFilter;