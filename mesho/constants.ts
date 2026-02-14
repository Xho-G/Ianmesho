import { Listing } from './types';

export const LOCATIONS = [
  "Chitawira",
  "Namiwawa",
  "Chilomoni",
  "Ginnery Corner",
  "Nkolokosa",
  "Nyambadwe",
  "Zingwangwa",
  "Sunnyside",
  "Mandala"
];

export const AMENITIES = [
  "WiFi",
  "Borehole Water",
  "Backup Power",
  "Security Guard",
  "Walled Fence",
  "Self Contained",
  "Furnished",
  "Close to Road"
];

export const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Modern Student Hostel near MUBAS',
    description: 'A secure and social hostel environment perfect for first-year students. Includes shared kitchen and study area.',
    price: 85000,
    location: 'Chitawira',
    type: 'Hostel',
    amenities: ['WiFi', 'Security Guard', 'Walled Fence', 'Borehole Water'],
    imageUrl: 'https://picsum.photos/800/600?random=1',
    distanceToCampus: '1.2km to MUBAS',
    rating: 4.5,
    contact: '+265 999 123 456'
  },
  {
    id: '2',
    title: 'Quiet Bedsitter in Namiwawa',
    description: 'Peaceful bedsitter ideal for postgraduate students. Includes private bathroom and small kitchenette.',
    price: 150000,
    location: 'Namiwawa',
    type: 'Bedsitter',
    amenities: ['Self Contained', 'Walled Fence', 'Backup Power', 'Furnished'],
    imageUrl: 'https://picsum.photos/800/600?random=2',
    distanceToCampus: '2.5km to KUHeS',
    rating: 4.8,
    contact: '+265 888 234 567'
  },
  {
    id: '3',
    title: 'Affordable Shared Room',
    description: 'Budget-friendly shared room option. Clean and safe compound.',
    price: 45000,
    location: 'Chilomoni',
    type: 'Shared Room',
    amenities: ['Close to Road', 'Walled Fence'],
    imageUrl: 'https://picsum.photos/800/600?random=3',
    distanceToCampus: '3.0km to MUBAS',
    rating: 4.0,
    contact: '+265 991 111 222'
  },
  {
    id: '4',
    title: 'Luxury 2 Bedroom Apartment',
    description: 'Spacious apartment suitable for group sharing. Modern finishings.',
    price: 250000,
    location: 'Sunnyside',
    type: 'Apartment',
    amenities: ['WiFi', 'Backup Power', 'Self Contained', 'Furnished', 'Security Guard'],
    imageUrl: 'https://picsum.photos/800/600?random=4',
    distanceToCampus: '1.5km to KUHeS',
    rating: 4.9,
    contact: '+265 881 333 444'
  },
  {
    id: '5',
    title: 'Single Room with Garden View',
    description: 'Airy single room in a large family compound. Quiet atmosphere.',
    price: 70000,
    location: 'Nkolokosa',
    type: 'Single Room',
    amenities: ['Borehole Water', 'Walled Fence'],
    imageUrl: 'https://picsum.photos/800/600?random=5',
    distanceToCampus: '4.0km to MUBAS',
    rating: 4.2,
    contact: '+265 995 555 666'
  },
  {
    id: '6',
    title: 'Ginnery Corner Student Hub',
    description: 'Walking distance to Polytechnic (MUBAS). Very popular with engineering students.',
    price: 90000,
    location: 'Ginnery Corner',
    type: 'Hostel',
    amenities: ['WiFi', 'Close to Road', 'Security Guard'],
    imageUrl: 'https://picsum.photos/800/600?random=6',
    distanceToCampus: '0.5km to MUBAS',
    rating: 4.6,
    contact: '+265 884 777 888'
  },
    {
    id: '7',
    title: 'Nyambadwe Hillside Cottage',
    description: 'Private cottage in a scenic area. Good for students who need focus.',
    price: 120000,
    location: 'Nyambadwe',
    type: 'Single Room',
    amenities: ['Walled Fence', 'Borehole Water', 'Self Contained'],
    imageUrl: 'https://picsum.photos/800/600?random=7',
    distanceToCampus: '3.5km to UNICAF',
    rating: 4.7,
    contact: '+265 992 999 000'
  }
];
