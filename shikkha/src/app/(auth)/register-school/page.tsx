import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterSchoolForm } from "./register-form";

export const metadata: Metadata = {
  title: "স্কুল রেজিস্টার করুন",
};

export default function RegisterSchoolPage() {
  return (
    <Card className="border-border/60 shadow-hover">
      <CardHeader className="gap-1 pb-2">
        <CardTitle className="text-2xl">নতুন স্কুল রেজিস্টার</CardTitle>
        <p className="text-sm text-muted-foreground">
          ৩০ দিনের ফ্রি ট্রায়াল · কোন কার্ড লাগবে না · ৫ মিনিটে সেটআপ
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <RegisterSchoolForm />
        <div className="border-t border-border/60 pt-4 text-center text-sm text-muted-foreground">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            লগইন করুন
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
