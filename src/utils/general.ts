import { ApiErrorResponse, IEnv } from "@/interface/general";
import { AUTH_CALLBACK_ROUTE, LOGIN_ROUTE } from "@/constants/routes";
import { ApiAuthCallback } from "@/api/auth";
import { User } from "@/interface/user";
import { toast } from "@/components/ui/use-toast";
import { clearAllCookies } from ".";
import { signOut } from "next-auth/react";

export const getEnv = (env: IEnv): string => {
  return process.env[env] || "";
};

export function encodeUnicode(str: string) {
  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return btoa(
    encodeURIComponent(str).replace(
      /%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
        // @ts-ignore
        return String.fromCharCode("0x" + p1);
      },
    ),
  );
}

export const getUserFromAuthCallback = (data: ApiAuthCallback): User => {
  const loggedUser = {
    ...data,
  };
  Reflect.deleteProperty(loggedUser, "token");
  Reflect.deleteProperty(loggedUser, "type");
  // Reflect.deleteProperty(loggedUser, "expires_at");

  return loggedUser;
};

export const createFetchError = (error: any, message?: string) => {
  return new Error(message || "Error fetching data", {
    cause: error.response || error,
  });
};

export const getFormErrorObject = (errorResponse: ApiErrorResponse<any>) => {
  const errorArray =
    errorResponse?.data?.errors || Array.isArray(errorResponse?.data?.error)
      ? errorResponse?.data?.error
      : [];
  if (errorArray) {
    const errorObj: { [key: string]: any } = {};
    errorArray.forEach((err: any) => {
      if (err.retryAfter) {
        errorObj.retryAfter = `Please wait for ${err.retryAfter} seconds before trying again`;
        return;
      }
      // @ts-ignore
      errorObj[err.field] = err?.message;
    });

    if (Object.keys(errorObj).length) {
      return errorObj;
    }
    return null;
  }
  return null;
};

export function createFormData(data: Record<string, any>) {
  const formData = new FormData();

  for (let key in data) {
    if (key === "files" && data[key] instanceof FileList) {
      for (let i = 0; i < data[key].length; i++) {
        formData.append(key, data[key][i]);
      }
      continue;
    }
    if (data.hasOwnProperty(key)) {
      formData.append(key, data[key]);
    }
  }

  return formData;
}

export const getLoginUserRoute = (publicToken: string) => {
  return "/auth" + AUTH_CALLBACK_ROUTE + "?jwt=" + publicToken;
};

export const makeInitials = (name: string) => {
  const names = name.split(" ");
  let initials = "";
  names.forEach((n, i) => {
    if (i > 1) return;
    initials += n[0];
  });
  return initials;
};

export function generateColor(initial: string): {
  background: string;
  text: string;
} {
  // Convert the initial to uppercase for case insensitivity
  const upperInitial = initial.toUpperCase();

  // Generate a color based on the ASCII value of the first character
  const charCode = upperInitial.charCodeAt(0);
  const colorSeed = charCode % 360; // Using modulo to ensure the color value is between 0 and 359

  // Generate background color
  const backgroundColor = `hsl(${colorSeed}, 70%, 80%)`;

  // Generate text color (opposite of background color to ensure contrast)
  const textHue = (colorSeed + 180) % 360;
  const textColor = `hsl(${textHue}, 70%, 30%)`;

  return {
    background: backgroundColor,
    text: textColor,
  };
}

type MyClickEvent = MouseEvent & {
  target: HTMLElement;
};

type ClickAccessor = (e?: MyClickEvent) => void;

export function clickOutside(el: HTMLElement, accessor: ClickAccessor) {
  const onClick = (e: any) => !el.contains(e.target) && accessor(e);
  document.body.addEventListener("click", onClick);

  // onCleanup(() => document.body.removeEventListener("click", onClick));

  return {
    destroy() {
      document.body.removeEventListener("click", onClick);
    },
  };
}

export const formatPrice = (price: number, currency?: string) => {
  const formatter = new Intl.NumberFormat("en-NG");
  return `${currency ? currency : "₦"}${formatter.format(price)}`;
};

export const getDiscountAmount = (amount: number, discount?: number) => {
  if (!discount) return amount;
  const discountAmount = (amount / 100) * discount;
  return amount - discountAmount;
};

export function isOdd(number: number): boolean {
  return number % 2 !== 0;
}

export function safeParseJSON(json: string | Record<string, any>) {
  if (typeof json === "object") return json;
  try {
    return JSON.parse(json);
  } catch (e) {
    return json;
  }
}

export function copyPrevLocalStore(prev: any) {
  return {
    ...prev,
    ...(prev?.value || {}),
    value: null,
  };
}

export const getApiUrl = (path: string) => {
  return process.env.NEXT_PUBLIC_LATA_API_URL + path;
};

export const sortArray = (
  arr: any[],
  key: string,
  order: "asc" | "desc" = "asc",
) => {
  return arr.sort((a: any, b: any) => {
    if (a[key] < b[key]) {
      return order === "asc" ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return order === "asc" ? 1 : -1;
    }
    return 0;
  });
};

export async function copyTextToClipboard({
  text,
  inputId = "text-clipboard-input",
  toastMessage,
}: {
  text?: string;
  inputId: string;
  toastMessage?: string;
}) {
  const copyText = document.getElementById(inputId) as HTMLInputElement;
  if (copyText && !text) {
    // @ts-ignore
    copyText.select();
    // @ts-ignore
    copyText.setSelectionRange(0, 99999); /* For mobile devices */
    // @ts-ignore
    await navigator.clipboard.writeText(copyText.value);
    document.execCommand("copy");
    // @ts-ignore
    toast({
      title: toastMessage ?? `Copied ${copyText.value} to clipboard.`,
      variant: "success",
      duration: 15000,
    });
  } else if (text) {
    await navigator.clipboard.writeText(text);
    toast({
      title: toastMessage ?? `Copied ${copyText.value} to clipboard.`,
      variant: "success",
      duration: 15000,
    });
  }
}

export const logoutUser = async (
  clear: () => void,
  sessionTimeout: boolean = false,
) => {
  if (sessionTimeout) {
    toast({
      title: "Session Expired",
      description: "Please login again",
      variant: "destructive",
      duration: 15000,
    });
  }

  localStorage.clear();
  sessionStorage.clear();
  clearAllCookies();
  clear();
  await signOut({
    redirect: true,
    callbackUrl: "/auth" + LOGIN_ROUTE,
  });
};

export function formatNumber(num: number) {
  if (num < 1000000) {
    return num.toLocaleString(); // Display the number with commas for thousands separator
  }
  if (num >= 1e12) {
    return (num / 1e12).toFixed(1) + "T";
  }
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + "B";
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + "M";
  }
}
