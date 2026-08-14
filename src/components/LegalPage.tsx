import { Link } from "@tanstack/react-router";

export function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
}) {
  return (
    <div className="min-h-screen">
      <header className="bg-hero px-4 pb-10 pt-6 text-primary-foreground">
        <div className="mx-auto max-w-md">
          <Link to="/" className="text-xs font-bold text-primary-foreground/80">
            ← Back to FastData Africa
          </Link>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight">{title}</h1>
          <p className="mt-2 text-sm text-primary-foreground/80">{intro}</p>
        </div>
      </header>
      <main className="mx-auto -mt-4 max-w-md px-4 pb-16">
        <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-base font-bold">{s.heading}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </section>
          ))}
          <p className="text-xs text-muted-foreground">
            Questions? Email support@fastdataafrica.com or WhatsApp +233 50 366 0497.
          </p>
        </div>
      </main>
    </div>
  );
}
