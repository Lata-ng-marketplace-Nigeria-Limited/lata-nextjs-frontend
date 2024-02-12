// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useSearchParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { sellerSignUpSchema } from "@/store/schemas/sellerSignUpSchema";
// import { z } from "zod";
// import {
//     cn,
//   convertBytesToMB,
//   getFormErrorObject,
//   isFileSizeGreaterThan,
// } from "@/utils";
// import { ApiErrorResponse } from "@/interface/general";
// import { registerApi } from "@/api/auth.client";
// import { useRegistrationFormStore } from "@/store/states/userState";
// import TextInput from "../input/TextInput";
// import Button from "../atom/Button";
// import ImageUploader from "../input/ImageUploader";
// import { toast } from "../ui/use-toast";

// const AddSellerForm = () => {
//   const [loading, setLoading] = useState(false);
//   const [file, setFile] = useState<FileList>();
//   const [imageErrorMessage, setImageErrorMessage] = useState("");
//   const [avatar, setAvatar] = useState("");
//   const [count, setCount] = useState<number>(30);
//   const [hasSetValue, setHasSetValue] = useState(false);
//   const searchParams = useSearchParams();

//   const { isUpgradingToSeller, shouldCompleteForm, ...registerData } =
//     useRegistrationFormStore();

//   const {
//     formState: { errors },
//     handleSubmit,
//     control,
//     setError,
//     setValue,
//   } = useForm<z.infer<typeof sellerSignUpSchema>>({
//     resolver: zodResolver(sellerSignUpSchema),
//     defaultValues: {
//       name: "",
//       password: "",
//       phoneNumber: "",
//       email: "",
//       address: "",
//       aboutBusiness: "",
//     },
//   });

//   useEffect(() => {
//     if (!file?.length) return;
//     const uploadedFile = file?.[0]!;
//     if (isFileSizeGreaterThan(uploadedFile, 5)) {
//       setImageErrorMessage(
//         "Image size cannot be greater than 5mb. Current image is " +
//           convertBytesToMB(uploadedFile.size) +
//           "mb",
//       );
//     } else {
//       setImageErrorMessage("");
//     }
//   }, [file]);

//   const onSubmit = async (values: z.infer<typeof sellerSignUpSchema>) => {
//     if (imageErrorMessage) return;
//     const allValues = {
//       ...values,
//       ...(file?.[0] ? { file: file?.[0] } : {}),
//     };
//     setLoading(true);
//     try {
//       // Use role of SELLER for seller register
//       const { message, authorized, publicToken } = await registerApi({
//         ...allValues,
//         role: "SELLER",
//         shouldCompleteProfile: shouldCompleteForm,
//       });

//       const params = new URLSearchParams(searchParams);
//       params.delete("isUpgradingToSeller");
//     } catch (error: any) {
//       const errorResponse: ApiErrorResponse<
//         z.infer<typeof sellerSignUpSchema>
//       > = error;
//       const errorObj = getFormErrorObject(errorResponse);

//       if (errorObj) {
//         setLoading(false);
//         if (errorObj.file) setImageErrorMessage(errorObj.file);
//         const errorArray = Object.entries(errorObj);
//         errorArray.forEach(([key, value]) => {
//           setError(key as keyof z.infer<typeof buyerSignUpSchema>, {
//             type: "manual",
//             message: value,
//           });
//         });
//         return;
//       }

//       setLoading(false);
//       toast({
//         description: `Something went wrong`,
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <form className={"flex flex-col gap-y-6"} onSubmit={handleSubmit(onSubmit)}>
//       <ImageUploader
//         format={"profile"}
//         name={"profile"}
//         file={file}
//         disabled={loading}
//         setValue={setFile}
//         imageUrl={avatar}
//         errorMessage={imageErrorMessage}
//         profileDescription={"Add a profile picture or your business logo"}
//       />

//       <Controller
//         render={({ field }) => (
//           <TextInput
//             {...field}
//             placeholder="Enter business name"
//             label={"Business name"}
//             name={"field.name"}
//             disabled={loading}
//             errorMessage={errors.name?.message}
//           />
//         )}
//         name={"name"}
//         control={control}
//       />

//       <Controller
//         render={({ field }) => (
//           <TextInput
//             {...field}
//             placeholder="Enter email"
//             type="email"
//             label={"Email"}
//             disabled={shouldCompleteForm || loading}
//             errorMessage={errors.email?.message}
//           />
//         )}
//         name={"email"}
//         control={control}
//       />

//       <Controller
//         render={({ field }) => (
//           <TextInput
//             {...field}
//             placeholder="Enter business location"
//             label={"Business location"}
//             disabled={loading}
//             errorMessage={errors.address?.message}
//           />
//         )}
//         name={"address"}
//         control={control}
//       />

//       <Controller
//         render={({ field }) => (
//           <TextInput
//             {...field}
//             placeholder={"Enter Phone number"}
//             label={"Phone number"}
//             errorMessage={errors.phoneNumber?.message}
//           />
//         )}
//         name={"phoneNumber"}
//         control={control}
//       />

//       <Controller
//         render={({ field }) => (
//           <TextInput
//             {...field}
//             placeholder="About business"
//             label={"About business"}
//             disabled={loading}
//             errorMessage={errors.aboutBusiness?.message}
//           />
//         )}
//         name={"aboutBusiness"}
//         control={control}
//       />

//       <Controller
//         render={({ field }) => (
//           <TextInput
//             {...field}
//             placeholder="Enter password"
//             type="password"
//             label={"Password"}
//             isPassword
//             disabled={shouldCompleteForm || loading}
//             name={"field.name"}
//             wrapperClass={cn({
//               hidden: shouldCompleteForm,
//             })}
//             errorMessage={errors.password?.message}
//           />
//         )}
//         name={"password"}
//         control={control}
//       />

//       <div className={cn("flex w-full flex-col items-center gap-y-3")}>
//         <div className={"flex w-full flex-col gap-y-2"}>
//           <Button
//             type={"submit"}
//             disabled={loading}
//             format={"primary"}
//             className={"w-full"}
//           >
//             {isUpgradingToSeller
//               ? "Upgrade"
//               : shouldCompleteForm
//                 ? "Complete sign up"
//                 : "Create account"}
//           </Button>
//         </div>

//       </div>
//     </form>
//   );
// };

// export default AddSellerForm;
