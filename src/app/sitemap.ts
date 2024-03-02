import { getDashboardProductsApi } from "@/api/product";

type SitemapItem = {
  url: string;
  lastModified?: string | Date;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
};

type Sitemap = SitemapItem[];

export default async function sitemap(): Promise<Sitemap> {
  const response = await getDashboardProductsApi();

  const products: Sitemap =
    response?.trendingProducts?.map((product) => ({
      url: `https://lata.ng/product/${product?.id}`,
      lastModified: new Date(product?.updatedAt),
      changeFrequency: "daily",
      priority: 0.8,
    })) || [];

  return [
    {
      url: `https://lata.ng`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `https://lata.ng/about-us`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 0.6,
    },
    ...products,
  ];
}
