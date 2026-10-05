import { useState } from "react";
import { Globe } from "lucide-react";
import { LANGS, useLang, type Lang } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const active = LANGS.find((l) => l.id === lang) ?? LANGS[0]!;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-primary-foreground/25 px-3 py-1 text-[11px] font-bold"
        aria-label={t("lang")}
      >
        <Globe className="size-3.5" />
        {active.short}
      </button>
      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-2xl border border-border bg-card shadow-pop">
            <p className="border-b border-border px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {t("lang")}
            </p>
            {LANGS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => {
                  setLang(l.id as Lang);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold ${
                  l.id === lang ? "bg-secondary text-foreground" : "hover:bg-secondary/60"
                }`}
              >
                <span>{l.flag}</span>
                {l.label}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
