"use client";
import { FindAProductData, Product } from "@/interface/products";
import { useEffect, useState } from "react";
import { useUser } from "@hooks/useUser";
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
        <div className="flex flex-col items-center text-center gap-y-4">
          <h3 className="text-xl font-bold text-gray-900">What best describes you?</h3>
          <p className="text-sm text-gray-500">
            Please select an option to customize your view of products on LATA.ng.
          </p>

          <div className="flex flex-col gap-y-3 w-full mt-2">
            {[
              { label: "Direct Buyer", value: "direct_buyer" },
              { label: "Direct Mandate", value: "direct_mandate" },
              { label: "Agent", value: "agent" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelectAnonymousRole(option.value)}
                type="button"
                className="w-full py-3 px-4 rounded-lg border text-sm font-semibold transition text-left border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 bg-white"
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
