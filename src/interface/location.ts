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
