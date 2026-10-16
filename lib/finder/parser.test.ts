import { describe, expect, it } from "vitest";
import { parseQuery } from "./parser";

describe("parseQuery vehicle constraints", () => {
  it("extracts the target Yamaha request", () => {
    const raw = "Cerco uno scooter Yamaha XMAX 300 usato in Svizzera, massimo CHF 5'000, dal 2020 in poi, meno di 20'000 km.";

    expect(parseQuery(raw, "it")).toEqual({
      raw,
      normalized: raw.toLowerCase(),
      lang: "it",
      searchSubject: "Yamaha XMAX 300",
      maxPriceChf: 5000,
      minYear: 2020,
      maxMileageKm: 20000,
      vehicleIntent: true,
    });
  });

  it("extracts different Honda limits", () => {
    const raw = "Cerco uno scooter Honda Forza 350 usato, massimo CHF 6'500, dal 2021 in poi, meno di 15'000 km.";

    expect(parseQuery(raw, "it")).toEqual({
      raw,
      normalized: raw.toLowerCase(),
      lang: "it",
      searchSubject: "Honda Forza 350",
      maxPriceChf: 6500,
      minYear: 2021,
      maxMileageKm: 15000,
      vehicleIntent: true,
    });
  });

  it("keeps a simple model query free of invented constraints", () => {
    expect(parseQuery("Yamaha XMAX 300", "it")).toEqual({
      raw: "Yamaha XMAX 300",
      normalized: "yamaha xmax 300",
      vehicleIntent: true,
      lang: "it",
      searchSubject: "Yamaha XMAX 300",
    });
  });

  it("extracts Vespa GTS 300 without changing non-vehicle queries", () => {
    expect(parseQuery("Cerco Vespa GTS 300", "it")).toMatchObject({
      searchSubject: "Vespa GTS 300", vehicleIntent: true,
    });
    expect(parseQuery("iPhone 13 mini", "it").searchSubject).toBeUndefined();
  });
});
