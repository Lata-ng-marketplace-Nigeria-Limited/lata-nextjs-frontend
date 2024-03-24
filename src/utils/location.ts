import { State } from "@/interface/location";


export const selectedState = (location: State[], stateId: string) => {
  return location.find((loc) => loc.id === stateId)?.name || stateId;
};

export const selectedCity = (location: State[], stateId: string, cityId: string) => {
  if (!stateId) return cityId;

  return (
    location
      .find((loc) => loc.id === stateId)
      ?.cities.find((city) => city.id === cityId)?.name || cityId
  );
};
