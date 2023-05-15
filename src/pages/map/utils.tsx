export type OSMdata = {
  address: {
    town: string;
    city: string;
    state_district: string;
    state: string;
    postcode: string;
    country: string;
    country_code: string;
  };
  lat: number;
  lon: number;
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
