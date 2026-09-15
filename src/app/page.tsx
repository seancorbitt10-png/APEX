import { redirect } from "next/navigation";
import { hasSession } from "@/lib/auth/session";

export default async function HomePage() {
  if (await hasSession()) {
    redirect("/dashboard");
  }
  redirect("/login");
}
