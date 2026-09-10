"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SessionUser } from "@/lib/session";
import type { NavItem, IconKey } from "@/lib/nav";
import { ROLE_LABELS, CONTRACT_LABELS, HOLAT_LABELS, holatTone } from "@/lib/labels";
import { logoutAction } from "@/lib/actions/auth";
import { btn } from "@/components/ui";
import type { Holat } from "@prisma/client";
import {
  IconHome,
  IconUsers,
  IconUser,
  IconClipboard,
  IconInbox,
  IconFile,
  IconEdit,
  IconChart,
  IconLogout,
  IconChevronDown,
  IconMenu,
  IconClose,
} from "@/components/icons";

const ICONS: Record<IconKey, (p: { className?: string }) => React.ReactNode> = {
  home: IconHome,
  users: IconUsers,
  user: IconUser,
  clipboard: IconClipboard,
  inbox: IconInbox,
  file: IconFile,
  edit: IconEdit,
  chart: IconChart,
};

function initials(fio: string) {
  return fio
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export interface MyRequest {
  id: string;
  turi: string;
  bolim: string;
  holat: Holat;
}

export function Shell({
  user,
  navItems,
  myRequests,
  children,
}: {
  user: SessionUser;
  navItems: NavItem[];
  myRequests: MyRequest[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileNav, setMobileNav] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/panel" ? pathname === "/panel" : pathname.startsWith(href);

  return (
    <div className="flex min-h-screen">
      {/* Mobil overlay */}
      {mobileNav && (
        <button
          aria-label="Menyuni yopish"
          onClick={() => setMobileNav(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-shrink-0 flex-col border-r border-border bg-surface p-5 transition-transform duration-200 md:static md:translate-x-0 ${
          mobileNav ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6">
          <p className="text-[15px] font-semibold">Kadr tizimi</p>
          <p className="text-xs text-text-mute">{ROLE_LABELS[user.role]} kabineti</p>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = ICONS[item.icon];
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNav(false)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors duration-200 ${
                  active
                    ? "bg-primary-tint font-medium text-primary-dark"
                    : "text-text-soft hover:bg-surface-2"
                }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <form action={logoutAction} className="mt-4 border-t border-border pt-4">
          <button type="submit" className={`${btn.base} ${btn.ghost} ${btn.sm} w-full`}>
            <IconLogout className="h-4 w-4" />
            Chiqish
          </button>
        </form>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-3 px-5 py-4 md:px-10 md:pt-6">
          <button
            aria-label="Menyu"
            onClick={() => setMobileNav(true)}
            className="cursor-pointer rounded-lg border border-border p-2 text-text-soft hover:bg-surface-2 md:hidden"
          >
            <IconMenu className="h-5 w-5" />
          </button>

          <div className="relative ml-auto">
            <button
              onClick={() => setProfileOpen((v) => !v)}
              aria-expanded={profileOpen}
              className="flex cursor-pointer items-center gap-2.5 rounded-full border border-border bg-surface py-1.5 pl-1.5 pr-3.5 transition-colors duration-200 hover:bg-surface-2"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-tint text-[13px] font-semibold text-primary-dark">
                {initials(user.fio)}
              </span>
              <span className="text-left leading-tight">
                <span className="block text-[13px] font-medium">{user.fio}</span>
                <span className="block text-[11px] text-text-mute">{user.lavozim}</span>
              </span>
              <IconChevronDown
                className={`h-3.5 w-3.5 text-text-mute transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {profileOpen && (
              <>
                <button
                  aria-label="Yopish"
                  onClick={() => setProfileOpen(false)}
                  className="fixed inset-0 z-30 cursor-default"
                />
                <div className="animate-in absolute right-0 top-12 z-40 w-[320px] rounded-card border border-border bg-surface p-5 shadow-pop">
                  <dl className="space-y-2 text-[13px]">
                    <Row k="F.I.O." v={user.fio} />
                    <Row k="Lavozim" v={user.lavozim} />
                    <Row k="Bo‘lim" v={user.bolim} />
                    {user.shartnoma && <Row k="Shartnoma" v={CONTRACT_LABELS[user.shartnoma]} />}
                    <Row k="Login" v={user.username} />
                  </dl>
                  <p className="mb-2 mt-4 text-xs text-text-mute">Mening arizalarim</p>
                  {myRequests.length ? (
                    <ul className="space-y-1.5">
                      {myRequests.map((r) => (
                        <li key={r.id} className="flex items-center justify-between gap-2 text-[13px]">
                          <span className="truncate">
                            {r.turi} · <span className="text-text-mute">{r.bolim}</span>
                          </span>
                          <MiniBadge holat={r.holat} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[13px] text-text-mute">Hali ariza yubormagansiz</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <main className="mx-auto w-full max-w-content flex-1 px-5 pb-12 pt-2 md:px-10">
          <div className="animate-in">{children}</div>
        </main>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-text-mute">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}

function MiniBadge({ holat }: { holat: Holat }) {
  const tone = holatTone(holat);
  const cls =
    tone === "ok"
      ? "bg-success-tint text-success"
      : tone === "no"
        ? "bg-danger-tint text-danger"
        : "bg-warn-tint text-warn";
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${cls}`}>
      {HOLAT_LABELS[holat]}
    </span>
  );
}
