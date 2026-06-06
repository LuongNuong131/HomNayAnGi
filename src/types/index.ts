export interface Restaurant {
  id: number;
  name: string;
  price: string;
  address: string;
  rating: number;
  visited: boolean;
  notes: string;
  photoUrl: string;
  dateVisited: string | null;
  lat: number;
  lng: number;
}