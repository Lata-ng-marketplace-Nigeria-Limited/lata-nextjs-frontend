import { State } from "@/interface/location";
import { isUUID } from "./general";

export const locationIdAsName = (locationId: string) => {
  if (!locationId) return "";
  return isUUID(locationId) ? "" : locationId;
};

export const selectedState = (location: State[], stateId: string): string => {
  if (!location || !stateId) return "";

  let stateName: string = "";

  const findState = location.find((loc) => loc.id === stateId);

  return (stateName = findState?.name || locationIdAsName(stateId));
};

export const selectedCity = (
  location: State[],
  stateId: string,
  cityId: string,
): string => {
  if (!location || !stateId || cityId) return "";

  let cityName: string;

  const findCity = location.find((loc) => loc.id === stateId);

  return (cityName = findCity?.name || locationIdAsName(cityId));
};
