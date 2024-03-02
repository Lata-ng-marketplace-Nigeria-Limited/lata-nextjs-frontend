"use client";

import React, { useEffect, useState } from "react";
import { IAddedUserMeta, User } from "@/interface/user";
import { FetchMeta } from "@/interface/general";
import { DateTime } from "luxon";
import TableWithRowGaps from "@components/table/TableWithRowGaps";
import TableTopArea from "@components/admin/TableTopArea";
import AddSellerForm from "@components/admin/AddSeller";
import ResizableDialog from "./ResizableDialog";
import BadgeWithCount from "../atom/BadgeWithCount";
import { IBadgeVariants } from "../atom/Badge";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { DASHBOARD_PROTECTED_SELLER_ROUTE } from "@/constants/routes";
import AppAvatar from "../molecule/Avatar";

interface Props {
  data: User[];
  meta: FetchMeta;
  countVerifiedSellers?: number;
  countUnverifiedSellers?: number;
  usersWithNoUploadsCount?: number;
}
const AllSellers = (props: Props) => {
  const [showAddSellerModal, setShowAddSellerModal] = useState(false);
  const [filteredData, setFilteredData] = useState<User[]>(props.data);
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const params = new URLSearchParams(searchParams);

  const handleAddSeller = () => {
    setShowAddSellerModal(!showAddSellerModal);
  };

  useEffect(() => {
    const filter = props.data.filter(
      (seller) =>
        // search by name
        seller?.name?.toLowerCase().includes(search) ||
        // search by manager
        seller?.managerName?.toLowerCase().includes(search) ||
        // search by location
        seller?.address?.toLowerCase().includes(search) ||
        // search by reg date
        DateTime.fromISO(seller?.createdAt)
          ?.toFormat("dd LLL, yyyy")
          .toLowerCase()
          .includes(search),
    );
    setFilteredData(filter);
  }, [search, props.data]);

  const activeButtonVariant = (): IBadgeVariants => {
    if (params.get("verified") === "0") {
      return "warning";
    } else if (params.get("verified") === "zero_uploads") {
      return "normal";
    } else {
      return "primary";
    }
  };

  const handleClick = (verified: "0" | "1" | "zero_uploads") => {
    if (verified) {
      params.set("verified", verified);
    } else {
      params.delete("verified", verified);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <div className="mb-7 flex justify-end gap-4 sl:gap-6">
        <BadgeWithCount
          count={props?.countVerifiedSellers || 0}
          activeVariant={activeButtonVariant()}
          className="max-xs:text-[10px]"
          text="verified"
          variant="primary"
          onClick={() => handleClick("1")}
        />

        <BadgeWithCount
          count={props?.countUnverifiedSellers || 0}
          activeVariant={activeButtonVariant()}
          className="max-xs:text-[10px]"
          variant="warning"
          text="unverified"
          onClick={() => handleClick("0")}
        />

        <BadgeWithCount
          count={props?.usersWithNoUploadsCount || 0}
          activeVariant={activeButtonVariant()}
          className="max-xs:text-[10px]"
          variant="normal"
          text="No Uploads"
          onClick={() => handleClick("zero_uploads")}
        />
      </div>
      <TableTopArea
        title="All Sellers"
        buttonText="+ Add Seller"
        placeholder="Search sellers"
        onClick={handleAddSeller}
        setSearch={setSearch}
      />
      <TableWithRowGaps
        isClickable
        tableData={filteredData.map((seller) => {
          return {
            name: (
              <div className="flex items-center gap-2">
                <AppAvatar
                  name={seller?.name}
                  src={seller?.avatar}
                  className="h-[30px] w-[30px] sm:h-[30px] sm:w-[30px]"
                  initialsClass="font-normal text-xs sm:text-xs"
                />
                <Link
                  href={DASHBOARD_PROTECTED_SELLER_ROUTE + "/" + seller?.id}
                  className="hover:text-primary"
                >
                  {seller?.name}
                </Link>
              </div>
            ),
            location: seller?.address,
            "reg Date": DateTime.fromISO(seller?.createdAt).toFormat(
              "dd LLL, yyyy",
            ),
            manager: seller?.managerName || "-",
          };
        })}
        usePaginate
        meta={props.meta}
      />

      <ResizableDialog
        isShown={showAddSellerModal}
        setIsShown={setShowAddSellerModal}
      >
        <AddSellerForm setShowAddSellerModal={setShowAddSellerModal} />
      </ResizableDialog>
    </div>
  );
};

export default AllSellers;
