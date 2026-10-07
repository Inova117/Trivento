import { describe, expect, it } from "vitest";

import { contactSchema, whatsappLink } from "@/lib/contact";

describe("Formulario de visita", () => {
  const valid = {
    name: "María Andrade",
    whatsapp: "099 123 4567",
    email: "maria@correo.com",
    propertyType: "2 dormitorios" as const,
  };

  it("arma el link de WhatsApp con los datos y el número de ventas", () => {
    const url = whatsappLink(valid);

    expect(url.startsWith("https://wa.me/593999011888?text=")).toBe(true);
    const text = decodeURIComponent(url.split("text=")[1] ?? "");
    expect(text).toContain("Hola, quiero agendar una visita a Trivento.");
    expect(text).toContain("Nombre: María Andrade");
    expect(text).toContain("WhatsApp: 099 123 4567");
    expect(text).toContain("Correo: maria@correo.com");
    expect(text).toContain("Me interesa: 2 dormitorios");
  });

  it("rechaza un correo inválido antes de armar el link", () => {
    expect(contactSchema.safeParse({ ...valid, email: "no-es-correo" }).success).toBe(false);
  });

  it("rechaza un nombre demasiado corto", () => {
    expect(contactSchema.safeParse({ ...valid, name: "M" }).success).toBe(false);
  });
});