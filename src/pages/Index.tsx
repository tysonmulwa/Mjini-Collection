
import { useState } from "react";
import { Search, ShoppingCart, Heart, Star, Filter, Menu, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartItems, setCartItems] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 50000]);

  // Sample product data for Sheshoe and Beauty Store
  const products = [
    {
      id: 1,
      name: "Classic Red Heels",
      category: "shoes",
      subcategory: "heels",
      price: 4500,
      originalPrice: 5000,
      rating: 4.8,
      reviewCount: 124,
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=400&fit=crop",
      sizes: ["36", "37", "38", "39", "40"],
      colors: ["Red", "Black", "Navy"],
      inStock: true,
      isNew: false,
      onSale: true,
      description: "Elegant classic heels perfect for formal occasions"
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
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=400&fit=crop",
      variants: ["50ml", "100ml"],
      inStock: true,
      isNew: true,
      onSale: false,
      description: "Anti-aging face cream with natural ingredients"
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
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=400&fit=crop",
      sizes: ["36", "37", "38", "39", "40", "41"],
      colors: ["White", "Pink", "Black"],
      inStock: true,
      isNew: false,
      onSale: false,
      description: "Ultra-comfortable sneakers for daily wear"
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
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&h=400&fit=crop",
      variants: ["Classic Reds", "Nude Collection", "Bold Colors"],
      inStock: true,
      isNew: false,
      onSale: true,
      description: "Long-lasting matte lipstick collection"
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
      image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=500&h=400&fit=crop",
      sizes: ["36", "37", "38", "39", "40"],
      colors: ["Gold", "Silver", "Rose Gold"],
      inStock: false,
      isNew: false,
      onSale: false,
      description: "Elegant designer sandals for summer"
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
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=400&fit=crop",
      variants: ["50ml", "100ml"],
      inStock: true,
      isNew: true,
      onSale: false,
      description: "Luxurious long-lasting fragrance"
    }
  ];

  const categories = [
    { id: "all", name: "All Products", icon: "🛍️" },
    { id: "shoes", name: "Shoes", icon: "👠" },
    { id: "beauty", name: "Beauty & Cosmetics", icon: "💄" },
  ];

  const shoeSubcategories = ["heels", "flats", "sneakers", "sandals"];
  const beautySubcategories = ["makeup", "skincare", "haircare", "perfumes"];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesSearch && matchesPrice;
  });

  const addToCart = (productId: number) => {
    setCartItems(prev => prev + 1);
    console.log(`Added product ${productId} to cart`);
  };

  const formatPrice = (price: number) => {
    return `KES ${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Sheshoe & Beauty
                </h1>
                <p className="text-xs text-gray-500">Ladies Fashion & Beauty</p>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Search shoes, beauty products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-full border-2 border-pink-200 focus:border-pink-400"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-700 hover:text-pink-600">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" className="relative text-gray-700 hover:text-pink-600">
                <ShoppingCart className="w-5 h-5" />
                {cartItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartItems}
                  </Badge>
                )}
              </Button>
              <Button variant="outline" className="rounded-full border-pink-300 text-pink-600 hover:bg-pink-50">
                <User className="w-4 h-4 mr-2" />
                Account
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-full border-2 border-pink-200 focus:border-pink-400"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 py-16">
        <div className="container mx-auto px-6 text-center text-white">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            Step Into Beauty
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Discover the latest in ladies' fashion shoes & premium beauty products
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-white text-pink-600 hover:bg-pink-50 px-8 py-3 rounded-full font-semibold">
              Shop Shoes 👠
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-pink-600 px-8 py-3 rounded-full font-semibold">
              Beauty Products 💄
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`rounded-full px-6 py-3 ${
                  selectedCategory === category.id 
                    ? "bg-pink-500 hover:bg-pink-600" 
                    : "border-pink-300 text-pink-600 hover:bg-pink-50"
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-4 bg-gray-50 border-b">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Showing {filteredProducts.length} products
            </p>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="border-pink-300 text-pink-600">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <select className="border border-pink-300 rounded-lg px-3 py-2 text-sm">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Customer Rating</option>
                <option>Newest First</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex flex-col space-y-2">
                    {product.isNew && (
                      <Badge className="bg-green-500 text-white">NEW</Badge>
                    )}
                    {product.onSale && (
                      <Badge className="bg-red-500 text-white">SALE</Badge>
                    )}
                    {!product.inStock && (
                      <Badge className="bg-gray-500 text-white">OUT OF STOCK</Badge>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white"
                  >
                    <Heart className="w-4 h-4 text-gray-700 hover:text-pink-500" />
                  </Button>
                </div>
                
                <CardContent className="p-6">
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">{product.subcategory}</p>
                  </div>
                  
                  <div className="flex items-center space-x-1 mb-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-sm text-gray-500">({product.reviewCount})</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.onSale && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full"
                    onClick={() => addToCart(product.id)}
                    disabled={!product.inStock}
                  >
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Why Choose Sheshoe & Beauty?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🚚</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Free Delivery</h3>
              <p className="text-gray-600">Free delivery within Nairobi for orders over KES 3,000</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">💳</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Flexible Payment</h3>
              <p className="text-gray-600">Pay with M-Pesa, card, or cash on delivery</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🔄</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day return policy for all products</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-pink-100 mb-8">Get the latest trends and exclusive offers</p>
          <div className="max-w-md mx-auto flex space-x-4">
            <Input 
              placeholder="Enter your email"
              className="flex-1 rounded-full border-0 bg-white"
            />
            <Button className="bg-white text-pink-600 hover:bg-pink-50 rounded-full px-8">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Sheshoe & Beauty</h3>
              <p className="text-gray-400 mb-4">Your one-stop shop for ladies' fashion shoes and premium beauty products in Kenya.</p>
              <div className="flex items-center space-x-2 text-pink-400">
                <Phone className="w-4 h-4" />
                <span>+254 700 123 456</span>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-pink-400">About Us</a></li>
                <li><a href="#" className="hover:text-pink-400">Contact</a></li>
                <li><a href="#" className="hover:text-pink-400">Size Guide</a></li>
                <li><a href="#" className="hover:text-pink-400">Shipping Info</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-pink-400">Heels</a></li>
                <li><a href="#" className="hover:text-pink-400">Sneakers</a></li>
                <li><a href="#" className="hover:text-pink-400">Makeup</a></li>
                <li><a href="#" className="hover:text-pink-400">Skincare</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-pink-400">Help Center</a></li>
                <li><a href="#" className="hover:text-pink-400">Returns</a></li>
                <li><a href="#" className="hover:text-pink-400">Track Order</a></li>
                <li><a href="#" className="hover:text-pink-400">WhatsApp Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 Sheshoe & Beauty. All rights reserved. Made with 💕 in Kenya</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
