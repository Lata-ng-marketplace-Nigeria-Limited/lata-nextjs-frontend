import PageSuspense from "@molecule/PageSuspense";

export default function Loading() {
  return <PageSuspense loadingText={"Verifying..."} />;
}
