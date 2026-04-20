import { redirect } from "next/navigation";

export default async function FeesIndexPage() {
  redirect(`/fees/invoices`);
}
