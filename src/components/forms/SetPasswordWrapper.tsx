import { SetNewPasswordForm } from "@components/forms/SetNewPasswordForm";
import { verifyOtpApi } from "@/actions/auth";

interface Props {
  code: string;
}
export const SetPasswordWrapper = async ({ code }: Props) => {
  const response = await verifyOtpApi({
    token: code,
  });
  return (
    <>
      <SetNewPasswordForm response={response} />
    </>
  );
};
