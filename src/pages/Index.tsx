import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/store/Header";
import CategoryFilter from "@/components/store/CategoryFilter";
import ProductCard from "@/components/store/ProductCard";
import Features from "@/components/store/Features";
import Newsletter from "@/components/store/Newsletter";
import Footer from "@/components/store/Footer";
import HeroSkeleton from "@/components/store/HeroSkeleton";
import ProductGridSkeleton from "@/components/store/ProductGridSkeleton";
import PageTransition from "@/components/store/PageTransition";
import type { Tables } from "@/integrations/supabase/types";

const categories = [
  { id: "all", name: "All", icon: "✨" },
  { id: "shoes", name: "Shoes", icon: "👠" },
  { id: "men-shoes", name: "Men Shoes", icon: "👞" },
  { id: "beauty", name: "Beauty", icon: "💄" },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedShoeType, setSelectedShoeType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
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

  const filteredProducts = products
    .filter((product) => {
      // Category filter
      let matchesCategory = true;
      if (selectedCategory === "shoes") {
        matchesCategory = product.category === "shoes";
      } else if (selectedCategory === "men-shoes") {
        matchesCategory = product.category === "shoes" && product.subcategory?.toLowerCase() === "men";
      } else if (selectedCategory !== "all") {
        matchesCategory = product.category === selectedCategory;
      }

      // Gender/subcategory filter
      let matchesGender = true;
      if (selectedGender !== "all") {
        matchesGender = product.subcategory?.toLowerCase() === selectedGender;
      }

      // Status filter
      let matchesStatus = true;
      if (selectedStatus === "new") matchesStatus = product.is_new === true;
      else if (selectedStatus === "on_sale") matchesStatus = product.on_sale === true;
      else if (selectedStatus === "in_stock") matchesStatus = product.in_stock === true;

      // Shoe type filter
      let matchesShoeType = true;
      if (selectedShoeType !== "all") {
        matchesShoeType = (product as any).shoe_type === selectedShoeType;
      }

      // Search
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesGender && matchesStatus && matchesShoeType && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price_low": return a.price - b.price;
        case "price_high": return b.price - a.price;
        case "name_az": return a.name.localeCompare(b.name);
        default: return 0; // newest — already sorted by created_at desc
      }
    });

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        {loading ? (
          <HeroSkeleton />
        ) : (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="py-10 md:py-20 border-b border-border/30"
          >
            <div className="container mx-auto px-4 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4 md:mb-8 leading-tight"
              >
                Curated Fashion & Beauty
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-sm text-muted-foreground font-body mb-6 md:mb-8 max-w-md mx-auto"
              >
                Premium shoes & beauty products for everyone — delivered across Kenya
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="flex-wrap flex-row gap-4 flex items-center justify-center"
              >
                <button
                  onClick={() => setSelectedCategory("shoes")}
                  className="px-6 py-3 min-h-[44px] font-body text-sm font-semibold transition-all duration-300 active:scale-[0.97] rounded-3xl text-secondary-foreground bg-primary"
                >
                  Shop Shoes
                </button>
                <button
                  onClick={() => setSelectedCategory("men-shoes")}
                  className="px-6 py-3 min-h-[44px] bg-transparent border border-primary text-primary font-body text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300 active:scale-[0.97] rounded-3xl"
                >
                  Men Shoes
                </button>
                <button
                  onClick={() => setSelectedCategory("beauty")}
                  className="px-6 py-3 min-h-[44px] bg-transparent border border-primary text-primary font-body text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300 active:scale-[0.97] rounded-3xl"
                >
                  Beauty Products
                </button>
              </motion.div>
            </div>
          </motion.section>
        )}

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
          productCount={filteredProducts.length}
          sortBy={sortBy}
          onSortChange={setSortBy}
          selectedGender={selectedGender}
          onGenderChange={setSelectedGender}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedShoeType={selectedShoeType}
          onShoeTypeChange={setSelectedShoeType}
        />

        <section className="py-10 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-center mb-8 md:mb-12 rounded-3xl"
            >
              <div className="w-12 h-px bg-primary mx-auto mb-4 md:mb-6" />
              <p className="uppercase tracking-[0.3em] text-primary font-body mb-2 md:mb-3 text-center text-xs font-bold">Our Collection</p>
              <h2 className="text-xl md:text-4xl font-display font-bold text-foreground">
                Trending <span className="italic text-primary">Now</span>
              </h2>
            </motion.div>

            {loading ? (
              <ProductGridSkeleton />
            ) : (
              <div
                key={`${selectedCategory}-${selectedGender}-${selectedStatus}-${sortBy}`}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 border-none animate-fade-in"
              >
                {filteredProducts.map((product) => (
                  <div key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-16 md:py-20"
              >
                <div className="w-14 h-14 border border-border flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl">🔍</span>
                </div>
                <p className="text-foreground font-display font-semibold text-lg">No products found</p>
                <p className="text-muted-foreground font-body text-sm mt-1">Try adjusting your search or filters</p>
              </motion.div>
            )}
          </div>
        </section>

        <Features />
        <Newsletter />
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
