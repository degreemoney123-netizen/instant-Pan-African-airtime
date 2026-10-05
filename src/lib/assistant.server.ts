import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type ModelMessage, type UIMessage } from "ai";
import { z } from "zod";

const LOVABLE_AIG_RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";

function createLovableAiGatewayRunIdFetch(initialRunId?: string) {
  let runId = initialRunId?.trim() || undefined;
  return {
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has(LOVABLE_AIG_RUN_ID_HEADER)) {
        headers.set(LOVABLE_AIG_RUN_ID_HEADER, runId);
      }
      const response = await fetch(input, { ...init, headers });
      const minted = response.headers.get(LOVABLE_AIG_RUN_ID_HEADER)?.trim();
      if (!runId && minted) runId = minted;
      return response;
    },
    getRunId: () => runId,
  };
}

function getLovableAiGatewayRunId(request: Request) {
  return request.headers.get(LOVABLE_AIG_RUN_ID_HEADER)?.trim() || undefined;
}

const SYSTEM_PROMPT = `You are the FastData Assistant for FastData Africa (fastdataafrica.com), a pan-African platform selling non-expiry mobile data bundles, airtime and utility bill payments in 55 African markets.

FACTS YOU KNOW:
- Bundles never expire and are delivered automatically, typically within 1–15 minutes after payment.
- Prices differ per country and per network; the site shows prices in each country's local currency. Example (Ghana, MTN): 1GB from GH₵ 6, 2GB from GH₵ 11, 5GB from GH₵ 26. For other countries, tell the user to select their country on the home page to see exact local prices rather than inventing numbers.
- Payment: Paystack (cards + mobile money) and direct Mobile Money. In Ghana: MTN MoMo merchant 0503660497 and Telecel Cash. Other countries have local options (M-Pesa, Orange Money, Airtel Money, bank transfer) shown on the site. Card payments are launching soon in some markets.
- New customers: code FIRST10 gives 10% off the first order.
- Loyalty: every purchase earns points (Bronze → Silver → Gold → Platinum tiers) and customers can save favourite recipient numbers for one-tap reordering.
- Referrals: customers get a personal referral link and earn points when friends order.
- Vendor/agent programme: Starter and VIP registration plans with wholesale pricing; vendors resell at retail and keep the margin. Registration and support happen in-app or via WhatsApp.
- Order tracking: the "Track order" section on the home page shows live status (Placed → Verified → Processing → Delivered) using the recipient phone number.
- Support: 24/7 — WhatsApp +233 503660497, email support@fastdataafrica.com, or the Contact page.
- Utilities: electricity (ECG), TV subscriptions and water bills can be paid through the "Local Utility & Daily Services" section (Ghana first, expanding).

RULES:
- Reply in the language the customer writes in (English, French, Kiswahili or Twi).
- Be warm, concise (under 120 words unless listing bundles) and sales-oriented: always end with a clear next step (buy, register, track, or contact support).
- Never ask for or repeat full payment credentials, PINs or passwords.
- If asked something you don't know (exact price for an unlisted country/size, delivery delay), say what you know, and point to WhatsApp support for a guaranteed answer.
- Never promise delivery times faster than 1–15 minutes.`;

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        id: z.string(),
        role: z.enum(["user", "assistant"]),
        parts: z.array(
          z.object({
            type: z.string(),
            text: z.string().max(4000).optional(),
          }),
        ),
      }),
    )
    .min(1)
    .max(24),
});

export function handleAssistant(request: Request) {
  return (async () => {
    let parsed: z.infer<typeof bodySchema>;
    try {
      const json = await request.json();
      parsed = bodySchema.parse(json);
    } catch {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      return Response.json({ error: "Assistant is not configured" }, { status: 500 });
    }

    const uiMessages = parsed.messages as unknown as UIMessage[];
    let history: ModelMessage[];
    try {
      history = await convertToModelMessages(uiMessages);
    } catch {
      return Response.json({ error: "Invalid messages" }, { status: 400 });
    }

    const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
    const provider = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
      fetch: runIdFetch.fetch,
    });

    const result = streamText({
      model: provider.responses("openai/gpt-6-astra"),
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
      abortSignal: request.signal,
      providerOptions: {
        openai: {
          store: false,
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          include: ["reasoning.encrypted_content"],
        },
      },
    });

    return withRunIdHeader(
      result.toUIMessageStreamResponse({ sendReasoning: false, onError: () => "The assistant hit a snag. Please try again." }),
      runIdFetch,
    );
  })();
}

function withRunIdHeader(response: Response, gateway: { getRunId: () => string | undefined }) {
  const headers = new Headers(response.headers);
  const runId = gateway.getRunId();
  if (runId) headers.set(LOVABLE_AIG_RUN_ID_HEADER, runId);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
