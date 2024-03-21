import React, { useEffect, useState } from "react";
import FormTopLabel from "../input/FormTopLabel";
import TextInput from "../input/TextInput";
import Button from "../atom/Button";
import { createCategoryApi } from "@/api/admin.client";
import {
  convertBytesToMB,
  getFormErrorObject,
  isFileSizeGreaterThan,
  showToast,
} from "@/utils";
import { useRouter } from "next/navigation";
import ImageUploader from "../input/ImageUploader";

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

type CategoryStatusTypes = "ACTIVE" | "INACTIVE";
type Payload = {
  name: string;
  status: CategoryStatusTypes;
  description?: string;
  file: File;
};

const AddCategory = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { refresh } = useRouter();
  const [file, setFile] = useState<FileList>();
  const [imageErrorMessage, setImageErrorMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");

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
    if (imageErrorMessage) {
      showToast(imageErrorMessage, "destructive");
      return;
    }
    const payload: Payload = {
      name: categoryName,
      status: "ACTIVE",
      file: file?.[0]!,
    };
    try {
      setLoading(true);
      await createCategoryApi(payload);
      showToast("Category created successfully", "success");
      props.setShowModal(false);
      refresh();
    } catch (error) {
      console.log(error);
      const errorResponse = error;
      const errorObj = getFormErrorObject(errorResponse as any);
      showToast(errorObj?.file || "Failed to create category", "destructive");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!file?.length) return;
    const uploadedFile = file?.[0]!;
    console.log(uploadedFile);
    if (isFileSizeGreaterThan(uploadedFile, 10)) {
      setImageErrorMessage(
        "Image size cannot be greater than 5mb. Current image is " +
          convertBytesToMB(uploadedFile.size) +
          "mb",
      );
    } else {
      setImageErrorMessage("");
    }
  }, [file]);

  return (
    <div className="">
      <h1 className="mb-6 font-semibold">Add Category</h1>
      <form>
        <ImageUploader
          format={"profile"}
          name={"profile"}
          file={file}
          disabled={loading}
          setValue={setFile}
          imageUrl={imageUrl}
          errorMessage={imageErrorMessage}
          profileDescription={"Add a category image"}
        />

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
          // type="submit"
          className={"w-full"}
          disabled={loading}
          onClick={addCategory}
        >
          Create Category
        </Button>
      </form>
    </div>
  );
};

export default AddCategory;
