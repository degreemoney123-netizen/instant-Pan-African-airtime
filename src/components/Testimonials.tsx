const REVIEWS = [
  {
    quote:
      "Started with the GH₵ 100 VIP plan in Kumasi. I average GH₵ 120 profit daily selling to university students!",
    name: "Kwame A.",
    place: "Kumasi, Ghana",
  },
  {
    quote: "Fast delivery for ECG bills and data top-ups. My customers love the speed.",
    name: "Grace T.",
    place: "Accra, Ghana",
  },
];

export function Testimonials() {
  return (
    <section className="mt-8 px-4">
      <h2 className="text-xl font-bold">What Our Authorized Agents Say</h2>
      <p className="text-sm text-muted-foreground">
        Verified agents trading on FastData Africa every day.
      </p>
      <div className="mt-4 space-y-3">
        {REVIEWS.map((r) => (
          <figure
            key={r.name}
            className="rounded-2xl border border-border bg-card p-4 shadow-card"
          >
            <div className="text-sm text-mtn" aria-label="5 out of 5 stars">
              ★★★★★
            </div>
            <blockquote className="mt-2 text-sm leading-relaxed">“{r.quote}”</blockquote>
            <figcaption className="mt-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {r.name.charAt(0)}
              </span>
              <span className="text-xs">
                <span className="block font-bold">{r.name}</span>
                <span className="text-muted-foreground">{r.place} · Verified agent</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
