import z from "zod";
import { settingsSchema } from "@/store/schemas/settingsSchema";

export const checkIfInputNumber = (value: string): boolean => {
  if (!value) return false;
  return !isNaN(Number(value));
};

export function formatNigerianPhoneNumber(phoneNumber: string): string | null {
  // Remove any non-digit characters from the input
  const digitsOnly = phoneNumber.replace(/\D/g, "");

  // Check if the phone number has the correct length for Nigerian numbers (11 digits)
  if (digitsOnly.length === 11) {
    // If the number starts with "0", replace it with "234" to get the international format
    if (digitsOnly.startsWith("0")) {
      return `234${digitsOnly.slice(1)}`;
    }
    // If the number starts with "234", return it as it is since it's already in international format
  } else if (digitsOnly.startsWith("234")) {
    return digitsOnly;
  }

  // If the input doesn't match the expected Nigerian phone number format, return null
  return null;
}

export function makePhoneCall(phoneNumber: string): void {
  const phoneNumberWithoutSpaces = phoneNumber.replace(/\s/g, ""); // Remove any spaces from the phone number

  // Create an anchor element
  const link = document.createElement("a");

  // Set the href attribute to the phone number prefixed with 'tel:'
  link.href = `tel:${convertToShortNigerianPhoneNumber(
    phoneNumberWithoutSpaces,
  )}`;

  // Programmatically click the anchor element to initiate the phone call
  link.click();
}

export function convertToShortNigerianPhoneNumber(phoneNumber: string): string {
  // Remove any non-digit characters from the input
  const digitsOnly = phoneNumber.replace(/\D/g, "");

  // Check if the phone number starts with "234" or "0" followed by 10 digits
  if (
    (digitsOnly.startsWith("234") && digitsOnly.length === 13) ||
    (digitsOnly.startsWith("0") && digitsOnly.length === 11)
  ) {
    // If the number starts with "234", replace it with "0"
    if (digitsOnly.startsWith("234")) {
      return `0${digitsOnly.slice(3)}`;
    }
    // If the number is already in the short format "0xxxx", return it as it is
    return digitsOnly;
  }

  // If the input doesn't match the expected formats, return the original input
  return phoneNumber;
}

export function searchString(searchString: string, targetString?: string) {
  const escapedSearchString = searchString.replace(
    /[-/\\^$*+?.()|[\]{}]/g,
    "\\$&",
  );
  const regex = new RegExp(escapedSearchString.split("").join(".*"), "i");
  if (!targetString) return false;
  return regex.test(targetString);
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  } else {
    return text.substring(0, maxLength - 3) + "...";
  }
}

export const formSetErrors = (errorObject: Record<any, any>, setError: any) => {
  const errorArray = Object.entries(errorObject);
  errorArray.forEach(([key, value]) => {
    setError(key as keyof z.infer<typeof settingsSchema>, {
      type: "manual",
      message: value,
    });
  });
};
