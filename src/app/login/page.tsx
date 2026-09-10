import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { LoginForm } from "@/components/LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/panel");
  return <LoginForm />;
}
