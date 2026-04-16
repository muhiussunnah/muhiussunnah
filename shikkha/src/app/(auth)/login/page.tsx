import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "লগইন",
  description: "আপনার স্কুল ড্যাশবোর্ডে প্রবেশ করুন।",
};

type PageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const { next = "/" } = await searchParams;

  return (
    <Card className="border-border/60 shadow-hover">
      <CardHeader className="gap-1 pb-2">
        <CardTitle className="text-2xl">আবার স্বাগতম</CardTitle>
        <p className="text-sm text-muted-foreground">
          আপনার স্কুল ড্যাশবোর্ডে প্রবেশ করুন।
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <LoginForm next={next} />
        <div className="flex flex-col gap-1.5 border-t border-border/60 pt-4 text-center text-sm text-muted-foreground">
          <span>
            নতুন স্কুল?{" "}
            <Link
              href="/register-school"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              রেজিস্টার করুন
            </Link>
          </span>
          <Link
            href="/forgot-password"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            পাসওয়ার্ড ভুলে গেছেন?
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
