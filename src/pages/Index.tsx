
import { useState } from "react";
import { Search, MapPin, Calendar, Users, Star, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  // Sample property data
  const properties = [
    {
      id: 1,
      title: "Modern Loft in Downtown",
      location: "New York, NY",
      price: 120,
      rating: 4.9,
      reviewCount: 127,
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop",
      host: "Sarah",
      isWishlisted: false,
      type: "Entire apartment"
    },
    {
      id: 2,
      title: "Cozy Beach House",
      location: "Malibu, CA",
      price: 280,
      rating: 4.8,
      reviewCount: 89,
      image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=500&h=300&fit=crop",
      host: "Michael",
      isWishlisted: true,
      type: "Entire house"
    },
    {
      id: 3,
      title: "Mountain Cabin Retreat",
      location: "Aspen, CO",
      price: 195,
      rating: 4.95,
      reviewCount: 156,
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=300&fit=crop",
      host: "Jennifer",
      isWishlisted: false,
      type: "Entire cabin"
    },
    {
      id: 4,
      title: "Urban Studio Apartment",
      location: "San Francisco, CA",
      price: 85,
      rating: 4.7,
      reviewCount: 203,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop",
      host: "David",
      isWishlisted: false,
      type: "Entire studio"
    },
    {
      id: 5,
      title: "Luxury Villa with Pool",
      location: "Miami, FL",
      price: 450,
      rating: 4.92,
      reviewCount: 78,
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=500&h=300&fit=crop",
      host: "Isabella",
      isWishlisted: true,
      type: "Entire villa"
    },
    {
      id: 6,
      title: "Historic Brownstone",
      location: "Boston, MA",
      price: 165,
      rating: 4.85,
      reviewCount: 92,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop",
      host: "James",
      isWishlisted: false,
      type: "Entire house"
    }
  ];

  const handleSearch = () => {
    console.log("Searching for:", { searchLocation, checkIn, checkOut, guests });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-2xl font-bold text-rose-500">airbnb</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Stays</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Experiences</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Online Experiences</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                Airbnb your home
              </Button>
              <Button variant="outline" className="rounded-full">
                <Users className="w-4 h-4 mr-2" />
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop')"
          }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Not sure where to go? Perfect.
          </h1>
          
          {/* Search Bar */}
          <div className="bg-white rounded-full p-2 shadow-xl max-w-4xl mx-auto mt-8">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0">
              <div className="flex-1 px-4 py-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <Input 
                    placeholder="Where are you going?"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="border-0 focus:ring-0 text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>
              
              <div className="hidden md:block w-px h-8 bg-gray-300"></div>
              
              <div className="px-4 py-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <Input 
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="border-0 focus:ring-0 text-gray-900"
                  />
                </div>
              </div>
              
              <div className="hidden md:block w-px h-8 bg-gray-300"></div>
              
              <div className="px-4 py-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <Input 
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="border-0 focus:ring-0 text-gray-900"
                  />
                </div>
              </div>
              
              <div className="hidden md:block w-px h-8 bg-gray-300"></div>
              
              <div className="px-4 py-3">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <select 
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="border-0 focus:ring-0 text-gray-900 bg-transparent"
                  >
                    {[1,2,3,4,5,6,7,8].map(num => (
                      <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <Button 
                onClick={handleSearch}
                className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-8 py-6 h-auto"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Stays nearby</h2>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Card key={property.id} className="group cursor-pointer border-0 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white"
                  >
                    <Heart className={`w-4 h-4 ${property.isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-700'}`} />
                  </Button>
                  <Badge className="absolute bottom-3 left-3 bg-white text-gray-900">
                    {property.type}
                  </Badge>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-rose-500 transition-colors">
                        {property.title}
                      </h3>
                      <p className="text-gray-500 text-sm">{property.location}</p>
                      <p className="text-gray-500 text-sm">Host: {property.host}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{property.rating}</span>
                      <span className="text-sm text-gray-500">({property.reviewCount})</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <span className="text-lg font-bold text-gray-900">${property.price}</span>
                    <span className="text-gray-500"> night</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Explore by category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Beachfront", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop" },
              { name: "Cabins", image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop" },
              { name: "Trending", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop" },
              { name: "Unique stays", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=200&fit=crop" }
            ].map((category) => (
              <Card key={category.name} className="group cursor-pointer border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-32 object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-xl group-hover:bg-black/30 transition-colors"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white font-bold text-lg">{category.name}</h3>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-12 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Help Center</a></li>
                <li><a href="#" className="hover:text-gray-900">Safety information</a></li>
                <li><a href="#" className="hover:text-gray-900">Cancellation options</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Community</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Airbnb.org</a></li>
                <li><a href="#" className="hover:text-gray-900">Diversity & Belonging</a></li>
                <li><a href="#" className="hover:text-gray-900">Against Discrimination</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Hosting</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Airbnb your home</a></li>
                <li><a href="#" className="hover:text-gray-900">Host an experience</a></li>
                <li><a href="#" className="hover:text-gray-900">Responsible hosting</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Airbnb</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Newsroom</a></li>
                <li><a href="#" className="hover:text-gray-900">New features</a></li>
                <li><a href="#" className="hover:text-gray-900">Careers</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-300 mt-8 pt-8 text-center">
            <p className="text-gray-600">© 2024 Airbnb Clone. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
