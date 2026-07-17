"use client";
import { FindAProductData, Product } from "@/interface/products";
import { useEffect, useState } from "react";
import { useUser } from "@hooks/useUser";
import posthog from "posthog-js";
import { ViewProductSkeleton } from "@components/skeleton/ViewProductSkeleton";
import ViewOwnProduct from "@components/product/ViewOwnProduct";
import ViewNotOwnProduct from "@components/product/ViewNotOwnProduct";
import { State } from "@/interface/location";
import Modal from "@components/molecule/Modal";

interface Props {
  data: FindAProductData | null;
  statesInNigeria: State[];
}
export const ViewProductArea = ({ data, statesInNigeria }: Props) => {
  const { updateUser } = useUser();
  const [product, setProduct] = useState<Product>();
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productNotFound, setProductNotFound] = useState(false);
  const { isLoggedIn } = useUser();
  const [showAnonymousPrompt, setShowAnonymousPrompt] = useState(false);

  useEffect(() => {
    if (!data) {
      setProductNotFound(true);
    } else {
      setProduct(data.product);
      setSimilarProducts(data.similarProducts || []);
      setIsOwner(data.isOwner);

      if (data?.userData?.id) {
        updateUser(data.userData);
      }

      posthog.capture("product_viewed", {
        product_id: data.product.id,
        category: data.product.category?.name || "",
        product_type: data.product.productType || "",
        is_owner: data.isOwner,
      });
    }
    setLoading(false);
  }, [data]);

  useEffect(() => {
    // Only prompt if loading is complete, user is NOT logged in, and no role saved in localStorage
    if (!loading && !isLoggedIn && !localStorage.getItem("lata_buyer_role")) {
      setShowAnonymousPrompt(true);
    }
  }, [loading, isLoggedIn]);

  const handleSelectAnonymousRole = (role: string) => {
    localStorage.setItem("lata_buyer_role", role);
    setShowAnonymousPrompt(false);
  };

  return (
    <div>
      {loading ? <ViewProductSkeleton /> : null}

      {!loading && productNotFound ? (
        <div className="flex h-full">
          <h1 className="">Product not found</h1>
        </div>
      ) : (
        <>
          {isOwner ? (
            product ? (
              <ViewOwnProduct
                product={product}
                statesInNigeria={statesInNigeria}
              />
            ) : null
          ) : (
            <ViewNotOwnProduct
              product={product}
              similarProducts={similarProducts}
              statesInNigeria={statesInNigeria}
            />
          )}
        </>
      )}

      <Modal
        isShown={showAnonymousPrompt}
        setIsShown={setShowAnonymousPrompt}
        contentClass="max-w-[400px] p-6 bg-white rounded-xl shadow-lg border border-gray-150"
      >
        <div className="flex flex-col items-center gap-y-4 text-center">
          <h3 className="text-xl font-bold text-gray-900">
            What best describes you?
          </h3>
          <p className="text-sm text-gray-500">
            Please select an option to customize your view of products on
            LATA.ng.
          </p>

          <div className="mt-2 flex w-full flex-col gap-y-3">
            {[
              { label: "Direct Buyer", value: "direct_buyer" },
              { label: "Direct Mandate", value: "direct_mandate" },
              { label: "Agent", value: "agent" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelectAnonymousRole(option.value)}
                type="button"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};
