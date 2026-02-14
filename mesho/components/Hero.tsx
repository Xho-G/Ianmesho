import React, { useState } from 'react';
import { Search, Sparkles, MapPin, Loader2 } from 'lucide-react';

interface HeroProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

const Hero: React.FC<HeroProps> = ({ onSearch, isSearching }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="relative bg-primary text-white overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80')] bg-cover bg-center" />
      
      <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          Find Your Home Away From Home
          <span className="block text-secondary mt-2">in Blantyre</span>
        </h1>
        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mb-10">
          The smartest way for students to find hostels, bedsitters, and apartments near MUBAS, KUHeS, and UNICAF.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-3xl relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            {isSearching ? (
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            ) : (
              <Sparkles className="h-6 w-6 text-secondary" />
            )}
          </div>
          <input
            type="text"
            className="w-full pl-14 pr-32 py-5 rounded-full text-slate-900 shadow-2xl focus:outline-none focus:ring-4 focus:ring-secondary/50 text-lg transition-all"
            placeholder="Try 'Budget room near Poly with backup power'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-sky-700 text-white px-8 rounded-full font-semibold transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {isSearching ? 'Thinking...' : 'Search'}
          </button>
        </form>

        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-blue-200">
          <span>Popular:</span>
          <button onClick={() => onSearch("Cheap hostel near MUBAS")} className="hover:text-white underline decoration-dashed">Cheap hostel near MUBAS</button>
          <button onClick={() => onSearch("Apartment in Sunnyside with WiFi")} className="hover:text-white underline decoration-dashed">Apartment in Sunnyside</button>
          <button onClick={() => onSearch("Secure place in Chitawira")} className="hover:text-white underline decoration-dashed">Secure place in Chitawira</button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
