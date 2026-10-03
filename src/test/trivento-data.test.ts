import { describe, expect, it } from "vitest";

import { financing, places, typologies } from "@/lib/trivento-data";

describe("Trivento commercial information", () => {
  it("shows every destination as 15 minutes away", () => {
    expect(places).toEqual(["Quito", "Cumbayá", "Sangolquí"]);
  });

  it("keeps the five typologies and their published areas", () => {
    expect(typologies.map(({ type, area }) => ({ type, area }))).toEqual([
      { type: "Tipo A", area: "75.67 m²" },
      { type: "Tipo B", area: "59.03 m²" },
      { type: "Tipo C", area: "43.36 m²" },
      { type: "Tipo E", area: "29.44 m²" },
      { type: "Tipo D", area: "23.34 m²" },
    ]);
  });

  it("keeps the published financing conditions", () => {
    expect(financing).toEqual({
      downPayment: "50%",
      downPaymentTerms: "De 12 a 60 cuotas mensuales",
      credit: "50%",
      creditTerms: "20 años plazo · 5% de interés",
      creditFrom: "$93 al mes",
    });
  });
});