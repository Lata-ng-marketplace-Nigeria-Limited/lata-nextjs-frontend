import { State } from "@/interface/location";

export const selectedState = (location: State[], stateId: string) => {
  if (!location || !stateId) return;
  return location.find((loc) => loc.id === stateId)?.name || stateId;
};

export const selectedCity = (
  location: State[],
  stateId: string,
  cityId: string,
) => {
  if (!location || !stateId || cityId) return;

  return (
    location
      .find((loc) => loc.id === stateId)
      ?.cities.find((city) => city.id === cityId)?.name || cityId
  );
};
