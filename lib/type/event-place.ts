

export type CosplayEventResponseDTO = {
  id: string;
  title: string;
  description: string;
  media_url: string | null;
  start_at: string;
  end_at: string;
  event_information_url: string | null;
  location: CosplayEventLocationResponseDTO;
  created_at: string;
};

export type CosplayEventLocationResponseDTO = {
  id: string;
  name: string;
  address: string;
  location_type: string;
  osm_id: number | null;
  osm_type: string | null;
  latitude: number | null;
  longitude: number | null;
};

export type SearchEventParams = {
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
  title?: string;
};
