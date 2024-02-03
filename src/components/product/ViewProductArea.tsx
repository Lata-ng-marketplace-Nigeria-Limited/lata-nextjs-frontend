"use client";
import { FindAProductData, Product } from "@/interface/products";
import { useEffect, useState } from "react";
import { useUser } from "@hooks/useUser";
import { ViewProductSkeleton } from "@components/skeleton/ViewProductSkeleton";
import ViewOwnProduct from "@components/product/ViewOwnProduct";
import ViewNotOwnProduct from "@components/product/ViewNotOwnProduct";

interface Props {
  data: FindAProductData | null;
}
export const ViewProductArea = ({ data }: Props) => {
  const { updateUser } = useUser();
  const [product, setProduct] = useState<Product>();
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productNotFound, setProductNotFound] = useState(false);

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
              <ViewOwnProduct product={product} />
            ) : null
          ) : (
            <ViewNotOwnProduct
              product={product}
              similarProducts={similarProducts}
            />
          )}
        </>
      )}
    </div>
  );
};
