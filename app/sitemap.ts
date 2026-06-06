import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://prems-pencil-sketches.vercel.app/",
      lastModified: new Date(),
    },
  ];
}