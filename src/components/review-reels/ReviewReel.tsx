"use client";

import { FormEvent, useState } from "react";
import TextInput from "@components/input/TextInput";
import { cn } from "@/utils";
import Button from "@atom/Button";
import { Reel, ReelUser, activateReelApi, cancelReelApi } from "@/api/reels";
import { deleteReelApi } from "@/api/reels.client";
import { FetchMeta } from "@/interface/general";
import Prompt, { PromptProps } from "@molecule/Prompt";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@components/ui/use-toast";
import ReelTableCard from "@components/table/ReelTableCard";
import UserTableCard from "@components/table/UserTableCard";
import TableActions from "@components/table/TableActions";
import { Table } from "@components/table/Table";
import Modal from "@molecule/Modal";

interface Props {
  reels: (Reel & { user: ReelUser })[];
  meta: FetchMeta;
  page: string;
  urlSearch: string;
}

export const ReviewReel = ({ reels, meta, page, urlSearch }: Props) => {
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

  const handleApproveReel = (reel: Reel) => {
    setShowModal(true);
    setModalProps({
      type: "default",
      title: "Approve Reel",
      confirmText: "Approve",
      confirmType: "primary",
      description: "Are you sure you want to approve this reel?",
      onConfirm: async () => {
        setModalButtonLoading(true);
        try {
          await activateReelApi(reel.id);
          toast({
            title: "Reel Approved",
            description: "Reel has been approved",
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

  const handleDeleteReel = (reel: Reel) => {
    setShowModal(true);
    setModalProps({
      type: "error",
      title: "Delete Reel",
      confirmText: "Delete",
      confirmType: "danger",
      description:
        "Are you sure you want to delete this reel? This action is irreversible.",
      onConfirm: async () => {
        setModalButtonLoading(true);
        try {
          await deleteReelApi(reel.id);
          toast({
            title: "Reel Deleted",
            description: "Reel has been deleted",
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

  const handleRejectReel = (reel: Reel) => {
    setShowModal(true);
    setModalProps({
      type: "error",
      title: "Reject Reel",
      confirmText: "Reject",
      confirmType: "danger",
      description:
        "Are you sure you want to reject this reel? This reel will no longer be listed under review reels and will not be published on the feed.",
      onConfirm: async () => {
        setModalButtonLoading(true);
        try {
          await cancelReelApi(reel.id);
          toast({
            title: "Success",
            description: "Reel has been rejected",
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

  const tableData = reels.map((reel) => ({
    reelSummary: <ReelTableCard reel={reel} />,
    seller: <UserTableCard user={reel.user as any} />,
    actions: (
      <TableActions
        buttons={[
          {
            format: "primary",
            label: "Approve",
            onClick: () => {
              handleApproveReel(reel);
            },
          },
          {
            format: "secondary",
            label: "Reject",
            onClick: () => {
              handleRejectReel(reel);
            },
          },
          {
            format: "danger",
            label: "Delete",
            onClick: () => {
              handleDeleteReel(reel);
            },
          },
        ]}
      />
    ),
    rowData: reel,
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
          inputClass={cn(` h-[2rem] sm:h-10 `)}
          wrapperClass={"w-full"}
          placeholder={"Search reels..."}
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
