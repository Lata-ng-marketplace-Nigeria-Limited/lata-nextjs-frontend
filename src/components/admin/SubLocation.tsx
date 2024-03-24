import { City, State } from "@/interface/location";
import React, { useState } from "react";
import XCancelFillIcon from "../atom/icons/XCancelFill";
import AddCity from "./AddCity";
import ResizableDialog from "./ResizableDialog";
import { showToast } from "@/utils";
import { useRouter } from "next/navigation";
import { deleteCityApi } from "@/api/admin.client";
import DeleteModalContent from "./DeleteModalContent";

interface Props {
  selectedState: State;
  showAddCityModal: boolean;
  setShowAddCityModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowDeleteStateModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowStateCitiesModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const SubLocation = (props: Props) => {
  const { refresh } = useRouter();
  const [showDeleteCityModal, setShowDeleteCityModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const deleteCity = async () => {
    if (!props.selectedState) {
      showToast("No state found", "destructive");
      return;
    }
    if (!selectedCity) {
      showToast("No city found", "destructive");
      return;
    }

    try {
      await deleteCityApi(selectedCity?.id);
      setShowDeleteCityModal(false);
      props.setShowStateCitiesModal(false);
      showToast("City deleted successfully", "success");
      refresh();
    } catch (error) {
      showToast(
        (error as any)?.message || "Failed to delete city",
        "destructive",
      );
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-semibold">{props.selectedState?.name}</h3>
        <XCancelFillIcon
          className="ml-1 size-[24px] basis-[20%] cursor-pointer xls:ml-2"
          onClick={() => props.setShowDeleteStateModal(true)}
        />
      </div>
      {props.selectedState?.cities?.length > 0 ? (
        props.selectedState?.cities?.map((city, index) => (
          <div
            key={city.id + index}
            className="mb-6 flex items-center justify-between border-b border-grey7 pb-3"
          >
            <p className="">{city.name}</p>

            <p
              className="flex size-6 cursor-pointer items-center justify-center rounded-full bg-purp2 p-2"
              onClick={() => {
                setSelectedCity(city);
                setShowDeleteCityModal(true);
              }}
            >
              <span className="text-lg">×</span>
            </p>
          </div>
        ))
      ) : (
        <p className="mb-6">No cities found</p>
      )}{" "}
      <div
        className="flex cursor-pointer items-center gap-2"
        onClick={() => props.setShowAddCityModal(true)}
      >
        <p className="flex size-8 items-center justify-center rounded-full bg-purp2 p-2">
          <span className="text-lg font-bold">+</span>
        </p>
        <p> Add City</p>
      </div>
      <ResizableDialog
        isShown={props.showAddCityModal}
        setIsShown={props.setShowAddCityModal}
      >
        <AddCity
          setShowAddCityModal={props.setShowAddCityModal}
          state={props.selectedState as State}
        />
      </ResizableDialog>
      <ResizableDialog
        isShown={showDeleteCityModal}
        setIsShown={setShowDeleteCityModal}
      >
        <DeleteModalContent
          name={selectedCity?.name as string}
          type="city"
          setShowModal={setShowDeleteCityModal}
          onDelete={() => deleteCity()}
        />
      </ResizableDialog>
    </div>
  );
};

export default SubLocation;
