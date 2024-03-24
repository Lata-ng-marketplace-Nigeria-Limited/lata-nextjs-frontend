import React, { useState } from "react";
import Button from "../atom/Button";
import TextInput from "../input/TextInput";
import FormTopLabel from "../input/FormTopLabel";
import { showToast } from "@/utils";
import { createSubCategoryApi } from "@/api/admin.client";
import { useRouter } from "next/navigation";
import { Category } from "@/interface/products";

interface AddSubCategoryProps {
  category: Category;
  setShowAddSubCategory: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddSubCategory = (props: AddSubCategoryProps) => {
  const [loading, setLoading] = useState(false);
  const [subcategoryName, setSubcategoryName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { refresh } = useRouter();

  const addSubCategory = async () => {
    if (!subcategoryName) {
      setErrorMsg("Subcategory name is required");
      return;
    }

    const payload: {
      categoryName: string;
      categoryId: string;
      name: string;
    } = {
      categoryName: props.category?.name,
      categoryId: props.category.id,
      name: subcategoryName,
    };

    try {
      setLoading(true);
      await createSubCategoryApi(payload);
      showToast("Subcatgeory created successfully", "success");
      props.setShowAddSubCategory(false);
      refresh();
    } catch (error) {
      showToast("Failed to  Subcatgeory", "destructive");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="">
      <h1 className="mb-6 font-semibold">Add Subcatgeory</h1>
      <form>
        <FormTopLabel
          label="Subcatgeory name"
          wrapperClass="mb-8"
          labelClass="font-semibold"
        >
          <TextInput
            value={subcategoryName}
            setValue={setSubcategoryName}
            errorMessage={errorMsg}
          />
        </FormTopLabel>

        <Button
          format="primary"
          className={"w-full"}
          disabled={loading}
          onClick={addSubCategory}
        >
          Create Subcatgeory
        </Button>
      </form>
    </div>
  );
};

export default AddSubCategory;
