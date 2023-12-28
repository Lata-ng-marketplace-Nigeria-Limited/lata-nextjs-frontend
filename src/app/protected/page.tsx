import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@authConfig";

export default async function Protected() {
  const session = await getServerSession(authConfig);

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  return (
    <div>
      <p>Protected page</p>
    </div>
  );
}
