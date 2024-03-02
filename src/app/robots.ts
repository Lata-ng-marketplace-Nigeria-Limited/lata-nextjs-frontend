import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/staff",
          "/balance",
          "/analytics",
          "/feedback",
          "/notifications",
          "/feedback",
          "/messages",
          "/call-manager",
          "/protected-seller",
          "/sales-agreement",
          "/settings",
          "/subscriptions",
          "/shop",
          "/saved",
        ],
      },
    ],
    sitemap: "https://lata.ng/sitemap.xml",
  };
}
