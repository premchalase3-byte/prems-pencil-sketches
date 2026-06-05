import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://premspencilsketches.in",
      lastModified: new Date(),
    },
  ];
}