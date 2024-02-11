import { Product } from "@/interface/products";
import { useUser } from "@hooks/useUser";
import { useState } from "react";
import Prompt, { PromptProps } from "@molecule/Prompt";
import {
  activateProductApi,
  cancelProductApi,
  deactivateProductApi,
  deleteAProductApi,
} from "@/api/product";
import { useToast } from "@components/ui/use-toast";
import ViewProductContainer from "@atom/ViewProductContainer";
import ProductDetails from "@components/product/ProductDetails";
import ProductAsideArea from "@atom/ProductAsideArea";
import SafetyTips from "@components/product/SafetyTips";
import SellerContact from "@components/product/SellerContact";
import ProductGridList from "@atom/ProductGridList";
import Modal from "@molecule/Modal";
import Button from "@atom/Button";
import { cn, formatPrice } from "@/utils";
import ProductCard from "@components/product/ProductCard";
import FeedbacksForProduct from "../feedback/FeedbacksForProduct";
import { useRouter } from "next/navigation";

interface Props {
  product: Product | undefined;
  similarProducts: Product[];
}

export default function ViewNotOwnProduct(props: Props) {
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalProps] = useState<PromptProps>({});
  const [modalButtonLoading, setModalButtonLoading] = useState(false);
  const { toast } = useToast();
  const { replace, refresh } = useRouter();

  const handleSendToReview = async () => {
    if (!props.product?.id) return;
    setShowModal(true);
    setModalProps({
      type: "default",
      title: "Review Product",
      confirmText: "Send to review",
      confirmType: "primary",
      description:
        "This product will be hidden from the public and sent to review. Are you sure you want to continue?",
      onConfirm: async () => {
        setModalButtonLoading(true);
        try {
          await deactivateProductApi(props.product?.id!);
          toast({
            title: "Product under review",
            description:
              "Product is now hidden from the public and under review",
            variant: "success",
          });
        } catch (error) {
          toast({
            title: "Something went wrong",
            description: "Please try again later",
            variant: "destructive",
          });
        } finally {
          handleCancel();
        }
      },
    });
  };

  const handleDeleteProduct = (product?: Product) => {
    if (!product) return;
    setShowModal(true);
    setModalProps({
      type: "error",
      title: "Delete Product",
      confirmText: "Delete",
      confirmType: "danger",
      description:
        "Are you sure you want to delete this product? This action is irreversible.",
      onConfirm: async () => {
        setModalButtonLoading(true);
        try {
          await deleteAProductApi(product.id);
          toast({
            title: "Product Deleted",
            description: "Product has been deleted",
            variant: "success",
          });
        } catch (error) {
          toast({
            title: "Something went wrong",
            description: "Please try again later",
            variant: "destructive",
          });
        } finally {
          handleCancel();
        }
      },
    });
  };

  const handleApproveProduct = (product: Product) => {
    setShowModal(true);
    setModalProps({
      type: "default",
      title: "Approve Product",
      confirmText: "Approve",
      confirmType: "primary",
      description: "Are you sure you want to approve this product?",
      onConfirm: async () => {
        setModalButtonLoading(true);
        try {
          await activateProductApi(product.id);
          toast({
            title: "Product Approved",
            description: "Product has been approved",
            variant: "success",
          });
          refresh();
        } catch (error) {
          toast({
            title: "Something went wrong",
            description: "Please try again later",
            variant: "destructive",
          });
        } finally {
          handleCancel();
        }
      },
    });
  };

  const handleRejectProduct = (product: Product) => {
    setShowModal(true);
    setModalProps({
      type: "error",
      title: "Reject Product",
      confirmText: "Reject",
      confirmType: "danger",
      showRejectionForm: true,
      description:
        "Are you sure you want to reject this product? This product will no longer be listed under review products and will not be published. This action is irreversible.",
      onConfirm: async () => {
        setModalButtonLoading(true);
        try {
          await cancelProductApi(product.id);
          toast({
            title: "Success",
            description: "Product has been rejected",
            variant: "success",
          });
          refresh();
        } catch (error) {
          toast({
            title: "Something went wrong",
            description: "Please try again later",
            variant: "destructive",
          });
        } finally {
          handleCancel();
        }
      },
    });
  };

  const handleCancel = () => {
    setShowModal(false);
    setModalButtonLoading(false);
    setTimeout(() => {
      setModalProps({});
    }, 300);
  };
  return (
    <>
      <ViewProductContainer>
        <ProductDetails product={props.product!} />

        <ProductAsideArea>
          <SellerContact
            productName={props.product?.name}
            sellerInfo={props.product?.user}
            productId={props.product?.id}
            productOwnerId={props.product?.userId}
            type={"compact"}
          />
          <SafetyTips />

          {user?.role !== "ADMIN" && props?.product ? (
            <div className="mt-8 max-h-[30rem] overflow-y-auto">
              <FeedbacksForProduct product={props.product as Product} />
            </div>
          ) : null}

          {user?.role === "ADMIN" ? (
            props?.product?.status === "ACTIVE" ? (
              <>
                <Button format={"secondary"} onClick={handleSendToReview}>
                  Send to review
                </Button>

                <Button
                  format={"danger"}
                  onClick={() => handleDeleteProduct(props.product)}
                >
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button
                  format={"primary"}
                  onClick={() =>
                    handleApproveProduct(props?.product as Product)
                  }
                >
                  Approve post
                </Button>

                <Button
                  format={"secondary"}
                  onClick={() => handleRejectProduct(props?.product as Product)}
                >
                  Reject product
                </Button>

                <Button
                  format={"danger"}
                  onClick={() => handleDeleteProduct(props.product)}
                >
                  Delete
                </Button>
              </>
            )
          ) : null}
        </ProductAsideArea>
      </ViewProductContainer>

      {props.similarProducts.length ? (
        <div
          className={cn(`
          mt-6
          sm:mt-8
        `)}
        >
          <h2
            className={
              "text-xs font-semibold text-grey9 sm:text-base sm:font-medium "
            }
          >
            Similar products
          </h2>

          <ProductGridList>
            {props.similarProducts.map((products, i) => (
              <ProductCard
                price={formatPrice(products.price)}
                productName={products.name}
                description={products.description}
                state={products.state}
                city={products.city}
                imageSrc={products.files?.[0]?.url}
                product={products}
                createProductPreview={false}
                key={i}
              />
            ))}
          </ProductGridList>
        </div>
      ) : null}

      <Modal
        isShown={showModal}
        setIsShown={setShowModal}
        onOpenChange={(open) => {
          if (!open) {
            handleCancel();
          }
        }}
      >
        <Prompt
          {...modalProps}
          onCancel={handleCancel}
          confirmLoading={modalButtonLoading}
        />
      </Modal>
    </>
  );
}
