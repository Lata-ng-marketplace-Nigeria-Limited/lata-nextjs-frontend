import { SetNewPasswordForm } from "@components/forms/SetNewPasswordForm";
import { verifyOtpApi } from "@/actions/auth";

interface Props {
  code: string;
}
export const SetPasswordWrapper = async ({ code }: Props) => {
  console.log("[SetPasswordWrapper] Calling verifyOtpApi with code length:", code?.length);
  const response = await verifyOtpApi({
    token: code,
  });
  console.log("[SetPasswordWrapper] verifyOtpApi response:", JSON.stringify(response));
  return (
    <>
      <SetNewPasswordForm response={response} />
    </>
  );
};
