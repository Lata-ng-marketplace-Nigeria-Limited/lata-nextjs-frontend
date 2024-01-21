import axios from "axios";

const $location = axios.create({
  baseURL: process.env.NEXT_PUBLIC_COUNTRIES_API_URL,
  headers: {
    "X-CSCAPI-KEY": process.env.NEXT_PUBLIC_COUNTRIES_API_KEY,
  },
});

export const getStatesByCountryCode = async (countryCode: string = "NG") => {
  try {
    const { data } = await $location.get(`/countries/${countryCode}/states`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getCitiesByStateCodeAndCountryCode = async (
  stateCode: string,
  countryCode: string = "NG"
) => {
  try {
    const { data } = await $location.get(
      `/countries/${countryCode}/states/${stateCode}/cities`
    );
    return data;
  } catch (error) {
    throw error;
  }
};
