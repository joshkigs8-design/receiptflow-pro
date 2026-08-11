import { Link } from "@tanstack/react-router";
import { Building2 } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="gradient-primary flex size-9 items-center justify-center rounded-xl">
              <Building2 className="size-5 text-primary-foreground" />
            </span>
            <span className="font-display font-bold">Rent Receipt Pro</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            A Codevanta Ventures product. Premium property management and QR-verified digital
            rent receipts.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Product</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><a href="/#features" className="hover:text-foreground">Features</a></li>
            <li><a href="/#pricing" className="hover:text-foreground">Pricing</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Access</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/auth" className="hover:text-foreground">Landlord login</Link></li>
            <li><Link to="/tenant" className="hover:text-foreground">Tenant portal</Link></li>
            <li><Link to="/verify" className="hover:text-foreground">Verify a receipt</Link></li>
            <li><Link to="/download" className="hover:text-foreground">Android app</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Contact</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>WhatsApp: 0742868209</li>
            <li>Nairobi, Kenya</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-6 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Codevanta Ventures. All rights reserved.
      </div>
    </footer>
  );
}