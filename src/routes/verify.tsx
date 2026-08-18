import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/app/Field";

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [
      { title: "Verify a Receipt — Rent Receipt Pro" },
      {
        name: "description",
        content:
          "Check that a rent receipt is genuine by entering its verification code or scanning its QR code.",
      },
      { property: "og:title", content: "Verify a Receipt — Rent Receipt Pro" },
      { property: "og:description", content: "Confirm a rent receipt is authentic." },
    ],
  }),
  component: VerifyPage,
});

function VerifyPage() {
  const navigate = useNavigate();
  const [id, setId] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="surface-card w-full max-w-md p-8">
        <span className="gradient-primary inline-flex size-11 items-center justify-center rounded-2xl shadow-glow">
          <QrCode className="size-5 text-primary-foreground" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold">Verify a receipt</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Scan the QR code on the receipt, or paste its verification code below.
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/receipt/$publicId", params: { publicId: id.trim() } });
          }}
        >
          <Field label="Verification code" htmlFor="pid">
            <Input
              id="pid"
              required
              minLength={6}
              maxLength={64}
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </Field>
          <Button type="submit" className="w-full rounded-full shadow-glow">
            Verify
          </Button>
        </form>
      </div>
    </div>
  );
}
