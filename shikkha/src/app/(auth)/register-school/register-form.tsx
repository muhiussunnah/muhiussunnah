"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerSchoolAction, type ActionResult } from "@/server/actions/auth";

export function RegisterSchoolForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    registerSchoolAction,
    null,
  );

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success(state.message ?? "রেজিস্ট্রেশন সফল!");
      if (state.redirect) router.push(state.redirect);
    } else {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <form action={action} className="flex flex-col gap-4">
      <fieldset className="flex flex-col gap-4">
        <legend className="sr-only">স্কুলের তথ্য</legend>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="school_name_bn">স্কুলের নাম (বাংলা)</Label>
          <Input id="school_name_bn" name="school_name_bn" required placeholder="যেমন: দারুল উলুম কওমী মাদ্রাসা" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="school_name_en">School name (English, optional)</Label>
          <Input id="school_name_en" name="school_name_en" placeholder="e.g. Darul Uloom Qawmi Madrasa" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="school_type">প্রতিষ্ঠানের ধরন</Label>
            <Select name="school_type" defaultValue="school">
              <SelectTrigger id="school_type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="school">স্কুল</SelectItem>
                <SelectItem value="madrasa">মাদ্রাসা</SelectItem>
                <SelectItem value="both">স্কুল + মাদ্রাসা</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="eiin">EIIN (ঐচ্ছিক)</Label>
            <Input id="eiin" name="eiin" inputMode="numeric" />
          </div>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border-t border-border/60 pt-4">
        <legend className="sr-only">অ্যাডমিনের তথ্য</legend>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="admin_full_name">আপনার নাম</Label>
          <Input id="admin_full_name" name="admin_full_name" required />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="admin_email">ইমেইল</Label>
            <Input
              id="admin_email"
              name="admin_email"
              type="email"
              required
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="admin_phone">ফোন (ঐচ্ছিক)</Label>
            <Input id="admin_phone" name="admin_phone" type="tel" inputMode="tel" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="admin_password">পাসওয়ার্ড (৮+ অক্ষর)</Label>
          <Input
            id="admin_password"
            name="admin_password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>
      </fieldset>

      {state && !state.ok ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="mt-2 bg-gradient-primary text-white">
        {pending ? "তৈরি হচ্ছে..." : "স্কুল তৈরি করুন"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        রেজিস্টার করে আপনি আমাদের Terms ও Privacy Policy-তে সম্মত হচ্ছেন।
      </p>
    </form>
  );
}
