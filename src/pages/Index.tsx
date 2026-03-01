import { useState } from "react";
import Header from "@/components/store/Header";
import HeroBanner from "@/components/store/HeroBanner";
import CategoryFilter from "@/components/store/CategoryFilter";
import ProductCard, { Product } from "@/components/store/ProductCard";
import Features from "@/components/store/Features";
import Newsletter from "@/components/store/Newsletter";
import Footer from "@/components/store/Footer";

const products: Product[] = [
  {
    id: 1,
    name: "Classic Red Heels",
    category: "shoes",
    subcategory: "heels",
    price: 4500,
    originalPrice: 5000,
    rating: 4.8,
    reviewCount: 124,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=600&fit=crop",
    inStock: true,
    isNew: false,
    onSale: true,
    description: "Elegant classic heels perfect for formal occasions",
  },
  {
    id: 2,
    name: "Luxury Face Cream",
    category: "beauty",
    subcategory: "skincare",
    price: 2800,
    originalPrice: 2800,
    rating: 4.9,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=600&fit=crop",
    inStock: true,
    isNew: true,
    onSale: false,
    description: "Anti-aging face cream with natural ingredients",
  },
  {
    id: 3,
    name: "Comfortable Sneakers",
    category: "shoes",
    subcategory: "sneakers",
    price: 6200,
    originalPrice: 6200,
    rating: 4.7,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=600&fit=crop",
    inStock: true,
    isNew: false,
    onSale: false,
    description: "Ultra-comfortable sneakers for daily wear",
  },
  {
    id: 4,
    name: "Matte Lipstick Set",
    category: "beauty",
    subcategory: "makeup",
    price: 1800,
    originalPrice: 2200,
    rating: 4.6,
    reviewCount: 203,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&h=600&fit=crop",
    inStock: true,
    isNew: false,
    onSale: true,
    description: "Long-lasting matte lipstick collection",
  },
  {
    id: 5,
    name: "Designer Sandals",
    category: "shoes",
    subcategory: "sandals",
    price: 3900,
    originalPrice: 3900,
    rating: 4.5,
    reviewCount: 78,
    image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=500&h=600&fit=crop",
    inStock: false,
    isNew: false,
    onSale: false,
    description: "Elegant designer sandals for summer",
  },
  {
    id: 6,
    name: "Premium Perfume",
    category: "beauty",
    subcategory: "perfumes",
    price: 8500,
    originalPrice: 8500,
    rating: 4.9,
    reviewCount: 92,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=600&fit=crop",
    inStock: true,
    isNew: true,
    onSale: false,
    description: "Luxurious long-lasting fragrance",
  },
  {
    id: 7,
    name: "Block Heel Mules",
    category: "shoes",
    subcategory: "heels",
    price: 3800,
    originalPrice: 4200,
    rating: 4.4,
    reviewCount: 67,
    image: "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=500&h=600&fit=crop",
    inStock: true,
    isNew: true,
    onSale: true,
    description: "Trendy block heel mules for effortless style",
  },
  {
    id: 8,
    name: "Hydrating Serum",
    category: "beauty",
    subcategory: "skincare",
    price: 3200,
    originalPrice: 3200,
    rating: 4.8,
    reviewCount: 145,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=600&fit=crop",
    inStock: true,
    isNew: false,
    onSale: false,
    description: "Vitamin C hydrating serum for radiant skin",
  },
];

const categories = [
  { id: "all", name: "All", icon: "✨" },
  { id: "shoes", name: "Shoes", icon: "👠" },
  { id: "beauty", name: "Beauty", icon: "💄" },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartItems, setCartItems] = useState(0);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (productId: number) => {
    setCartItems((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartItems={cartItems}
        wishlistCount={0}
      />
      <HeroBanner onCategorySelect={setSelectedCategory} />
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
        productCount={filteredProducts.length}
      />

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-body text-lg">No products found</p>
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
