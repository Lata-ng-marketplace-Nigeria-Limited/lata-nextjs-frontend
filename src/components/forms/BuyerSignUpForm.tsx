"use client";

import TextInput from "@components/input/TextInput";
import React, { useEffect, useState } from "react";
import Button from "@atom/Button";
import AuthParagraph from "@atom/AuthParagraph";
import ALink from "@atom/ALink";
import { LOGIN_ROUTE } from "@/constants/routes";
import { useFastLocalStore } from "@/store/states/localStore";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { buyerSignUpSchema } from "@/store/schemas/buyerSignUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiErrorResponse } from "@/interface/general";
import { getFormErrorObject } from "@/utils";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@components/ui/use-toast";
import { registerApi } from "@/api/auth.client";

export const BuyerSignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const { setSelectedRole } = useFastLocalStore();
  const { loginUser } = useUser();
  const { toast } = useToast();

  const {
    formState: { errors },
    handleSubmit,
    control,
    setError,
  } = useForm<z.infer<typeof buyerSignUpSchema>>({
    resolver: zodResolver(buyerSignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
  });

  useEffect(() => {
    setSelectedRole("BUYER");
  }, [setSelectedRole]);

  const onSubmit = async (values: z.infer<typeof buyerSignUpSchema>) => {
    setLoading(true);

    try {
      const { publicToken } = await registerApi({
        ...values,
        role: "BUYER",
      });

      if (publicToken) {
        await loginUser(publicToken);
      }
    } catch (error: any) {
      const errorResponse: ApiErrorResponse<z.infer<typeof buyerSignUpSchema>> =
        error;
      const errorObj = getFormErrorObject(errorResponse);
      if (errorObj) {
        const errorArray = Object.entries(errorObj);
        errorArray.forEach(([key, value]) => {
          setError(key as keyof z.infer<typeof buyerSignUpSchema>, {
            type: "manual",
            message: value,
          });
        });
        setLoading(false);
        const rateLimitError = errorObj.retryAfter || "";
        if (rateLimitError) {
          toast({
            title: "Rate limit exceeded",
            description: `Please try again after ${rateLimitError} seconds`,
            variant: "warning",
          });
        }
        return;
      }
      toast({
        description: `Something went wrong`,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <form className={"flex flex-col gap-y-6"} onSubmit={handleSubmit(onSubmit)}>
      <Controller
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder={"Enter full name"}
            label={"Full Name"}
            name={"name"}
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
            placeholder={"Enter email"}
            type="email"
            label={"Email"}
            name={"email"}
            disabled={loading}
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
            placeholder={"Enter Phone number (Optional)"}
            label={"Phone Number"}
            type={"tel"}
            disabled={loading}
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
            placeholder={"Enter Password"}
            label={"Password"}
            type={"password"}
            isPassword
            disabled={loading}
            errorMessage={errors.password?.message}
          />
        )}
        name={"password"}
        control={control}
      />

      <div className={"flex flex-col items-center"}>
        <div className={"w-full flex flex-col gap-y-2"}>
          <Button
            type={"submit"}
            disabled={loading}
            format={"primary"}
            className={"w-full"}
          >
            Create account
          </Button>
        </div>
        <AuthParagraph className={"mt-3"}>
          Already have an account?{" "}
          <ALink href={"/auth" + LOGIN_ROUTE}>Login</ALink>
        </AuthParagraph>
      </div>
    </form>
  );
};
