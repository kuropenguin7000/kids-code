"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { clearProgress } from "@/lib/progress";
import { useAccess } from "@/lib/useAccess";

/**
 * Two-tap reset for locally stored (anonymous) progress. Signed-in users
 * keep their progress in the database, so the button is hidden for them.
 */
export function ResetProgress() {
  const t = useTranslations("learn");
  const { hydrated, signedIn } = useAccess();
  const [armed, setArmed] = useState(false);

  if (!hydrated || signedIn) return null;

  function onClick() {
    if (armed) {
      clearProgress();
      setArmed(false);
    } else {
      setArmed(true);
    }
  }

  return (
    <div className="pt-2 text-center">
      <button
        onClick={onClick}
        onBlur={() => setArmed(false)}
        className={`rounded-full border-2 px-4 py-2 text-xs font-bold transition ${
          armed
            ? "border-rose-300 bg-rose-50 text-rose-700"
            : "border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-600"
        }`}
      >
        {armed ? `⚠️ ${t("resetConfirm")}` : `🔄 ${t("resetProgress")}`}
      </button>
    </div>
  );
}
