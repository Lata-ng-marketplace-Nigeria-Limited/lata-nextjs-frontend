import { ICookies } from "@/interface/general";
import { DateTime } from "luxon";

const setCookies = (
  name: ICookies,
  value: string,
  options: {
    days?: number;
    isoDate?: string;
  },
) => {
  const { days, isoDate } = options;
  let expiringTime = "";

  if (isoDate) {
    const isoDateTime = DateTime.fromISO(isoDate);
    const diff = isoDateTime.diffNow("days").toObject();
    const date = new Date();
    date.setTime(date.getTime() + diff.days! * 24 * 60 * 60 * 1000);
    expiringTime = date.toUTCString();
  }

  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expiringTime = date.toUTCString();
  }
  const expires = `expires=${expiringTime}`;
  document.cookie = `${name}=${value};${expires};path=/`;
};

const getCookies = (name: ICookies) => {
  if (typeof window === "undefined") return undefined;
  const cookieName = `${name}=`;
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return "";
};

const deleteCookies = (name: ICookies) => {
  setCookies(name, "", { days: -1 });
};

function clearAllCookies() {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  }
}

export { setCookies, getCookies, deleteCookies, clearAllCookies };
