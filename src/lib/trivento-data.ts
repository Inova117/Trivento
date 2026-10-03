export const places = ["Quito", "Cumbayá", "Sangolquí"] as const;

export const typologies = [
  { type: "Tipo A", bedrooms: "3 dormitorios", area: "75.67 m²", price: "$80,594", payment: "$689" },
  { type: "Tipo B", bedrooms: "2 dormitorios", area: "59.03 m²", price: "$63,971", payment: "$547" },
  { type: "Tipo C", bedrooms: "1 dormitorio", area: "43.36 m²", price: "$48,316", payment: "$413" },
  { type: "Tipo E", bedrooms: "1 dormitorio", area: "29.44 m²", price: "$34,411", payment: "$294" },
  { type: "Tipo D", bedrooms: "1 dormitorio", area: "23.34 m²", price: "$28,317", payment: "$242" },
] as const;

export const financing = {
  downPayment: "50%",
  downPaymentTerms: "De 12 a 60 cuotas mensuales",
  credit: "50%",
  creditTerms: "20 años plazo · 5% de interés",
  creditFrom: "$93 al mes",
} as const;