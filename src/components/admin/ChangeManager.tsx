"use client";

import React from "react";
import { User } from "@/interface/user";
import SearchInput from "./SearchInput";
import Image from "next/image";
import AppAvatar from "../molecule/Avatar";
import Button from "../atom/Button";
import { cn } from "@/utils";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { changeManagerApi } from "@/api/admin.client";

interface Props {
  sellerId: string;
  managers: User[];
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChangeManager = (props: Props) => {
  const [search, setSearch] = React.useState("");
  const [filteredManagers, setFilteredManagers] = React.useState<User[]>(
    props.managers,
  );
  const [selectedManager, setSelectedManager] = React.useState<User | null>(
    null,
  );
  const { refresh } = useRouter();

  const onChangeManager = async () => {
    if (!selectedManager) return;
    const payload = {
      managerId: selectedManager.id,
      sellerId: props.sellerId,
    };

    try {
      const response = await changeManagerApi(payload);
      if (response.success) {
        toast({
          title: response.message,
          variant: "success",
        });
        refresh();
      } else {
        toast({
          title: "Something went wrong",
          variant: "destructive",
        });
      }
      props.setOpenModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    const filter = props.managers.filter((manager) =>
      manager.name.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredManagers(filter);
  }, [search, props.managers]);

  return (
    <div>
      <h2 className="mb-5 text-lg font-semibold">Choose New Manager</h2>
      <div className="mb-5">
        <SearchInput />
      </div>
      <div className="mb-5">
        {filteredManagers.length > 0 ? (
          filteredManagers.map((manager) => (
            <div
              key={manager?.id}
              onClick={() => setSelectedManager(manager)}
              className={cn(
                "mb-4 flex cursor-pointer items-center gap-3 rounded-md hover:bg-purp1",
                {
                  "bg-primary text-white hover:bg-primary hover:text-white":
                    selectedManager?.name === manager?.name,
                },
              )}
            >
              {manager.avatar ? (
                <Image src={manager.avatar} alt={"image of" + manager.name} />
              ) : (
                <AppAvatar name={manager.name} type="user" />
              )}
              <p>{manager.name}</p>
            </div>
          ))
        ) : (
          <p>No managers found</p>
        )}

        <div className="flex items-center justify-end gap-5">
          <Button format="secondary" onClick={() => props.setOpenModal(false)}>
            Cancel
          </Button>
          <Button
            format="primary"
            onClick={onChangeManager}
            disabled={!selectedManager}
          >
            Change
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChangeManager;
