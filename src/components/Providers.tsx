"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

export function Providers({
  session,
  children,
}: {
  /** Server-fetched session: lets a remount (e.g. locale change) start as
      authenticated/unauthenticated immediately instead of "loading". */
  session: Session | null;
  children: React.ReactNode;
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
