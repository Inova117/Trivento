import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createHash } from "crypto";

import { contactSchema } from "./contact";

export { contactSchema };
export type { ContactInput } from "./contact";

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const request = getRequest();
    const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for") ?? "unknown";
    const sourceHash = createHash("sha256").update(ip.split(",")[0]?.trim() ?? "unknown").digest("hex");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { count, error: rateError } = await supabaseAdmin
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      .eq("source_hash", sourceHash)
      .gte("created_at", since);

    if (rateError) throw new Error("No pudimos procesar tu solicitud.");
    if ((count ?? 0) >= 3) throw new Error("Has enviado varias solicitudes. Intenta nuevamente en unos minutos.");

    const { error } = await supabaseAdmin.from("contact_submissions").insert({
      name: data.name,
      whatsapp: data.whatsapp,
      email: data.email,
      property_type: data.propertyType,
      source_hash: sourceHash,
    });

    if (error) throw new Error("No pudimos guardar tu solicitud. Intenta nuevamente.");
    return { ok: true };
  });