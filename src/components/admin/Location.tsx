"use client";

import React, { useState } from "react";
import Button from "../atom/Button";
import ResizableDialog from "./ResizableDialog";
import { deleteStateApi } from "@/api/admin.client";
import { showToast } from "@/utils";
import DeleteModalContent from "./DeleteModalContent";
import { State } from "@/interface/location";
import AddState from "./AddState";
import LocationIcon from "../atom/icons/Location";
import SubLocation from "./SubLocation";
import { useRouter } from "next/navigation";

interface Props {
  states: State[];
}

const Location = (props: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [showStateCitiesModal, setShowStateCitiesModal] = useState(false);
  const [showAddCityModal, setShowAddCityModal] = useState(false);
  const [showDeleteStateModal, setShowDeleteStateModal] = useState(false);
  const { refresh } = useRouter();

  const deleteState = async () => {
    if (!selectedState) {
      showToast("State not found", "destructive");
      return;
    }
    try {
      await deleteStateApi(selectedState?.id);
      setShowDeleteStateModal(false);
      showToast(`${selectedState.name} deleted successfully`, "success");
      refresh();
    } catch (error) {
      console.log(error);
      showToast(
        (error as any)?.message || "Error deleting state",
        "destructive",
      );
    }
  };

  return (
    <main>
      <div className="mb-6 flex justify-between">
        <h1 className="">States</h1>
        <Button format="primary" onClick={() => setShowModal(!showModal)}>
          + Add State
        </Button>
      </div>

      <section className="grid grid-cols-1 gap-2 xls:grid-cols-2 xls:gap-3 xs:grid-cols-auto-fit">
        {props.states.map((loc) => (
          <div
            key={loc.id}
            className="flex min-h-[3.4rem] cursor-pointer items-center justify-between gap-[2px] rounded-[0.375rem] bg-purp2 px-4 py-2 xls:gap-1 "
          >
            <p className="basis-[10%] text-xl">•</p>
            <p className="basis-[60%]">{loc.name}</p>{" "}
            <LocationIcon
              className="ml-1 size-[24px] basis-[20%] xls:ml-2"
              onClick={() => {
                setSelectedState(loc);
                setShowStateCitiesModal(true);
              }}
            />
          </div>
        ))}
      </section>

      <ResizableDialog isShown={showModal} setIsShown={setShowModal}>
        <AddState setShowModal={setShowModal} />
      </ResizableDialog>

      <ResizableDialog
        isShown={showStateCitiesModal}
        setIsShown={setShowStateCitiesModal}
      >
        <SubLocation
          selectedState={selectedState as State}
          showAddCityModal={showAddCityModal}
          setShowAddCityModal={setShowAddCityModal}
          setShowDeleteStateModal={setShowDeleteStateModal}
          setShowStateCitiesModal={setShowStateCitiesModal}
        />
      </ResizableDialog>

      <ResizableDialog
        isShown={showDeleteStateModal}
        setIsShown={setShowDeleteStateModal}
      >
        <DeleteModalContent
          name={selectedState?.name as string}
          type="state"
          setShowModal={setShowDeleteStateModal}
          onDelete={() => deleteState()}
        />
      </ResizableDialog>
    </main>
  );
};

export default Location;
