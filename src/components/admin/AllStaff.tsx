"use client";

import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { IAddedUserMeta, User } from "@/interface/user";
import { FetchMeta } from "@/interface/general";
import TableWithRowGaps from "../table/TableWithRowGaps";
import TableTopArea from "./TableTopArea";
import AddStaffForm from "./AddStaffForm";
import ResizableDialog from "./ResizableDialog";
import Link from "next/link";
import Image from "next/image";

interface Props {
  data: User[];
  meta: FetchMeta;
}
const AllStaff = (props: Props) => {
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [filteredData, setFilteredData] = useState<User[]>(props.data);
  const [search, setSearch] = useState("");

  const handleAddStaff = () => {
    setShowAddStaffModal(!showAddStaffModal);
  };

  useEffect(() => {
    const filter = props.data.filter(
      (staff) =>
        // search by name
        staff?.name.toLowerCase().includes(search) ||
        // search by admin
        (staff?.meta as IAddedUserMeta)?.manager?.name
          .toLowerCase()
          .includes(search) ||
        // search by location
        (staff?.address as string).toLowerCase().includes(search) ||
        // search by reg date
        DateTime.fromISO(staff?.createdAt)
          .toFormat("dd LLL, yyyy")
          .toLowerCase()
          .includes(search),
    );
    setFilteredData(filter);
  }, [search, props.data]);

  return (
    <>
      <TableTopArea
        title="All Staff"
        buttonText="+ Add Staff"
        placeholder="Search staff"
        onClick={handleAddStaff}
        setSearch={setSearch}
      />
      <TableWithRowGaps
        isClickable
        emptyTableTitle="No Staff yet"
        emptyTableDescription="All Staff will appear here"
        tableData={filteredData.map((staff) => {
          return {
            name: (
              <div className="flex items-center gap-2">
                <Image
                  src={staff?.avatar || ""}
                  alt={"image of " + staff?.name}
                  width={20}
                  height={20}
                  className="aspect-square rounded-full object-cover"
                />
                <Link href={"#"}>{staff?.name}</Link>
              </div>
            ),
            location: staff?.address,
            "reg Date": DateTime.fromISO(staff?.createdAt).toFormat(
              "dd LLL, yyyy",
            ),
            admin: (staff?.meta as IAddedUserMeta)?.manager?.name || "-",
          };
        })}
        usePaginate
        meta={props.meta}
      />

      <ResizableDialog
        isShown={showAddStaffModal}
        setIsShown={setShowAddStaffModal}
      >
        <AddStaffForm setShowAddStaffModal={setShowAddStaffModal} />
      </ResizableDialog>
    </>
  );
};

export default AllStaff;
