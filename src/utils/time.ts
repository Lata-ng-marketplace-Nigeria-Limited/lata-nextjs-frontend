import { DateTime } from "luxon";

export function getTimeFromNow(dateString: string): string {
  const targetDate = DateTime.fromISO(dateString);

  const diff = targetDate
    .diffNow(["years", "months", "days", "hours", "minutes", "seconds"])
    .toObject();

  if (diff.years && Math.abs(diff.years) >= 2) {
    return `${Math.abs(diff.years)} years`;
  }
  if (diff.years && Math.abs(diff.years) === 1) {
    return "1 year";
  }
  if (diff.months && Math.abs(diff.months) >= 2) {
    return `${Math.abs(diff.months)} months`;
  }
  if (diff.months && Math.abs(diff.months) === 1) {
    return "1 month";
  }
  if (diff.days && Math.abs(diff.days) >= 2) {
    return `${Math.abs(diff.days)} days`;
  }
  if (diff.days && Math.abs(diff.days) === 1) {
    return "yesterday";
  }
  if (diff.hours && Math.abs(diff.hours) >= 1) {
    return `${Math.abs(diff.hours)} hours`;
  }
  if (diff.minutes && Math.abs(diff.minutes) >= 1) {
    return `${Math.abs(diff.minutes)} minutes`;
  }
  if (diff.seconds && Math.abs(diff.seconds) >= 1) {
    return `${Math.floor(Math.abs(diff.seconds))} seconds`;
  }

  return "few seconds";
}
