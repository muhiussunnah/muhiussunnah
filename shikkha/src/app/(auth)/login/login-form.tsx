"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAction, type ActionResult } from "@/server/actions/auth";

type Props = {
  next?: string;
};

export function LoginForm({ next = "/" }: Props) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    signInAction,
    null,
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">ইমেইল</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="principal@school.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">পাসওয়ার্ড</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          minLength={6}
        />
      </div>

      {state && !state.ok ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="mt-2 bg-gradient-primary text-white">
        {pending ? "লগইন হচ্ছে..." : "লগইন করুন"}
      </Button>
    </form>
  );
}
