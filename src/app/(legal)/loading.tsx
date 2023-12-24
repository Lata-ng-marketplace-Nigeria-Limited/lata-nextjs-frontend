import PageSuspense from "@molecule/PageSuspense";

export default function Loading() {
  return (
    <PageSuspense
      useCenterStyle
      loadingText={"Getting latest data please wait..."}
    />
  );
}
