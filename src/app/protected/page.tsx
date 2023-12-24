import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Protected() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  return (
    <div>
      <p>Protected page</p>
    </div>
  );
}
