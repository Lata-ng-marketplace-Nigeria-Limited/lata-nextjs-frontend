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
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectingReel, setRejectingReel] = useState<Reel | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [deletingReel, setDeletingReel] = useState<Reel | null>(null);
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
    setDeletingReel(reel);
    setDeleteReason("");
    setShowDeleteModal(true);
  };

  const handleRejectReel = (reel: Reel) => {
    setRejectingReel(reel);
    setRejectionReason("");
    setShowRejectModal(true);
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

      <Modal isShown={showRejectModal} setIsShown={setShowRejectModal}>
        <div className="p-6 max-w-[400px] mx-auto bg-white rounded-xl text-left" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-base font-bold text-grey10 mb-2">Reject Reel</h3>
          <p className="text-xs text-grey6 leading-relaxed mb-4">
            Please enter a reason for rejecting the reel <strong>"{rejectingReel?.title}"</strong>. This explanation will be emailed to the seller and displayed on their dashboard.
          </p>
          
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="w-full h-[100px] p-2.5 text-xs text-grey8 bg-offwhite border border-grey3 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 resize-none mb-4"
            placeholder="Type rejection reason here (e.g. video quality, offensive content)..."
            required
          />

          <div className="flex gap-3 justify-end">
            <Button
              format="secondary"
              className="px-4 py-2 text-xs font-semibold rounded-lg"
              disabled={modalButtonLoading}
              onClick={() => setShowRejectModal(false)}
            >
              Cancel
            </Button>
            <Button
              format="danger"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-danger text-white hover:bg-danger/80 disabled:opacity-50 disabled:pointer-events-none"
              disabled={modalButtonLoading || !rejectionReason.trim()}
              onClick={async () => {
                if (!rejectingReel || !rejectionReason.trim()) return;
                setModalButtonLoading(true);
                try {
                  await cancelReelApi(rejectingReel.id, rejectionReason.trim());
                  toast({
                    title: "Success",
                    description: "Reel has been rejected and email sent",
                    variant: "success",
                  });
                  setShowRejectModal(false);
                  refresh();
                } catch (error) {
                  toast({
                    title: "Something went wrong",
                    description: "Please try again later",
                    variant: "destructive",
                  });
                } finally {
                  setModalButtonLoading(false);
                }
              }}
            >
              Reject Reel
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isShown={showDeleteModal} setIsShown={setShowDeleteModal}>
        <div className="p-6 max-w-[400px] mx-auto bg-white rounded-xl text-left" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-base font-bold text-grey10 mb-2">Delete Reel</h3>
          <p className="text-xs text-grey6 leading-relaxed mb-4">
            Are you sure you want to delete the reel <strong>"{deletingReel?.title}"</strong>? This action is irreversible. You can optionally enter a reason for the deletion below to notify the seller.
          </p>
          
          <textarea
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
            className="w-full h-[100px] p-2.5 text-xs text-grey8 bg-offwhite border border-grey3 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 resize-none mb-4"
            placeholder="Type deletion reason here (optional)..."
          />

          <div className="flex gap-3 justify-end">
            <Button
              format="secondary"
              className="px-4 py-2 text-xs font-semibold rounded-lg"
              disabled={modalButtonLoading}
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              format="danger"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-danger text-white hover:bg-danger/80"
              disabled={modalButtonLoading}
              onClick={async () => {
                if (!deletingReel) return;
                setModalButtonLoading(true);
                try {
                  await deleteReelApi(deletingReel.id, deleteReason.trim() || undefined);
                  toast({
                    title: "Success",
                    description: "Reel has been deleted",
                    variant: "success",
                  });
                  setShowDeleteModal(false);
                  refresh();
                } catch (error) {
                  toast({
                    title: "Something went wrong",
                    description: "Please try again later",
                    variant: "destructive",
                  });
                } finally {
                  setModalButtonLoading(false);
                }
              }}
            >
              Delete Reel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
