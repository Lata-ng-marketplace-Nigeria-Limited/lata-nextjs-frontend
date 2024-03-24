"use client";

import React from "react";
import FormTopLabel from "../input/FormTopLabel";
import TextInput from "../input/TextInput";
import Button from "../atom/Button";
import { createCityApi } from "@/api/admin.client";
import { State } from "@/interface/location";
import { getFormErrorObject, showToast } from "@/utils";
import { useRouter } from "next/navigation";

interface Props {
  state: State;
  setShowAddCityModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const AddCity = (props: Props) => {
  const [cityName, setCityName] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { refresh } = useRouter();

  const addCity = async () => {
    if (!cityName) {
      setErrorMsg("City name is required");
      return;
    }

    const payload = {
      name: cityName,
      stateId: props.state?.id,
      isActive: true,
    };

    try {
      setLoading(true);
      await createCityApi(payload);
      props.setShowAddCityModal(false);
      showToast("City created successfully", "success");
      refresh();
    } catch (error) {
      const errorResponse = error;
      const errorObj = getFormErrorObject(errorResponse as any);
      showToast(errorObj?.stateName || "Failed to create city", "destructive");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <h1 className="mb-6 font-semibold">Add State</h1>
      <form>
        <FormTopLabel
          label="City name"
          wrapperClass="mb-8"
          labelClass="font-semibold"
        >
          <TextInput
            value={cityName}
            setValue={setCityName}
            errorMessage={errorMsg}
          />
        </FormTopLabel>

        <Button
          format="primary"
          className={"w-full"}
          disabled={loading}
          onClick={addCity}
        >
          Add City
        </Button>
      </form>
    </div>
  );
};

export default AddCity;
