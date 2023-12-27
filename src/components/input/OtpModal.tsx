import React, {
  FormEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { cn, formatNigerianPhoneNumber } from "@/utils";
import { useToast } from "@components/ui/use-toast";
import { ApiErrorResponse } from "@/interface/general";
import HeaderText from "@atom/HeaderText";
import TextInput from "@components/input/TextInput";
import ResendEmail from "@molecule/ResendEmail";
import Button from "@atom/Button";
import {
  getChangePhoneOtpApi,
  UpdateUserProfileInput,
  verifyChangePhoneOtpApi,
} from "@/api/auth.client";

interface OtpModalProps {
  setIsShown: React.Dispatch<SetStateAction<boolean>>;
  updatePayload?: UpdateUserProfileInput;
  setHasUpdated: React.Dispatch<SetStateAction<boolean>>;
}

export default function OtpModal(props: OtpModalProps) {
  const [otp, setOtp] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [showResendOtp, setShowResendOtp] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { toast } = useToast();

  const getOtp = useCallback(
    async (close: boolean = false) => {
      setResendLoading(true);
      try {
        await getChangePhoneOtpApi(
          formatNigerianPhoneNumber(props.updatePayload?.phoneNumber || "") ||
            "",
        );
        setLoading(false);
        toast({
          title: "Success",
          description: "OTP sent successfully",
          variant: "success",
        });
        setShowResendOtp(true);
      } catch (error: any) {
        const errorRes: ApiErrorResponse = error;
        const errArr = errorRes?.data?.error || [];
        let hasError = false;
        errArr.forEach((err: any) => {
          if (err.field === "phone") {
            toast({
              title: "Error",
              description: err.message,
              variant: "destructive",
            });
            hasError = true;
          }
        });
        if (close) {
          props.setIsShown(false);
        }
        if (!hasError) {
          toast({
            title: "Error",
            description: "An error occurred while sending OTP",
            variant: "destructive",
          });
        }
      } finally {
        setResendLoading(false);
      }
    },
    [props, toast],
  );

  useEffect(() => {
    (async () => await getOtp(true))();
  }, [getOtp]);

  const handleCancel = () => {
    props.setIsShown(false);
  };

  const handleResendOtp = async (
    setRestart: React.Dispatch<SetStateAction<boolean>>,
  ) => {
    await getOtp();
    setRestart(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await verifyChangePhoneOtpApi(otp);
      toast({
        title: "Success",
        description: "Phone number verified and updated successfully",
        variant: "destructive",
      });
      props.setHasUpdated(true);
      props.setIsShown(false);
    } catch (error: any) {
      const errorRes: ApiErrorResponse = error;
      const errArr = errorRes?.data?.error || [];

      if (errorRes?.data?.message) {
        setErrMsg(errorRes?.data?.message);
      }

      errArr.forEach((err: any) => {
        if (err.field === "otp") {
          setErrMsg(err.message);
        }
      });
    }
  };

  return (
    <div className={cn(`max-w-[30rem] flex flex-col gap-y-6`)}>
      <HeaderText>Enter OTP</HeaderText>
      <p className={"text-sm"}>
        You are trying to change your phone number. To continue, please enter
        the OTP sent to this number {props.updatePayload?.phoneNumber}
      </p>

      <form className={"flex flex-col gap-y-6"} onSubmit={handleSubmit}>
        <div>
          <TextInput
            disabled={loading}
            placeholder={"Enter otp"}
            value={otp}
            setValue={setOtp}
            errorMessage={errMsg}
            onInput={() => {
              setErrMsg("");
            }}
          />

          {showResendOtp ? (
            <ResendEmail
              onCountDownEnd={() => {}}
              startCountDown={true}
              buttonClass={cn("font-medium")}
              // spanTextClass={"text-slate-50"}
              initialCount={60}
              disabledBtn={resendLoading}
              onResendEmail={handleResendOtp}
            >
              Resend OTP
            </ResendEmail>
          ) : null}
        </div>

        <div className={"flex justify-end gap-x-4"}>
          <Button
            type={"button"}
            disabled={loading}
            format={"tertiary"}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button type={"submit"} disabled={loading || !otp} format={"primary"}>
            Verify
          </Button>
        </div>
      </form>
    </div>
  );
}
