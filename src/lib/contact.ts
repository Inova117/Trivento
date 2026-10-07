import { z } from "zod";

/** Número de ventas de Trivento (WhatsApp). */
export const SALES_WHATSAPP = "593999011888";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Ingresa tu nombre.").max(100),
  whatsapp: z.string().trim().regex(/^\+?[0-9 ()-]{7,30}$/, "Ingresa un WhatsApp válido."),
  email: z.string().trim().email("Ingresa un correo válido.").max(255),
  propertyType: z.enum(["1 dormitorio", "2 dormitorios", "3 dormitorios"]),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Arma el mensaje con los datos del formulario y lo abre en el WhatsApp de ventas. */
export function whatsappLink(data: ContactInput): string {
  const text = [
    "Hola, quiero agendar una visita a Trivento.",
    `Nombre: ${data.name}`,
    `WhatsApp: ${data.whatsapp}`,
    `Correo: ${data.email}`,
    `Me interesa: ${data.propertyType}`,
  ].join("\n");

  return `https://wa.me/${SALES_WHATSAPP}?text=${encodeURIComponent(text)}`;
}