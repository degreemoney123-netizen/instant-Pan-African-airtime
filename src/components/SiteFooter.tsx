import { Link } from "@tanstack/react-router";
import { waLink } from "@/lib/fastdata";

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-border bg-card px-4 pb-10 pt-6">
      <h2 className="text-base font-bold">FastData Telecom Enterprise</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Pan-African data, utility &amp; agent platform. Registered telecom reseller.
      </p>

      <dl className="mt-4 space-y-2 text-xs">
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Support hours</dt>
          <dd className="font-semibold">24/7 Live Support</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Email</dt>
          <dd className="font-semibold">
            <a href="mailto:support@fastdataafrica.com">support@fastdataafrica.com</a>
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">WhatsApp</dt>
          <dd className="font-semibold">
            <a href={waLink("Hello FastData Africa support!")} target="_blank" rel="noreferrer">
              +233 50 366 0497
            </a>
          </dd>
        </div>
      </dl>

      <nav className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
        <Link to="/terms" className="rounded-full bg-secondary px-3 py-1.5">
          Terms of Service
        </Link>
        <Link to="/privacy" className="rounded-full bg-secondary px-3 py-1.5">
          Privacy Policy
        </Link>
        <Link to="/refunds" className="rounded-full bg-secondary px-3 py-1.5">
          Refund Policy
        </Link>
        <Link to="/dashboard" className="rounded-full bg-secondary px-3 py-1.5">
          Merchant Dashboard
        </Link>
      </nav>

      <p className="mt-5 text-center text-[11px] text-muted-foreground">
        © {new Date().getFullYear()} FastData Telecom Enterprise · Serving West, East, Southern
        &amp; North Africa
      </p>
    </footer>
  );
}
