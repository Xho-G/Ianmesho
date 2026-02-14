import React from 'react';
import { LOCATIONS, AMENITIES } from '../constants';
import { SearchFilters } from '../types';

interface FiltersProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  onClear: () => void;
}

const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange, onClear }) => {
  const handleChange = (key: keyof SearchFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const toggleAmenity = (amenity: string) => {
    const current = filters.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter(a => a !== amenity)
      : [...current, amenity];
    handleChange('amenities', updated);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-lg text-slate-800">Filters</h2>
        <button onClick={onClear} className="text-sm text-red-500 hover:underline">
          Reset
        </button>
      </div>

      {/* Location */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
        <select
          value={filters.location || ''}
          onChange={(e) => handleChange('location', e.target.value || undefined)}
          className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="">All Locations</option>
          {LOCATIONS.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Max Price (MWK)</label>
        <input
          type="range"
          min="20000"
          max="500000"
          step="5000"
          value={filters.maxPrice || 500000}
          onChange={(e) => handleChange('maxPrice', parseInt(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="text-right text-sm text-slate-600 mt-1">
          Up to MK {(filters.maxPrice || 500000).toLocaleString()}
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Amenities</label>
        <div className="space-y-2">
          {AMENITIES.map(amenity => (
            <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.amenities?.includes(amenity) || false}
                onChange={() => toggleAmenity(amenity)}
                className="rounded text-primary focus:ring-primary border-slate-300"
              />
              <span className="text-sm text-slate-600">{amenity}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filters;
