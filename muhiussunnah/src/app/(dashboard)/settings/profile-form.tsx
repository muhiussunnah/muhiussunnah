"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Camera, Lock, Mail, Upload, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  updateProfileNameAction,
  updateProfileEmailAction,
  updateProfilePasswordAction,
  updateProfilePhotoAction,
} from "@/server/actions/profile";
import type { ActionResult } from "@/server/actions/_helpers";

type Props = {
  schoolSlug: string;
  currentEmail: string;
  currentFullName: string;
  currentPhotoUrl: string | null;
};

type Tab = "photo" | "name" | "email" | "password";

export function ProfileForm({ schoolSlug, currentEmail, currentFullName, currentPhotoUrl }: Props) {
  const [tab, setTab] = useState<Tab>("photo");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-1.5 rounded-xl border border-border/60 bg-card/60 p-1">
        {(["photo", "name", "email", "password"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition",
              tab === k
                ? "bg-gradient-primary text-white shadow-sm"
                : "text-muted-foreground hover:bg-primary/5 hover:text-foreground",
            )}
          >
            {k === "photo" ? <Camera className="size-3.5" /> : null}
            {k === "name" ? <User className="size-3.5" /> : null}
            {k === "email" ? <Mail className="size-3.5" /> : null}
            {k === "password" ? <Lock className="size-3.5" /> : null}
            {k === "photo" ? "ছবি" : k === "name" ? "নাম" : k === "email" ? "ইমেইল" : "পাসওয়ার্ড"}
          </button>
        ))}
      </div>

      {tab === "photo" ? (
        <PhotoForm schoolSlug={schoolSlug} current={currentPhotoUrl} name={currentFullName} />
      ) : null}
      {tab === "name" ? (
        <NameForm current={currentFullName} schoolSlug={schoolSlug} />
      ) : null}
      {tab === "email" ? (
        <EmailForm current={currentEmail} schoolSlug={schoolSlug} />
      ) : null}
      {tab === "password" ? <PasswordForm schoolSlug={schoolSlug} /> : null}
    </div>
  );
}

function PhotoForm({
  schoolSlug,
  current,
  name,
}: {
  schoolSlug: string;
  current: string | null;
  name: string;
}) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    updateProfilePhotoAction,
    null,
  );
  const [preview, setPreview] = useState<string | null>(current);
  const [dataUrl, setDataUrl] = useState<string>(""); // "" | dataUrl | "__REMOVE__"
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success(state.message ?? "ছবি আপডেট হয়েছে");
      setDataUrl(""); // reset so subsequent saves don't re-submit the same payload
    } else {
      toast.error(state.error);
    }
  }, [state]);

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("শুধু ছবি নির্বাচন করুন।");
      return;
    }
    if (file.size > 500 * 1024) {
      toast.error("ছবি ৫০০ KB এর বেশি হতে পারে না।");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setPreview(url);
      setDataUrl(url);
    };
    reader.readAsDataURL(file);
  }

  function removePhoto() {
    setPreview(null);
    setDataUrl("__REMOVE__");
    if (fileRef.current) fileRef.current.value = "";
  }

  const initials = buildInitials(name);

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="schoolSlug" value={schoolSlug} />
      <input type="hidden" name="photo_data_url" value={dataUrl} />

      <div className="flex items-center gap-5">
        {/* Avatar preview */}
        <div className="relative">
          <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-gradient-to-br from-primary/10 to-accent/10">
            {preview ? (
              <Image
                src={preview}
                alt="Profile preview"
                width={96}
                height={96}
                className="size-full object-cover"
                unoptimized
              />
            ) : (
              <span className="text-3xl font-extrabold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                {initials}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex-1 flex flex-col gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={onPickFile}
            className="hidden"
          />
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="size-3.5 me-1" />
              ছবি আপলোড
            </Button>
            {preview ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={removePhoto}
                className="text-destructive hover:bg-destructive/10"
              >
                <X className="size-3.5 me-1" />
                সরান
              </Button>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            PNG / JPG / WebP · সর্বোচ্চ ৫০০ KB · বর্গাকার (১:১) ছবি ভালো দেখায়।
            সাইডবার + হেডারের অ্যাভাটারে দেখা যাবে।
          </p>
        </div>
      </div>

      <Button
        type="submit"
        disabled={pending || !dataUrl}
        className="bg-gradient-primary text-white w-fit"
      >
        {pending ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ"}
      </Button>
    </form>
  );
}

function NameForm({ schoolSlug, current }: { schoolSlug: string; current: string }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    updateProfileNameAction,
    null,
  );
  useEffect(() => {
    if (!state) return;
    if (state.ok) toast.success(state.message ?? "আপডেট হয়েছে");
    else toast.error(state.error);
  }, [state]);

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="schoolSlug" value={schoolSlug} />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="full_name_bn">আপনার নাম</Label>
        <Input id="full_name_bn" name="full_name_bn" required defaultValue={current} />
      </div>
      <Button type="submit" disabled={pending} className="bg-gradient-primary text-white w-fit">
        {pending ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ"}
      </Button>
    </form>
  );
}

function EmailForm({ schoolSlug, current }: { schoolSlug: string; current: string }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    updateProfileEmailAction,
    null,
  );
  useEffect(() => {
    if (!state) return;
    if (state.ok) toast.success(state.message ?? "লিংক পাঠানো হয়েছে");
    else toast.error(state.error);
  }, [state]);

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="schoolSlug" value={schoolSlug} />
      <div className="flex flex-col gap-1.5">
        <Label>বর্তমান ইমেইল</Label>
        <Input value={current} disabled className="opacity-60" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="new_email">নতুন ইমেইল</Label>
        <Input id="new_email" name="new_email" type="email" required autoComplete="email" />
      </div>
      <p className="text-xs text-muted-foreground">
        🔐 নিরাপত্তার জন্য পুরনো ও নতুন উভয় ইমেইলে কনফার্মেশন লিংক যাবে।
      </p>
      <Button type="submit" disabled={pending} className="bg-gradient-primary text-white w-fit">
        {pending ? "পাঠানো হচ্ছে..." : "ইমেইল পরিবর্তন"}
      </Button>
    </form>
  );
}

function PasswordForm({ schoolSlug }: { schoolSlug: string }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    updateProfilePasswordAction,
    null,
  );
  useEffect(() => {
    if (!state) return;
    if (state.ok) toast.success(state.message ?? "পাসওয়ার্ড আপডেট হয়েছে");
    else toast.error(state.error);
  }, [state]);

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="schoolSlug" value={schoolSlug} />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="new_password">নতুন পাসওয়ার্ড (৮+ অক্ষর)</Label>
        <Input
          id="new_password"
          name="new_password"
          type="password"
          minLength={8}
          required
          autoComplete="new-password"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirm_password">পাসওয়ার্ড নিশ্চিত করুন</Label>
        <Input
          id="confirm_password"
          name="confirm_password"
          type="password"
          minLength={8}
          required
          autoComplete="new-password"
        />
      </div>
      <Button type="submit" disabled={pending} className="bg-gradient-primary text-white w-fit">
        {pending ? "সংরক্ষণ হচ্ছে..." : "পাসওয়ার্ড পরিবর্তন"}
      </Button>
    </form>
  );
}

function buildInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
