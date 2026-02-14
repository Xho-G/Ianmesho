import React from 'react';
import { MapPin, Wifi, Shield, Zap, Droplets, Home } from 'lucide-react';
import { Listing } from '../types';

interface PropertyCardProps {
  listing: Listing;
  onClick: (listing: Listing) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ listing, onClick }) => {
  // Helper to get icon for amenity
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi size={14} className="mr-1" />;
      case 'security guard': return <Shield size={14} className="mr-1" />;
      case 'backup power': return <Zap size={14} className="mr-1" />;
      case 'borehole water': return <Droplets size={14} className="mr-1" />;
      case 'walled fence': return <Home size={14} className="mr-1" />;
      default: return null;
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
      onClick={() => onClick(listing)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={listing.imageUrl} 
          alt={listing.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
          {listing.type}
        </div>
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs flex items-center">
          <MapPin size={12} className="mr-1" /> {listing.distanceToCampus}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1">{listing.title}</h3>
            <p className="text-slate-500 text-sm flex items-center">
              <MapPin size={14} className="mr-1 text-secondary" />
              {listing.location}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 mt-3">
          {listing.amenities.slice(0, 3).map(am => (
            <span key={am} className="inline-flex items-center text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
              {getAmenityIcon(am)} {am}
            </span>
          ))}
          {listing.amenities.length > 3 && (
            <span className="text-xs text-slate-400 px-2 py-1">+ {listing.amenities.length - 3} more</span>
          )}
        </div>

        <div className="flex justify-between items-center border-t border-slate-100 pt-4">
          <div className="text-slate-900 font-bold text-xl">
            MK {listing.price.toLocaleString()}
            <span className="text-xs text-slate-400 font-normal ml-1">/ month</span>
          </div>
          <button className="text-primary text-sm font-semibold group-hover:translate-x-1 transition-transform">
            View Details &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
