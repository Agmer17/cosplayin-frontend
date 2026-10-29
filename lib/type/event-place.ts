export type FindBoxDTO = {
  type: "FeatureCollection";
  features: PlaceFeatureDTO[];
};

export type PlaceFeatureDTO = {
  type: "Feature";
  geometry: PlaceGeometryDTO;
  properties: PlacePropertiesDTO;
};

export type PlaceGeometryDTO = {
  type: "Point";
  coordinates: [longitude: number, latitude: number];
};

export type PlacePropertiesDTO = {
  id: string;
  name: string;
  category: string | null;
};
