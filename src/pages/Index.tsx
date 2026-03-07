import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/store/Header";
import HeroBanner from "@/components/store/HeroBanner";
import CategoryFilter from "@/components/store/CategoryFilter";
import ProductCard from "@/components/store/ProductCard";
import Features from "@/components/store/Features";
import Newsletter from "@/components/store/Newsletter";
import Footer from "@/components/store/Footer";
import type { Tables } from "@/integrations/supabase/types";

const categories = [
  { id: "all", name: "All", icon: "✨" },
  { id: "shoes", name: "Shoes", icon: "👠" },
  { id: "beauty", name: "Beauty", icon: "💄" },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState<Tables<"products">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <HeroBanner onCategorySelect={setSelectedCategory} />
      <CategoryFilter categories={categories} selectedCategory={selectedCategory} onSelect={setSelectedCategory} productCount={filteredProducts.length} />

      {/* Products Section */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-[11px] uppercase tracking-[0.25em] text-primary font-body font-bold mb-2">Our Collection</p>
            <h2 className="text-2xl md:text-4xl font-display font-black text-foreground">
              Trending <span className="text-gradient-brand italic">Now</span>
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product, i) => (
                <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <p className="text-muted-foreground font-display font-semibold text-lg">No products found</p>
              <p className="text-muted-foreground/60 font-body text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>

      <Features />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
