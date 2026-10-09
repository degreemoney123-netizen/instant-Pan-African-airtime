import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const bodySchema = z.object({
  // Unguessable payment reference acts as the caller's proof of ownership.
  reference: z.string().min(6).max(64),
});

export const Route = createFileRoute("/api/public/fulfill-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        const parsed = bodySchema.safeParse(body);
        if (!parsed.success) {
          return Response.json({ error: "Invalid reference" }, { status: 400 });
        }

        try {
          const { fulfillOrder } = await import("@/lib/fulfill.server");
          const result = await fulfillOrder(parsed.data.reference);
          const status = result.status === "Not Found" ? 404 : 200;
          return Response.json(result, { status });
        } catch (err) {
          console.error("Fulfillment failed", err);
          return Response.json({ error: "Fulfillment failed" }, { status: 500 });
        }
      },
    },
  },
});
