import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://TUO-DOMINIO.com";

  return [
    { url: `${base}/it`, lastModified: new Date() },
    { url: `${base}/en`, lastModified: new Date() },
    { url: `${base}/fr`, lastModified: new Date() },
    { url: `${base}/de`, lastModified: new Date() },
    { url: `${base}/it/about`, lastModified: new Date() },
    { url: `${base}/it/how-it-works`, lastModified: new Date() },
    { url: `${base}/it/faq`, lastModified: new Date() },
    // …tutte le lingue
  ];
}
