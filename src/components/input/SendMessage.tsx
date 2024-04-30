import React, { SetStateAction, useEffect, useState } from "react";
import { User } from "@/interface/user";
import { Controller, useForm } from "react-hook-form";
import { sendSellerMessageSchema } from "@/store/schemas/sendSellerMessageSchema";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@hooks/useUser";
import { createChatApi } from "@/api/chat";
import { useToast } from "@components/ui/use-toast";
import { ApiErrorResponse } from "@/interface/general";
import { cn, getFormErrorObject, showToast } from "@/utils";
import TextAreaInput from "@components/input/TextAreaInput";
import Button from "@atom/Button";
import { generateSellerAnalyticsApi } from "@/api/view";
import useGetSwitchedRolesQueries from "@/hooks/useGetSwitchedRolesQueries";

interface Props {
  setTypeMessage?: React.Dispatch<SetStateAction<boolean>>;
  sellerInfo?: User | null;
  productId?: string;
  senderId?: string;
  setMessageSent?: React.Dispatch<SetStateAction<boolean>>;
  hideCancel?: boolean;
  productOwnerId?: string;
  isNotProductMessage?: boolean;
  receiverId?: string;
}
export default function SendMessage(props: Props) {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const queries = useGetSwitchedRolesQueries();

  const handleCountMessageClick = async () => {
    try {
      await generateSellerAnalyticsApi(
        "MESSAGE",
        props.productId || "",
        props.productOwnerId || "",
        queries,
      );
    } catch (error) {
      console.log(error);
    }
  };

  const {
    handleSubmit,
    setError,
    reset,
    clearErrors,
    control,
    formState: { errors, isSubmitted },
  } = useForm<z.infer<typeof sendSellerMessageSchema>>({
    resolver: zodResolver(sendSellerMessageSchema),
    defaultValues: {
      message: "",
    },
  });
  const { user, isSocketConnected } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (isSubmitted) {
      reset({
        message: "",
      });
    }
  }, [isSubmitted, reset]);

  useEffect(() => {
    let message =
      "Chat Feature is not available at the moment. Please try again later.";

    if (!user?.id) {
      message = "Please login to send message";
      setError("message", {
        message,
      });
      setErrorMsg(message);
      return;
    }

    if (isSocketConnected) {
      setLoading(false);
      clearErrors("message");
      setErrorMsg("");
      return;
    }

    setError("message", {
      message,
    });
    setErrorMsg(message);
  }, [clearErrors, user, isSocketConnected, setError]);

  const onSubmit = async (
    values: z.infer<typeof sendSellerMessageSchema>,
    e: any,
  ) => {
    if (!props.isNotProductMessage && !props.productId) {
      setError("message", {
        message: "Refresh the page and try again",
      });
      return;
    }

    const messageFromProductPagePayload = {
      productId: props.productId,
      message: values.message,
      senderId: props.senderId || user?.id,
    };

    const messageFromUserProfilePayload = {
      message: values.message,
      receiverId: props.receiverId,
      senderId: props.senderId || user?.id,
    };

    try {
      setLoading(true);
      if (!props.isNotProductMessage) {
        await handleCountMessageClick();
        await createChatApi(messageFromProductPagePayload);
      } else {
        await createChatApi(messageFromUserProfilePayload);
      }
      e.target.reset();
      showToast("Your message has been sent successfully", "success");
      props.setMessageSent?.(true);
    } catch (error: any) {
      console.log("error Message 119", error?.data?.message);
      const errorResponse: ApiErrorResponse<
        z.infer<typeof sendSellerMessageSchema>
      > = error;
      const errorObj = getFormErrorObject(errorResponse);
      if (errorObj) {
        const errorArray = Object.entries(errorObj);
        errorArray.forEach(([key, value]) => {
          setError(key as keyof z.infer<typeof sendSellerMessageSchema>, {
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
      } else {
        if (error && error?.data && error?.data?.message) {
          toast({
            title: "Error",
            description: error?.data?.message,
            variant: "destructive",
          });
          return;
        }
        toast({
          title: "Error",
          description: "Something went wrong. Please try again later",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    props.setTypeMessage?.(false);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        render={({ field }) => (
          <TextAreaInput
            {...field}
            placeholder={"Type your message"}
            inputClass={cn(`
              h-[7.5rem] 
              sm:h-[7.5rem]
              
            `)}
            disabled={loading}
            name={field.name}
            value={field.value || ""}
            errorMessage={errors.message?.message || errorMsg}
          />
        )}
        name={"message"}
        control={control}
      />

      <div className={"mb-2 mt-6 flex justify-end gap-x-3.5"}>
        {!props.hideCancel ? (
          <Button type={"button"} format={"tertiary"} onClick={handleCancel}>
            Cancel
          </Button>
        ) : null}

        <Button type={"submit"} disabled={loading} format={"primary"}>
          Send message
        </Button>
      </div>
    </form>
  );
}
