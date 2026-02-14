import React from 'react';
import { X, Phone, Star, MapPin, CheckCircle } from 'lucide-react';
import { Listing } from '../types';

interface ListingModalProps {
  listing: Listing | null;
  onClose: () => void;
}

const ListingModal: React.FC<ListingModalProps> = ({ listing, onClose }) => {
  if (!listing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in duration-200"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={24} className="text-slate-700" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image Section */}
          <div className="h-64 md:h-full bg-slate-100">
            <img 
              src={listing.imageUrl} 
              alt={listing.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details Section */}
          <div className="p-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {listing.type}
              </span>
              <div className="flex items-center text-amber-500 text-sm font-semibold">
                <Star size={14} className="fill-amber-500 mr-1" />
                {listing.rating}
              </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-2">{listing.title}</h2>
            
            <div className="flex items-center text-slate-500 mb-6">
              <MapPin size={18} className="mr-1 text-primary" />
              <span className="mr-4">{listing.location}</span>
              <span className="text-sm bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                {listing.distanceToCampus}
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Description</h3>
              <p className="text-slate-600 leading-relaxed">
                {listing.description}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                {listing.amenities.map(am => (
                  <div key={am} className="flex items-center text-sm text-slate-700">
                    <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0" />
                    {am}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <div>
                <span className="block text-xs text-slate-500 uppercase">Monthly Rent</span>
                <span className="text-3xl font-bold text-slate-900">
                  MK {listing.price.toLocaleString()}
                </span>
              </div>
              <a 
                href={`tel:${listing.contact}`}
                className="bg-primary hover:bg-sky-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center transition-colors shadow-lg shadow-primary/30"
              >
                <Phone size={18} className="mr-2" />
                Contact Agent
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingModal;
