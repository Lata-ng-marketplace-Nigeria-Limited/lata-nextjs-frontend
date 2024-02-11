"use client";

import { FormEvent, useState } from "react";
import TextInput from "@components/input/TextInput";
import { cn, safeParseJSON } from "@/utils";
import Button from "@atom/Button";
import { Product } from "@/interface/products";
import { FetchMeta } from "@/interface/general";
import {
  activateProductApi,
  cancelProductApi,
  deleteAProductApi,
} from "@/api/product";
import Prompt, { PromptProps } from "@molecule/Prompt";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@components/ui/use-toast";
import ProductTableCard from "@components/table/ProductTableCard";
import UserTableCard from "@components/table/UserTableCard";
import TableActions from "@components/table/TableActions";
import { Table } from "@components/table/Table";
import {
  DASHBOARD_PRODUCT_ROUTE,
  DASHBOARD_SELLER_PROFILE_ROUTE,
} from "@/constants/routes";
import Modal from "@molecule/Modal";

interface Props {
  products: Product[];
  meta: FetchMeta;
  page: string;
  urlSearch: string;
}

export const ReviewProduct = ({ products, meta, page, urlSearch }: Props) => {
  const [loading, setLoading] = useState(false);
  const [modalButtonLoading, setModalButtonLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalProps] = useState<PromptProps>({});
  const { replace, refresh } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { toast } = useToast();

  const handleCancel = () => {
    setShowModal(false);
    setModalButtonLoading(false);
    setTimeout(() => {
      setModalProps({});
    }, 300);
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

  const handleDeleteProduct = (product: Product) => {
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

  const tableData = products.map((product) => ({
    productSummary: <ProductTableCard product={product} />,
    seller: <UserTableCard user={product.user} />,
    actions: (
      <TableActions
        buttons={[
          {
            format: "primary",
            label: "Approve",
            onClick: () => {
              handleApproveProduct(product);
            },
          },
          {
            format: "secondary",
            label: "Reject",
            onClick: () => {
              handleRejectProduct(product);
            },
          },
          {
            format: "danger",
            label: "Delete",
            onClick: () => {
              handleDeleteProduct(product);
            },
          },
        ]}
      />
    ),
    rowData: product,
  }));

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search === urlSearch) return;
    const params = new URLSearchParams(searchParams);
    params.set("q", search);
    params.set("page", "1");
    replace(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    if (loading) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div>
      <form className={"flex gap-x-3 w-full mb-6"} onSubmit={handleSearch}>
        <TextInput
          inputClass={cn(` h-[2rem]
          sm:h-10 `)}
          wrapperClass={"w-full"}
          placeholder={"Search..."}
          value={search}
          setValue={setSearch}
        />
        <Button
          className={"w-full sm:p-1 max-w-[100px]"}
          format={"primary"}
          type={"submit"}
        >
          Search
        </Button>
      </form>

      <Table
        tableData={tableData}
        onColumnClick={({ rowData: data, key }) => {
          const rowData: Product = data;
          const productId = rowData.id;
          const userId = rowData.user.id;
          const userUrl = `${DASHBOARD_SELLER_PROFILE_ROUTE}/${userId}?pid=${productId}}`;
          const meta = safeParseJSON(rowData?.meta || "{}");
          const selectedImage = meta?.selectedImage || rowData.files?.[0]?.url;
          const params: any = {
            name: rowData.name,
            desc: rowData.description,
            image: selectedImage,
          };

          const query = new URLSearchParams(params).toString();
          if (key !== "actions" && key !== "seller") {
            open(
              DASHBOARD_PRODUCT_ROUTE + "/" + productId + "?" + query,
              "_blank",
            );
            return;
          }
          if (key === "seller") {
            open(userUrl, "_blank");
            return;
          }
        }}
        keyNotCursor={["actions"]}
        uesPaginate
        meta={meta}
        currentPage={Number(page || "1")}
        onPageChange={handlePageChange}
        loading={loading}
      />

      <Modal
        isShown={showModal}
        setIsShown={setShowModal}
        onOpenChange={(open) => {
          if (!open) {
            // handleCancel();
          }
        }}
      >
        <Prompt
          {...modalProps}
          onCancel={handleCancel}
          confirmLoading={modalButtonLoading}
        />
      </Modal>
    </div>
  );
};
