export interface Restaurant {
  id: string;
  name: string;
  address: string;
  district: string;
  category: string;
  foodType: string;
  priceRange: string;
  rating: number;
  visited: boolean;
  recommended: boolean;
  lastVisited: string;
  visitCount: number;
  latitude: number;
  longitude: number;
  mapLink: string;
  imageUrl: string;
  parking: string;
  airConditioner: string;
  suitableFor: string;
  spicyLevel: string;
  tags: string;
  personalNotes: string;
  aiSummary: string;
  aiScore: number;
}