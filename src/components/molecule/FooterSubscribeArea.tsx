"use client";
import { useEffect, useState } from "react";
import { LataLogo } from "@/components/atom/icons/Lata";
import AuthParagraph from "@/components/atom/AuthParagraph";
import Inputs from "@/components/atom/Input";
import Button from "@/components/atom/Button";
import { cn, getFormErrorObject } from "@/utils";
import { subscribeNewsLetterSchema } from "@/store/schemas/subscribeNewsLetterSchema";
import { ApiErrorResponse } from "@/interface/general";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { joinNewsLetterApi } from "@/api/newsLetterApi";
import { useToast } from "@components/ui/use-toast";

export default function FooterSubscribeArea() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const {
    formState: { errors },
    handleSubmit,
    control,
    setError,
    reset,
  } = useForm<z.infer<typeof subscribeNewsLetterSchema>>({
    resolver: zodResolver(subscribeNewsLetterSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    const error = errors.email?.message;

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [errors.email?.message, toast]);

  const onSubmit = async (
    values: z.infer<typeof subscribeNewsLetterSchema>,
  ) => {
    setLoading(true);
    try {
      await joinNewsLetterApi(values.email);
      toast({
        title: "Success",
        description: "You have successfully subscribe to our newsletter!",
        variant: "success",
      });
      reset();
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = error;
      const errorObj = getFormErrorObject(errorResponse);
      if (errorObj) {
        const errorArray = Object.entries(errorObj);
        errorArray.forEach(([key, value]) => {
          setError(key as keyof z.infer<typeof subscribeNewsLetterSchema>, {
            type: "manual",
            message: value,
          });
        });
        return;
      }
      setError("email", {
        type: "manual",
        message: "Something went wrong, please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(`
        w-full
        sm:max-w-[200px]
        tablet:max-w-[280px]
        lg:max-w-[400px]
    `)}
    >
      <LataLogo className="w-[3.5rem] h-[1.4rem] tablet:w-[4.2rem] tablet:h-[1.6rem]" />
      <AuthParagraph className="text-offwhite text-xs sm:text-xs tablet:text-sm mt-3 mb-4 max-w-[41ch]">
        Subscribe to our newsletter to receive mails about our latest updates
      </AuthParagraph>
      <form className="" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          render={({ field }) => (
            <Inputs
              type={"email"}
              className={cn(`
                bg-primary
                hover:border-grey5
                focus:border-grey5
                text-white
                mb-4
                tablet:mb-6
                sm:h-[2rem]
                tablet:h-12 
                caret-white
                disabled:bg-primary
              `)}
              placeholder="Enter your email"
              disabled={loading}
              name={field.name}
              value={field.value || ""}
              ignoreBorderDefaultStyle
            />
          )}
          name={"email"}
          control={control}
        />

        <Button
          type={"submit"}
          format={"tertiary"}
          disabled={loading}
          className={cn(`
            w-full
            bg-white
            sm:py-1 
            sm:px-4 
            tablet:py-3 
            tablet:px-6 
        `)}
        >
          Subscribe
        </Button>
      </form>
    </div>
  );
}
