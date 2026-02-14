
import React, { useState, useEffect, useMemo } from 'react';
import Hero from './components/Hero';
import PropertyCard from './components/PropertyCard';
import Filters from './components/Filters';
import ListingModal from './components/ListingModal';
import AuthForm from './components/AuthForm';
import LandlordPortal from './components/LandlordPortal';
import { MOCK_LISTINGS } from './constants';
import { Listing, SearchFilters, AISearchResult } from './types';
import { interpretSearchQuery } from './services/geminiService';
import { MapPin, SearchX, Info, UserCircle, LogOut } from 'lucide-react';

type AppView = 'home' | 'login' | 'signup' | 'landlord';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string } | null>(null);

  // Handle "Smart Search" from Hero
  const handleSmartSearch = async (query: string) => {
    setIsSearchingAI(true);
    setAiReasoning(null);
    try {
      const result: AISearchResult | null = await interpretSearchQuery(query);
      
      if (result) {
        setFilters({
          location: result.locations?.[0], 
          maxPrice: result.maxPrice,
          minPrice: result.minPrice,
          amenities: result.requiredAmenities,
          query: query 
        });
        
        if (result.reasoning) {
            setAiReasoning(result.reasoning);
        }
      }
    } catch (error) {
      console.error("Search error", error);
    } finally {
      setIsSearchingAI(false);
    }
  };

  const handleManualFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setAiReasoning(null);
  };

  const clearFilters = () => {
    setFilters({});
    setAiReasoning(null);
  };

  const handleLoginSuccess = (name: string) => {
    setUser({ name });
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setUser(null);
  };

  const filteredListings = useMemo(() => {
    return MOCK_LISTINGS.filter(listing => {
      if (filters.location && listing.location !== filters.location) return false;
      if (filters.maxPrice && listing.price > filters.maxPrice) return false;
      if (filters.minPrice && listing.price < filters.minPrice) return false;
      if (filters.amenities && filters.amenities.length > 0) {
        const hasAll = filters.amenities.every(reqAmenity => 
          listing.amenities.some(amenity => amenity.toLowerCase() === reqAmenity.toLowerCase())
        );
        if (!hasAll) return false;
      }
      return true;
    });
  }, [filters]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50/50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 py-4 sticky top-0 z-40 bg-opacity-80 backdrop-blur-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
            <button 
              onClick={() => setView('home')}
              className="flex items-center gap-2 text-primary font-bold text-xl hover:opacity-80 transition-opacity"
            >
                <MapPin className="fill-primary text-white" />
                <span>Mesho</span>
            </button>
            <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
                <button onClick={() => setView('home')} className={`hover:text-primary transition-colors ${view === 'home' ? 'text-primary' : ''}`}>Find a Room</button>
                <button onClick={() => setView('landlord')} className={`hover:text-emerald-600 transition-colors ${view === 'landlord' ? 'text-emerald-600 font-bold' : ''}`}>List Property</button>
                <a href="#" className="hover:text-primary transition-colors">Student Guides</a>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-xs text-slate-400">Welcome,</span>
                    <span className="text-sm font-bold text-slate-900">{user.name}</span>
                  </div>
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <UserCircle size={28} />
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Log Out"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setView('login')}
                  className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
                >
                    Log In
                </button>
              )}
            </div>
        </div>
      </nav>

      {view === 'home' ? (
        <>
          <Hero onSearch={handleSmartSearch} isSearching={isSearchingAI} />
          <main className="flex-grow container mx-auto px-4 py-12">
            <div className="flex flex-col lg:flex-row gap-8">
              <aside className="w-full lg:w-1/4">
                <Filters 
                  filters={filters} 
                  onFilterChange={handleManualFilterChange} 
                  onClear={clearFilters}
                />
              </aside>
              <div className="w-full lg:w-3/4">
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                   <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        {filteredListings.length} {filteredListings.length === 1 ? 'Place' : 'Places'} Found
                      </h2>
                      {aiReasoning && (
                          <div className="mt-2 text-sm text-secondary flex items-start gap-2 bg-amber-50 p-3 rounded-lg border border-amber-100 max-w-xl animate-in fade-in slide-in-from-left-2">
                              <Info size={16} className="mt-0.5 flex-shrink-0" />
                              <p>{aiReasoning}</p>
                          </div>
                      )}
                   </div>
                   <select className="bg-transparent text-sm font-medium text-slate-600 border-none focus:ring-0 cursor-pointer">
                       <option>Sort by: Recommended</option>
                       <option>Price: Low to High</option>
                       <option>Price: High to Low</option>
                   </select>
                </div>

                {filteredListings.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {filteredListings.map(listing => (
                      <PropertyCard 
                        key={listing.id} 
                        listing={listing} 
                        onClick={setSelectedListing} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <SearchX size={48} className="text-slate-300 mb-4" />
                    <h3 className="text-xl font-bold text-slate-700 mb-2">No matches found</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mb-6">
                      We couldn't find any places matching your specific criteria. Try adjusting your filters or search term.
                    </p>
                    <button 
                      onClick={clearFilters}
                      className="text-primary font-semibold hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </main>
        </>
      ) : view === 'landlord' ? (
        <LandlordPortal onBack={() => setView('home')} />
      ) : (
        <AuthForm 
          mode={view === 'login' ? 'login' : 'signup'}
          onToggleMode={() => setView(view === 'login' ? 'signup' : 'login')}
          onBack={() => setView('home')}
          onSuccess={handleLoginSuccess}
        />
      )}

      <footer className="bg-slate-900 text-slate-300 py-12">
          <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
              <div>
                  <div className="flex items-center gap-2 text-white font-bold text-xl mb-4">
                      <MapPin className="fill-primary text-slate-900" />
                      <span>Mesho</span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400">
                      Helping students in Blantyre find safe, affordable, and convenient accommodation since 2024.
                  </p>
              </div>
              <div>
                  <h4 className="text-white font-bold mb-4">Locations</h4>
                  <ul className="space-y-2 text-sm">
                      <li><a href="#" className="hover:text-white">Chitawira</a></li>
                      <li><a href="#" className="hover:text-white">Namiwawa</a></li>
                      <li><a href="#" className="hover:text-white">Sunnyside</a></li>
                      <li><a href="#" className="hover:text-white">Ginnery Corner</a></li>
                  </ul>
              </div>
              <div>
                  <h4 className="text-white font-bold mb-4">Portal</h4>
                  <ul className="space-y-2 text-sm">
                      <li><button onClick={() => setView('landlord')} className="hover:text-white">Landlord Access</button></li>
                      <li><a href="#" className="hover:text-white">Landlord Guidelines</a></li>
                      <li><a href="#" className="hover:text-white">Student Safety Tips</a></li>
                      <li><a href="#" className="hover:text-white">Contact Us</a></li>
                  </ul>
              </div>
               <div>
                  <h4 className="text-white font-bold mb-4">Legal</h4>
                  <ul className="space-y-2 text-sm">
                      <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                      <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                  </ul>
              </div>
          </div>
          <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
              © 2024 Mesho. Built for Malawi.
          </div>
      </footer>

      <ListingModal 
        listing={selectedListing} 
        onClose={() => setSelectedListing(null)} 
      />
    </div>
  );
};

export default App;
