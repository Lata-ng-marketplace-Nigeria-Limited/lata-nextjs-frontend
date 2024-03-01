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
      lastModified: new Date().toISOString(), // Ensure lastModified is a string
      changeFrequency: "always",
      priority: 1,
    })) || [];

  return products;
}
