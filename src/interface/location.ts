export interface ICountriesData {
  name: string;
  dial_code: string;
  code: string;
  flag: string;
}

export interface IStatesData {
  label: string;
  value: string;
  cities: ICitiesData[];
}
export interface ICitiesData {
  name: string;
  id: number;
}

export interface ICountriesData {
  name: string;
  dial_code: string;
  code: string;
  flag: string;
}


export interface State {
  id: string;
  name: string;
  countryName: string;
  isActive: boolean;
  meta?: string;
  createdAt: string;
  updatedAt: string;
  cities: City[];
}

export interface City {
  id: string;
  name: string;
  stateName: string;
  stateId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  state: State;
}