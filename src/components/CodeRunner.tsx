"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type RunState = "idle" | "success" | "fail" | "error";

type Props = {
  starterCode: string;
  expectedOutput: string | null;
  onSuccess: () => void;
};

function normalize(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

export function CodeRunner({ starterCode, expectedOutput, onSuccess }: Props) {
  const t = useTranslations("lesson");
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState<string[]>([]);
  const [hasRun, setHasRun] = useState(false);
  const [state, setState] = useState<RunState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function run() {
    const logs: string[] = [];
    const say = (...args: unknown[]) => {
      if (logs.length >= 500) {
        throw new Error("Too much output — is there an endless loop?");
      }
      logs.push(args.map((a) => String(a)).join(" "));
    };

    setHasRun(true);
    try {
      // Kid-friendly sandbox: `say`, `print` and `console.log` all write to
      // the output panel instead of the real console.
      const fn = new Function("say", "print", "console", `"use strict";\n${code}`);
      fn(say, say, { log: say });
      setOutput(logs);

      const passed =
        expectedOutput === null ||
        normalize(logs.join("\n")) === normalize(expectedOutput);
      if (passed) {
        setState("success");
        onSuccess();
      } else {
        setState("fail");
      }
    } catch (e) {
      setOutput(logs);
      setErrorMessage(e instanceof Error ? e.message : String(e));
      setState("error");
    }
  }

  return (
    <div className="space-y-3">
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        rows={Math.max(8, code.split("\n").length + 2)}
        className="w-full resize-y rounded-2xl border-4 border-violet-200 bg-slate-900 p-4 font-mono text-sm leading-6 text-emerald-300 shadow-inner outline-none focus:border-brand-light"
        aria-label="Code editor"
      />

      <button
        onClick={run}
        className="w-full rounded-2xl bg-success px-6 py-3 font-display text-lg font-semibold text-white shadow-lg shadow-emerald-200 transition hover:brightness-110 active:scale-[0.98] sm:w-auto"
      >
        {t("run")}
      </button>

      <div className="rounded-2xl border-4 border-slate-200 bg-slate-50 p-4">
        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
          {t("output")}
        </p>
        {!hasRun ? (
          <p className="text-sm text-slate-400">{t("outputEmpty")}</p>
        ) : (
          <pre className="whitespace-pre-wrap font-mono text-sm text-slate-800">
            {output.join("\n") || " "}
          </pre>
        )}
      </div>

      {state === "success" && (
        <div className="rounded-2xl bg-emerald-100 px-4 py-3 font-bold text-emerald-800">
          {t("success")}
        </div>
      )}
      {state === "fail" && (
        <div className="rounded-2xl bg-amber-100 px-4 py-3 font-bold text-amber-800">
          {t("tryAgain")}
        </div>
      )}
      {state === "error" && (
        <div className="rounded-2xl bg-rose-100 px-4 py-3 font-bold text-rose-800">
          {t("error", { message: errorMessage })}
        </div>
      )}
    </div>
  );
}
