import React, { SetStateAction, useEffect, useState } from "react";
import ImageUploader, {
  SelectedImagePreview,
} from "@components/input/ImageUploader";
import { createProductSchema } from "@/store/schemas/createProductSchema";
import { Product, SubCategoryItems } from "@/interface/products";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  cn,
  convertBytesToMB,
  getFormErrorObject,
  safeParseJSON,
} from "@/utils";
import { useRouter } from "next/navigation";
import TextInput from "@components/input/TextInput";
import { SelectInput } from "@components/input/SelectInput";
import TextAreaInput from "@components/input/TextAreaInput";
import Button from "@atom/Button";
import { ProductFormProductInfo } from "@components/product/NewProductPreview";
import {
  createAProductApi,
  CreateProductApiInput,
  updateAProductApi,
} from "@/api/product.client";
import { useToast } from "@components/ui/use-toast";
import {
  DASHBOARD_PRODUCT_ROUTE,
  DASHBOARD_SUBSCRIPTIONS_ROUTE,
} from "@/constants/routes";
import { ApiErrorResponse } from "@/interface/general";
import { ToastAction } from "@components/ui/toast";
import { useCategory } from "@hooks/useCategory";
import { nigerianStatesAndCities } from "@/store/data/location";
import { useUser } from "@/hooks/useUser";

interface Props {
  product?: Product;
  setSelectedPhotos: React.Dispatch<
    SetStateAction<SelectedImagePreview | undefined>
  >;
  selectedPhotos?: SelectedImagePreview;
  setProductInfo: React.Dispatch<SetStateAction<ProductFormProductInfo>>;
  sellerId?: string;
}

export default function ProductForm({
  product,
  setProductInfo,
  setSelectedPhotos,
  selectedPhotos,
  sellerId,
}: Props) {
  const [files, setFiles] = useState<FileList>();
  const [loading, setLoading] = useState(true);
  const [imagesError, setImagesError] = useState("");
  const [imageHasError, setImageHasError] = useState(false);
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  const [hasSetFormValue, setHasSetFormValue] = useState(false);
  const [subCategoriesSelectData, setSubCategoriesSelectData] = useState<
    SubCategoryItems[]
  >([]);
  const [hasChosenCategory, setHasChosenCategory] = useState(false);
  const [cities, setCities] = useState<any[]>([]);

  const {
    formState: { errors },
    handleSubmit,
    control,
    setError,
    watch,
    setValue,
  } = useForm<z.infer<typeof createProductSchema>>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      price: "",
      categoryId: "",
      state: "",
      city: "",
      description: "",
      subCategoryId: "",
      productType: "",
      discount: "",
    },
  });
  const { push: nav, back } = useRouter();
  const { toast } = useToast();
  const { categoriesSelectData, categories } = useCategory();
  const [hasSelectedState, setHasSelectedState] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (!product) {
      setLoading(false);
      return;
    }
    if (hasSetFormValue) {
      setLoading(false);
      return;
    }
    setSelectedPhotos({
      fileName: product.files?.[0]?.id,
      image: {
        name: product.files?.[0]?.meta?.clientName || "",
        url: product.files?.[0]?.url,
      },
    });
    setValue("name", product.name);
    setValue("price", product.price.toString());
    setValue("categoryId", product.categoryId);
    setValue("subCategoryId", product.subCategoryId);
    setValue("state", product.state);
    setValue("city", product.city);
    setValue("description", product.description);
    setValue("discount", product.discount?.toString());
    setValue("productType", product.productType);
    setHasSetFormValue(true);
  }, [hasSetFormValue, product, setSelectedPhotos, setValue]);

  useEffect(() => {
    if (product?.state && !hasSelectedState) {
      handleCities(product?.state);
    }

    if (product?.categoryId && !hasChosenCategory) {
      handleSubcategory(product?.categoryId);
    }

    setProductInfo({
      price: watch("price"),
      name: watch("name"),
      categoryId: watch("categoryId"),
      subCategoryId: watch("subCategoryId"),
      description: watch("description"),
      state: watch("state"),
      city: watch("city"),
      discount: watch("discount") || "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    setProductInfo,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    watch("price"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    watch("name"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    watch("categoryId"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    watch("subCategoryId"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    watch("description"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    watch("state"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    watch("city"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    watch("discount"),
  ]);

  const onSubmit = async (values: z.infer<typeof createProductSchema>) => {
    if (
      (!product && (!files || !files?.length)) ||
      (product &&
        !files?.length &&
        deletedFiles?.length === product?.files?.length)
    ) {
      return setImagesError("Please select at least one image");
    }

    if (!selectedPhotos?.fileName) {
      return setImagesError("Please select a cover image");
    }

    if (imageHasError) return;
    setLoading(true);

    const payload: CreateProductApiInput = {
      ...values,
      files: files!,
      price: Number(values.price),
      userId:
        user?.role === "ADMIN" || user?.role === "STAFF" ? sellerId : user?.id,
      discount: Number(values.discount || 0),
      selectedImage: selectedPhotos?.fileName,
      selectedCategory: categories.find(
        (category) => category.id === values.categoryId,
      )?.name,
      ...(deletedFiles.length
        ? { deleteImages: JSON.stringify(deletedFiles) }
        : {}),
    };

    if (files) {
      const totalFIleSize = convertBytesToMB(
        Array.from(files).reduce((acc, file) => acc + file.size, 0),
      );

      if (totalFIleSize > 10) {
        toast({
          title: `Uploading... (${totalFIleSize}MB)`,
          description: "This may take a while, please wait",
          variant: "info",
          duration: 9000,
        });
      }
    }

    try {
      let productData = product;
      if (product) {
        await updateAProductApi(product.id, payload);
      } else {
        const res = await createAProductApi(payload);
        productData = res.product;

        if (res.msg) {
          toast({
            title: "Product created successfully",
            description: res.msg,
            variant: res?.savedInDraft ? "warning" : "success",
            duration: 15000,
          });
        }
      }
      setTimeout(() => {
        nav(DASHBOARD_PRODUCT_ROUTE + "/" + productData?.id);
      }, 800);
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      const errorResponse: ApiErrorResponse<
        z.infer<typeof createProductSchema>
      > = error;
      const errorObj = getFormErrorObject(errorResponse);
      if (errorObj) {
        if (errorObj.file) setImagesError(errorObj.file);
        const errorArray = Object.entries(errorObj);
        errorArray.forEach(([key, value]) => {
          setError(key as keyof z.infer<typeof createProductSchema>, {
            type: "manual",
            message: value,
          });
        });
        return;
      }

      if (errorResponse.status === 403) {
        if (errorResponse.data?.planName === "Free") {
          toast({
            title: "Product limit reached",
            description: "Upgrade to a paid plan to add more products",
            variant: "destructive",
            duration: 25000,
            action: (
              <ToastAction
                altText="Goto subscribtions to upgrade"
                onClick={() => {
                  window.open(DASHBOARD_SUBSCRIPTIONS_ROUTE, "_blank");
                }}
              >
                Upgrade
              </ToastAction>
            ),
          });
          return;
        } else {
          if (errorResponse.data?.notSubCategory) {
            toast({
              title: "Product limit reached",
              description: `You have reached the limit of products you can create for this category. Try creating a product in your current plan category (${errorResponse.data?.allowedCategoriesName?.join(
                ", ",
              )}), or upgrade to a paid plan that covers this category`,
              variant: "destructive",
              duration: 25000,
            });
            return;
          } else {
            toast({
              title: "Product limit reached",
              description: `You have reached the limit of products you can create on your current plan. Upgrade to a higher plan to create more products`,
              variant: "destructive",
              duration: 25000,
              action: (
                <ToastAction
                  altText="Goto subscribtions to upgrade"
                  onClick={() => {
                    window.open(DASHBOARD_SUBSCRIPTIONS_ROUTE, "_blank");
                  }}
                >
                  Upgrade
                </ToastAction>
              ),
            });
            return;
          }
        }
      }
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleSubcategory = (item: string) => {
    const subcategoryOptions = categories.find((category) => {
      return category?.subcategories?.[0]?.categoryId === item;
    });

    if (!subcategoryOptions) return;
    setHasChosenCategory(true);

    const options = safeParseJSON(
      subcategoryOptions?.subcategories?.[0]?.items,
    );

    const subcategoryItems = options.map((item: SubCategoryItems) => {
      return {
        ...item,
        id: subcategoryOptions?.subcategories?.[0]?.id,
      };
    });

    setSubCategoriesSelectData(subcategoryItems);
  };

  const handleCities = (selectedState: string) => {
    const getSelectedState = nigerianStatesAndCities.find(
      (state) => state.value === selectedState,
    );

    if (!getSelectedState) return;
    setHasSelectedState(true);

    const citiesInState = getSelectedState?.cities?.map((city) => ({
      label: city.name,
      value: city.name,
    }));

    setCities(citiesInState);
  };

  const flexInputs = cn(
    "flex sm:flex-col md:flex-row gap-y-6 gap-x-[0.625rem] tablet:gap-x-[1.25rem]",
  );

  return (
    <div
      className={
        "w-full sm:max-w-[300px] md:max-w-[350px] tablet:max-w-[400px]  sl:max-w-[500px] lg:max-w-[580px] xlg:max-w-[600px] xl:max-w-[700px]"
      }
    >
      <h2 className={"text-md mb-2 font-semibold sm:mb-3 sm:text-[1.5rem] "}>
        {product ? "Edit product" : "Post product"}
      </h2>

      <p className={"sm:text-md mb-4 text-xs text-grey6 sm:mb-10"}>
        Add your products details below
      </p>

      <ImageUploader
        format={"product"}
        name={"product"}
        file={files}
        setValue={setFiles}
        disabled={loading}
        productTopDescription={"Add at least one photo of your product"}
        productBottomDescription={[
          "Each picture must not exceed 5MB",
          "Supported formats are JPEG and PNG",
        ]}
        setSelectedPhotos={setSelectedPhotos}
        errorMessage={imagesError}
        setErrorMessage={setImagesError}
        setHasError={setImageHasError}
        selectedPhotos={selectedPhotos}
        files={product?.files}
        setDeletedFiles={setDeletedFiles}
        deletedFiles={deletedFiles}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={"mt-6 flex w-full flex-col gap-y-6"}
      >
        <div className={flexInputs}>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <TextInput
                {...field}
                wrapperClass={"w-full"}
                placeholder={"Product name"}
                label={"Product name"}
                inputClass="!h-12"
                name={field.name}
                disabled={loading}
                value={field.value || ""}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="price"
            render={({ field }) => (
              <TextInput
                {...field}
                wrapperClass={"w-full"}
                placeholder={"Price"}
                label={"Price"}
                inputClass="!h-12"
                name={field.name}
                disabled={loading}
                value={field.value || ""}
                errorMessage={errors.price?.message}
              />
            )}
          />
        </div>

        <div className={flexInputs}>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <SelectInput
                inputProps={{ ...field }}
                placeholder={"Select category"}
                options={categoriesSelectData}
                inputClass="!min-h-12"
                name={field.name}
                disabled={loading}
                value={field.value || ""}
                emptyMessage={"No category"}
                onValueChange={(value) => {
                  field.onChange(value);
                  handleSubcategory(value);
                }}
                errorMessage={errors.categoryId?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="subCategoryId"
            render={({ field }) => (
              <SelectInput
                inputProps={{ ...field }}
                placeholder={"Select Subcategory"}
                options={subCategoriesSelectData}
                inputClass="!min-h-12"
                name={field.name}
                disabled={loading || !hasChosenCategory}
                value={field.value || ""}
                emptyMessage={"No Subcategory"}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                errorMessage={errors.subCategoryId?.message}
              />
            )}
          />
        </div>

        <div className={flexInputs}>
          <Controller
            control={control}
            name="productType"
            render={({ field }) => (
              <SelectInput
                inputProps={{ ...field }}
                placeholder={"Product type"}
                options={[
                  {
                    label: "New",
                    value: "New",
                  },
                  {
                    label: "Used",
                    value: "Used",
                  },
                ]}
                inputClass="!min-h-12"
                name={field.name}
                disabled={loading}
                value={field.value || ""}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                errorMessage={errors.productType?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="state"
            render={({ field }) => (
              <SelectInput
                inputProps={{ ...field }}
                placeholder={"Select state"}
                options={nigerianStatesAndCities.map((state) => ({
                  label: state.label,
                  value: state.value,
                }))}
                inputClass="!min-h-12"
                name={field.name}
                disabled={loading}
                value={field.value || ""}
                onValueChange={(value) => {
                  field.onChange(value);
                  handleCities(value);
                }}
                emptyMessage={"No States"}
                errorMessage={errors.state?.message}
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name="city"
          render={({ field }) => (
            <SelectInput
              inputProps={{ ...field }}
              placeholder={"Select city"}
              options={cities}
              inputClass="!min-h-12"
              name={field.name}
              disabled={loading || !hasSelectedState}
              value={field.value || ""}
              onValueChange={(value) => {
                field.onChange(value);
              }}
              emptyMessage={"No Cities"}
              errorMessage={errors.city?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="discount"
          render={({ field }) => (
            <SelectInput
              inputProps={{ ...field, value: field.value || "" }}
              placeholder={"Give Discount"}
              options={Array.from({ length: 90 }, (_, index) => ({
                label: `${index}%`,
                value: `${index}`,
              }))}
              inputClass="!min-h-12"
              name={field.name}
              disabled={loading}
              value={field.value || ""}
              onValueChange={(value) => {
                field.onChange(value);
              }}
              emptyMessage={"No Discount"}
              errorMessage={errors.discount?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <TextAreaInput
              {...field}
              wrapperClass={"w-full"}
              placeholder={"Product description"}
              inputClass={cn(`h-[9.375rem] sm:h-[12.5rem]`)}
              name={field.name}
              disabled={loading}
              value={field.value || ""}
              errorMessage={errors.description?.message}
            />
          )}
        />

        <div className={"flex justify-end gap-x-2 sm:gap-x-3.5"}>
          <Button
            format={"tertiary"}
            disabled={loading}
            type={"button"}
            onClick={back}
          >
            Cancel
          </Button>
          <Button format={"primary"} disabled={loading} type={"submit"}>
            {product ? "Update product" : "Post product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
