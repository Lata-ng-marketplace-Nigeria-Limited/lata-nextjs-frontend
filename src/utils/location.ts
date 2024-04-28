import { State } from "@/interface/location";
import { isUUID } from "./general";

export const locationIdAsName = (locationId: string) => {
  if (!locationId) return "";
  return isUUID(locationId) ? "" : locationId;
};

export const selectedState = (location: State[], stateId: string): string => {
  if (!location || !stateId) return "";

  return (
    location.find((loc) => loc.id === stateId)?.name ||
    locationIdAsName(stateId)
  );
};

export const selectedCity = (
  location: State[],
  stateId: string,
  cityId: string,
): string => {
  if (!location || !stateId || !cityId) return "";

  const findState = location.find((loc) => loc.id === stateId);
  if (!findState) return "";

  return (
    findState?.cities.find((city) => city.id === cityId)?.name ||
    locationIdAsName(cityId)
  );
};
