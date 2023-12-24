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
import { cn, getFormErrorObject } from "@/utils";
import TextAreaInput from "@components/input/TextAreaInput";
import Button from "@atom/Button";

interface Props {
  setTypeMessage?: React.Dispatch<SetStateAction<boolean>>;
  sellerInfo?: User | null;
  productId?: string;
  setMessageSent?: React.Dispatch<SetStateAction<boolean>>;
  buyerId?: string;
  hideCancel?: boolean;
}
export default function SendSellerMessage(props: Props) {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    handleSubmit,
    setError,
    reset,
    clearErrors,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof sendSellerMessageSchema>>({
    resolver: zodResolver(sendSellerMessageSchema),
    defaultValues: {
      message: "",
    },
  });
  const { user, isSocketConnected } = useUser();
  const { toast } = useToast();

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

  const onSubmit = async (values: z.infer<typeof sendSellerMessageSchema>) => {
    if (!props.productId) {
      setError("message", {
        message: "Refresh the page and try again",
      });
      return;
    }

    setLoading(true);
    try {
      await createChatApi({
        productId: props.productId,
        message: values.message,
        buyerId: props.buyerId,
      });
      toast({
        title: "Success",
        description: "Your message has been sent successfully",
        variant: "success",
      });
      props.setMessageSent?.(true);
      reset();
    } catch (error: any) {
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

      <div className={"flex justify-end mt-6 gap-x-3.5 mb-2"}>
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
