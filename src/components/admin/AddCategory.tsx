import React, { useState } from "react";
import FormTopLabel from "../input/FormTopLabel";
import TextInput from "../input/TextInput";
import Button from "../atom/Button";
import { createCategoryApi } from "@/api/admin.client";
import { showToast } from "@/utils";
import { useRouter } from "next/navigation";

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const EditCategory = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { refresh } = useRouter();

  const addCategory = async () => {
    if (!categoryName) {
      setErrorMsg("Category name is required");
      return;
    }
    if (!/^[a-zA-Z\s]*$/.test(categoryName)) {
      setErrorMsg(
        "Category name should be a string, without special characters",
      );
      return;
    }

    try {
      setLoading(true);

      const payload: {
        name: string;
        status: "ACTIVE" | "INACTIVE";
        description?: string;
      } = {
        name: categoryName,
        status: "ACTIVE",
      };

      const res = await createCategoryApi(payload);
      showToast("Category created successfully", "success");
      props.setShowModal(false);
      refresh;
    } catch (error) {
      console.log(error);
      showToast("Failed to create category", "destructive");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="">
      <h1 className="mb-6 font-semibold">Add Category</h1>
      <form onSubmit={addCategory}>
        <FormTopLabel
          label="Catgeory name"
          wrapperClass="mb-8"
          labelClass="font-semibold"
        >
          <TextInput
            value={categoryName}
            setValue={setCategoryName}
            errorMessage={errorMsg}
          />
        </FormTopLabel>

        <Button
          format="primary"
          type="submit"
          className={"w-full"}
          disabled={loading}
        >
          Create Category
        </Button>
      </form>
    </div>
  );
};

export default EditCategory;
