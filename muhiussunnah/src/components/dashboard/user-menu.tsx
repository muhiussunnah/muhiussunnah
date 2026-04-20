"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown, LifeBuoy, LogOut, UserCircle2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutAction } from "@/server/actions/auth";

/**
 * Avatar + name trigger that opens a dropdown with Profile, Support
 * Ticket, Logout — the "me menu" pattern every major SaaS uses.
 *
 * Implementation note: base-ui's Menu.Item MUST be rendered as its own
 * element (or via the `render` prop). Wrapping <DropdownMenuItem> in a
 * <Link> or <button> puts the Menu.Item inside someone else's DOM node,
 * which breaks focus management and throws at runtime. Use `render` to
 * swap the underlying element instead.
 */
export function UserMenu({
  name,
  photoUrl,
}: {
  name: string | null | undefined;
  photoUrl?: string | null;
}) {
  const displayName = name?.trim() || "প্রশাসক";
  const initials = buildInitials(displayName);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group/user flex cursor-pointer items-center gap-2 rounded-full border border-border/60 bg-card/70 px-1.5 py-1 pe-3 backdrop-blur transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/10">
        <span className="relative inline-flex size-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary/20 to-accent/20 ring-2 ring-background">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={displayName}
              width={36}
              height={36}
              className="size-full object-cover"
              unoptimized
            />
          ) : (
            <span className="text-sm font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
              {initials}
            </span>
          )}
        </span>
        <div className="hidden md:flex flex-col items-start leading-none">
          <span className="text-[10px] text-muted-foreground">স্বাগতম,</span>
          <span className="text-sm font-semibold text-foreground max-w-[120px] truncate">
            {displayName}
          </span>
        </div>
        <ChevronDown className="hidden md:inline size-4 text-muted-foreground transition-transform group-data-[popup-open]/user:rotate-180" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5 px-2 py-1.5">
          <span className="text-xs text-muted-foreground">লগইন রয়েছেন</span>
          <span className="font-semibold truncate">{displayName}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer px-2 py-2"
          render={<Link href="/settings" />}
        >
          <UserCircle2 className="me-2 size-4" />
          প্রোফাইল
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer px-2 py-2"
          render={<Link href="/tickets" />}
        >
          <LifeBuoy className="me-2 size-4" />
          সাপোর্ট টিকেট
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <form action={signOutAction}>
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer px-2 py-2 w-full"
            render={<button type="submit" />}
          >
            <LogOut className="me-2 size-4" />
            লগআউট
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function buildInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
