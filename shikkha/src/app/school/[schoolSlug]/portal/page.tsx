import { CalendarCheck, CreditCard } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { requireRole } from "@/lib/auth/session";
import { PORTAL_ROLES } from "@/lib/auth/roles";
import { formatDualDate } from "@/lib/utils/date";

type PageProps = { params: Promise<{ schoolSlug: string }> };

export default async function PortalHomePage({ params }: PageProps) {
  const { schoolSlug } = await params;
  const membership = await requireRole(schoolSlug, PORTAL_ROLES);
  const today = formatDualDate(new Date(), { withWeekday: true });

  const greeting = membership.role === "PARENT"
    ? `আসসালামু আলাইকুম, ${membership.full_name_bn ?? "অভিভাবক"}`
    : `স্বাগতম, ${membership.full_name_bn ?? "শিক্ষার্থী"}`;

  return (
    <>
      <PageHeader
        title={greeting}
        subtitle={`আজ ${today}`}
        impact={[{ label: "✨ সব কিছু ঠিকঠাক চলছে!", tone: "success" }]}
      />

      <EmptyState
        icon={<CalendarCheck className="size-8" />}
        title="আপনার তথ্য এখানে দেখাবে"
        body="স্কুল যখন আপনাকে যোগ করবে, আজকের attendance, ফলাফল, বকেয়া ফি এবং নোটিশ এখানে দেখতে পাবেন।"
        primaryAction={
          <a href={`/school/${schoolSlug}/portal/fees`} className="rounded-md bg-gradient-primary px-4 py-2 text-sm font-medium text-white">
            <CreditCard className="me-1.5 inline size-4" /> ফি পেমেন্ট
          </a>
        }
        proTip="অভিভাবক হিসেবে প্রোফাইলে গিয়ে আপনার সন্তানের সাথে যুক্ত হন।"
      />
    </>
  );
}
