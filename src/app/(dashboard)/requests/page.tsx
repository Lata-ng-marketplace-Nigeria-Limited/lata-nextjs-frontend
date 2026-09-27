import { getAllCategoriesApi } from "@/api/category";
import { getProductRequestsApi } from "@/api/productRequest";
import { ProductRequestsFeed } from "@/components/requests/ProductRequestsFeed";

export const metadata = {
  title: "Buyer Requests & Category Rooms - Lata.ng",
  description:
    "Post what you want to buy and connect directly with verified sellers in your category.",
};

export default async function RequestsPage() {
  const [categoriesData, requestsData] = await Promise.all([
    getAllCategoriesApi(),
    getProductRequestsApi(),
  ]);

  return (
    <main className="min-h-screen bg-grey1/30 pb-12">
      <ProductRequestsFeed
        categories={categoriesData || []}
        initialRequests={requestsData?.data || []}
      />
    </main>
  );
}
