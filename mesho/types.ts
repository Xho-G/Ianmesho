export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number; // in MWK
  location: string;
  type: 'Hostel' | 'Bedsitter' | 'Apartment' | 'Single Room' | 'Shared Room';
  amenities: string[];
  imageUrl: string;
  distanceToCampus: string; // e.g., "0.5km to MUBAS"
  rating: number;
  contact: string;
}

export interface SearchFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: string;
  amenities?: string[];
  query?: string;
}

export interface AISearchResult {
  locations?: string[];
  maxPrice?: number;
  minPrice?: number;
  type?: string;
  requiredAmenities?: string[];
  reasoning?: string;
}
