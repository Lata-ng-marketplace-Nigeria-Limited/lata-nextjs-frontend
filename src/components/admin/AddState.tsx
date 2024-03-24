"use client";

import React from "react";
import Button from "../atom/Button";
import TextInput from "../input/TextInput";
import FormTopLabel from "../input/FormTopLabel";
import { getFormErrorObject, showToast } from "@/utils";
import { createStateApi } from "@/api/admin.client";
import { useRouter } from "next/navigation";

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const AddState = (props: Props) => {
  const [stateName, setStateName] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { refresh } = useRouter();

  const addState = async () => {
    if (!stateName) {
      setErrorMsg("State name is required");
      return;
    }

    const payload = {
      name: stateName,
      countryName: "Nigeria",
      isActive: true,
    };
    try {
      setLoading(true);
      await createStateApi(payload);
      props.setShowModal(false);
      showToast("State created successfully", "success");
      refresh();
    } catch (error) {
      const errorResponse = error;
      const errorObj = getFormErrorObject(errorResponse as any);
      showToast(errorObj?.stateName || "Failed to create state", "destructive");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <h1 className="mb-6 font-semibold">Add State</h1>
      <form>
        <FormTopLabel
          label="Catgeory name"
          wrapperClass="mb-8"
          labelClass="font-semibold"
        >
          <TextInput
            value={stateName}
            setValue={setStateName}
            errorMessage={errorMsg}
          />
        </FormTopLabel>

        <Button
          format="primary"
          className={"w-full"}
          disabled={loading}
          onClick={addState}
        >
          Add State
        </Button>
      </form>
    </div>
  );
};

export default AddState;
