"use client";

import { Controller, useForm } from "react-hook-form";
import { sellerSignUpSchema } from "@/store/schemas/sellerSignUpSchema";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import ImageUploader from "@components/input/ImageUploader";
import TextInput from "@components/input/TextInput";
import {
  clearAllCookies,
  cn,
  convertBytesToMB,
  deleteCookies,
  getFormErrorObject,
  isFileSizeGreaterThan,
} from "@/utils";
import AuthParagraph from "@atom/AuthParagraph";
import { LOGIN_ROUTE } from "@/constants/routes";
import ALink from "@atom/ALink";
import Button from "@atom/Button";
import { useUser } from "@/hooks/useUser";
import { ApiErrorResponse } from "@/interface/general";
import { useToast } from "@components/ui/use-toast";
import { buyerSignUpSchema } from "@/store/schemas/buyerSignUpSchema";
import { useInterval } from "usehooks-ts";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useFastLocalStore } from "@/store/states/localStore";
import { useRegistrationFormStore } from "@/store/states/userState";
import { signOut } from "next-auth/react";
import { registerApi } from "@/api/auth.client";

export const SellerSignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<FileList>();
  const [imageErrorMessage, setImageErrorMessage] = useState("");
  const [avatar, setAvatar] = useState("");
  const [count, setCount] = useState<number>(30);
  const [delay, _] = useState<number>(1000);
  const [isPlaying, setPlaying] = useState<boolean>(false);
  const [hasSetValue, setHasSetValue] = useState(false);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const { loginUser, clear } = useUser();
  const { toast } = useToast();
  const nav = useRouter();
  const { setSelectedRole } = useFastLocalStore();
  const {
    isUpgradingToSeller,
    setRegistrationForm,
    shouldCompleteForm,
    ...registerData
  } = useRegistrationFormStore();

  const {
    formState: { errors },
    handleSubmit,
    control,
    setError,
    setValue,
  } = useForm<z.infer<typeof sellerSignUpSchema>>({
    resolver: zodResolver(sellerSignUpSchema),
    defaultValues: {
      name: "",
      password: "",
      phoneNumber: "",
      email: "",
      address: "",
      aboutBusiness: "",
      referrerCode: "",
    },
  });

  useEffect(() => {
    if (params.get("ref")) {
      setValue("referrerCode", params.get("ref") as string);
      setRegistrationForm({
        ...registerData,
        referrerCode: params.get("ref") as string,
      });
    }
  }, [params.get("ref")]);

  useEffect(() => {
    setSelectedRole("SELLER");
  }, [setSelectedRole]);

  useEffect(() => {
    if (hasSetValue) return;
    if (registerData.email && shouldCompleteForm) {
      setAvatar(registerData.avatar);
      setValue("name", registerData.name);
      setValue("email", registerData.email);
      setValue("phoneNumber", registerData.phoneNumber);
      setValue("password", "CompleteUserRegistration123$");
      setValue("aboutBusiness", registerData.aboutBusiness);
      setValue("address", registerData.address);
      setValue("referrerCode", registerData.referrerCode);
      setHasSetValue(true);
    }
  }, [registerData, setValue, hasSetValue, shouldCompleteForm]);

  useEffect(() => {
    if (!file?.length) return;
    const uploadedFile = file?.[0]!;
    if (isFileSizeGreaterThan(uploadedFile, 5)) {
      setImageErrorMessage(
        "Image size cannot be greater than 5mb. Current image is " +
          convertBytesToMB(uploadedFile.size) +
          "mb",
      );
    } else {
      setImageErrorMessage("");
    }
  }, [file]);

  useInterval(
    () => {
      const updatedCount = count - 1;
      setCount(updatedCount);
      if (updatedCount === 0) {
        setPlaying(false);
        nav.push("/auth" + LOGIN_ROUTE);
      }
    },
    // Delay in milliseconds or null to stop it
    isPlaying ? delay : null,
  );

  const onSubmit = async (values: z.infer<typeof sellerSignUpSchema>) => {
    if (imageErrorMessage) return;
    const allValues = {
      ...values,
      ...(file?.[0] ? { file: file?.[0] } : {}),
    };
    setLoading(true);
    try {
      // Use role of SELLER for seller register
      const { message, authorized, publicToken } = await registerApi({
        ...allValues,
        role: "SELLER",
        shouldCompleteProfile: shouldCompleteForm,
      });

      // For seller they need to verify email before they can logging
      if (!authorized && !publicToken) {
        setPlaying(true);
        toast({
          title: "Success",
          description: `${message}. You will be redirected to login page in 30 seconds`,
          variant: "success",
          duration: 10000,
        });
      }

      const params = new URLSearchParams(searchParams);
      params.delete("isUpgradingToSeller");

      // For sellers that have completed their registration. They can login
      if (authorized && publicToken && !isUpgradingToSeller) {
        await loginUser(publicToken, isUpgradingToSeller);
      }

      if (authorized && publicToken && isUpgradingToSeller) {
        toast({
          title: "Success",
          variant: "success",
          description: `Please login again`,
        });

        localStorage.clear();
        sessionStorage.clear();
        clearAllCookies();
        clear();
        await signOut({ redirect: true, callbackUrl: "/auth" + LOGIN_ROUTE });
      }
    } catch (error: any) {
      const errorResponse: ApiErrorResponse<
        z.infer<typeof sellerSignUpSchema>
      > = error;
      const errorObj = getFormErrorObject(errorResponse);

      if (errorObj) {
        setLoading(false);
        if (errorObj.file) setImageErrorMessage(errorObj.file);
        const errorArray = Object.entries(errorObj);
        errorArray.forEach(([key, value]) => {
          setError(key as keyof z.infer<typeof buyerSignUpSchema>, {
            type: "manual",
            message: value,
          });
        });
        return;
      }

      setLoading(false);
      toast({
        description: `Something went wrong`,
        variant: "destructive",
      });
    }
  };

  return (
    <form className={"flex flex-col gap-y-6"} onSubmit={handleSubmit(onSubmit)}>
      <ImageUploader
        format={"profile"}
        name={"profile"}
        file={file}
        disabled={loading}
        setValue={setFile}
        imageUrl={avatar}
        errorMessage={imageErrorMessage}
        profileDescription={"Add a profile picture or your business logo"}
      />

      <Controller
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder="Enter business name"
            label={"Business name"}
            name={"field.name"}
            disabled={loading}
            errorMessage={errors.name?.message}
          />
        )}
        name={"name"}
        control={control}
      />

      <Controller
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder="Enter email"
            type="email"
            label={"Email"}
            disabled={shouldCompleteForm || loading}
            errorMessage={errors.email?.message}
          />
        )}
        name={"email"}
        control={control}
      />

      <Controller
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder="Enter business location"
            label={"Business location"}
            disabled={loading}
            errorMessage={errors.address?.message}
          />
        )}
        name={"address"}
        control={control}
      />

      <Controller
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder={"Enter Phone number"}
            label={"Phone number"}
            errorMessage={errors.phoneNumber?.message}
          />
        )}
        name={"phoneNumber"}
        control={control}
      />

      <Controller
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder="About business"
            label={"About business"}
            disabled={loading}
            errorMessage={errors.aboutBusiness?.message}
          />
        )}
        name={"aboutBusiness"}
        control={control}
      />

      <Controller
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder="Enter password"
            type="password"
            label={"Password"}
            isPassword
            disabled={shouldCompleteForm || loading}
            name={"field.name"}
            wrapperClass={cn({
              hidden: shouldCompleteForm,
            })}
            errorMessage={errors.password?.message}
          />
        )}
        name={"password"}
        control={control}
      />

      <Controller
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder="Referrer ID (Optional)"
            type="text"
            label={"Referrer ID (Optional)"}
            disabled={shouldCompleteForm || loading || !!params.get("ref")}
            name={field.name}
            value={field.value || ""}
            errorMessage={errors.referrerCode?.message}
          />
        )}
        name={"referrerCode"}
        control={control}
      />

      <div className={cn("flex w-full flex-col items-center gap-y-3")}>
        <div className={"flex w-full flex-col gap-y-2"}>
          <Button
            type={"submit"}
            disabled={loading}
            format={"primary"}
            className={"w-full"}
          >
            {isUpgradingToSeller
              ? "Upgrade"
              : shouldCompleteForm
                ? "Complete sign up"
                : "Create account"}
          </Button>
        </div>

        {isUpgradingToSeller ? null : (
          <AuthParagraph>
            Already have an account?{" "}
            <ALink href={"/auth" + LOGIN_ROUTE}>Login</ALink>
          </AuthParagraph>
        )}
      </div>
    </form>
  );
};
