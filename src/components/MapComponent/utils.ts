export type OSMdata = {
  address: {
    town?: string;
    city?: string;
    state_district: string;
    muncipality?: string;
    state?: string;
    postcode: string;
    country: string;
    country_code: string;
    village?: string;
    road?: string;
    house_number?: string;
    suburb?: string;
    hamlet?: string;
    locality?: string;
    isolated_dwelling?: string;
  };
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: string;
  icon: string;
  osm_id: number;
  osm_type: string;
  licence: string;
  place_id: number;
  boundingbox: [number];
};

export type ParkingSpot = {
  availableEnd: Date;
  availableStart: Date;
  price: number;
  imageURL: string | null;
  id: string;
  address: string;
  rating: number | null;
  features: string[] | [];
  dimensions: string;
  latitude: number;
  longitude: number;
  _count: {
    Booking: number;
  };
};
