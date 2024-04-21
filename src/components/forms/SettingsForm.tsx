"use client";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@hooks/useUser";
import { User, UserRole } from "@/interface/user";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { settingsSchema } from "@/store/schemas/settingsSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  cn,
  formatNigerianPhoneNumber,
  formSetErrors,
  getFormErrorObject,
} from "@/utils";
import ImageUploader from "@components/input/ImageUploader";
import TextInput from "@components/input/TextInput";
import FormTopLabel from "@components/input/FormTopLabel";
import TextAreaInput from "@components/input/TextAreaInput";
import { Toggle } from "@molecule/Toggle";
import Button from "@atom/Button";
import Modal from "@molecule/Modal";
import {
  validateChangePassword,
  validateSellerSettings,
} from "@/store/validation/settingsUpdate";
import { USER_VERIFIED_PHONE } from "@/constants/others";
import { useToast } from "@components/ui/use-toast";
import { ApiErrorResponse } from "@/interface/general";
import OtpModal from "@components/input/OtpModal";
import {
  updateUserProfileApi,
  UpdateUserProfileInput,
} from "@/api/auth.client";
import { useRoleSwitchStore } from "@/store/states/localStore";
import useGetSwitchedRolesQueries from "@/hooks/useGetSwitchedRolesQueries";

interface Props {
  image?: string;
}
export const SettingsForm = ({ image }: Props) => {
  const [imageHasError, setImageHasError] = useState(false);
  const [file, setFile] = useState<FileList>();
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageErrorMessage, setImageErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [hasUpdatedPhone, setHasUpdatedPhone] = useState(false);
  const [updatePayload, setUpdatePayload] = useState<UpdateUserProfileInput>();
  const [role, setRole] = useState<UserRole>("BUYER");
  const [userDataInfo, setUserDataInfo] = useState<User | null>(null);
  const [notificationSettings, setNotificationSettings] = useState({
    feature: false,
    subscription: false,
    message: false,
    feedback: false,
  });
  const [hasMounted, setHasMounted] = useState(false);
  const [
    hasUpdatedFormAfterProfileUpdate,
    setHasUpdatedFormAfterProfileUpdate,
  ] = useState(false);

  const {
    formState: { errors },
    setError,
    handleSubmit,
    setValue,
    control,
  } = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
  });
  const { user, updateUser } = useUser();
  const { toast } = useToast();
  const { sessionSwitched } = useGetSwitchedRolesQueries();
  const { sessionUser } = useRoleSwitchStore();

  useEffect(() => {
    if (!user?.email) return;
    if (hasMounted) return;
    if (sessionSwitched && sessionUser) {
      setUserDataInfo(sessionUser);
    } else {
      setUserDataInfo(user);
    }
    console.log("sessionuser 85", sessionUser?.settings);
    setHasMounted(true);
    setLoading(false);
  }, [user?.email]);

  useEffect(() => {
    // updates the form values AFTER profile update from server
    if (hasUpdatedFormAfterProfileUpdate) return;
    if (!hasMounted) return;
    if (loading) return;

    setAvatar(userDataInfo?.avatar || "");
    setValue("name", userDataInfo?.name || "");
    setValue("email", userDataInfo?.email || "");
    setValue("phoneNumber", userDataInfo?.phoneNumber || "");
    setValue("address", userDataInfo?.address || "");
    setValue("aboutBusiness", userDataInfo?.aboutBusiness || "");
    setRole(userDataInfo?.role || "BUYER");

    const notifSettings = user?.settings.find(
      (set) => set.columnName === "USER_NOTIFICATION_SETTING",
    );

    if (notifSettings) {
      setNotificationSettings((prev) => ({
        ...prev,
        ...notifSettings.columnValue,
      }));
    }

    setHasUpdatedFormAfterProfileUpdate(true);
  }, [user, hasMounted, loading, hasUpdatedFormAfterProfileUpdate]);

  const onSubmit = async (values: z.infer<typeof settingsSchema>) => {
    if (role === "SELLER") {
      const error = validateSellerSettings({
        address: values.address,
        aboutBusiness: values.aboutBusiness,
        phoneNumber: values.phoneNumber,
      });
      if (Object.values(error).some((e) => e !== "")) {
        formSetErrors(error, setError);
        return;
      }
    }
    if (values.oldPassword || values.newPassword || values.confirmPassword) {
      const error = validateChangePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      if (Object.values(error).some((e) => e !== "")) {
        formSetErrors(error, setError);
        return;
      }
    }

    if (imageHasError) return;

    let payload: UpdateUserProfileInput;

    if (sessionSwitched) {
      payload = {
        ...values,
        ...(file?.[0] ? { file: file?.[0] } : {}),
      };
    } else {
      payload = {
        ...values,
        ...(file?.[0] ? { file: file?.[0] } : {}),
        ...notificationSettings,
      };
    }

    if(!sessionSwitched){
      if (
        values.phoneNumber &&
        values.phoneNumber !== user?.phoneNumber &&
        !hasUpdatedPhone
      ) {
        const phoneNumberSetting = user?.settings.find((set) => {
          return set.columnName === USER_VERIFIED_PHONE;
        });
  
        if (
          !phoneNumberSetting ||
          (phoneNumberSetting &&
            phoneNumberSetting?.columnValue?.phoneNumber !==
              formatNigerianPhoneNumber(values.phoneNumber)) ||
          (phoneNumberSetting && !phoneNumberSetting?.columnValue?.verified)
        ) {
          setUpdatePayload(payload);
          setShowModal(true);
          return;
        }
      }
    }

    setLoading(true);
    try {
      const { userData } = await updateUserProfileApi(payload);
      updateUser(userData);
      toast({
        title: "Success!",
        description: "Profile updated successfully",
        variant: "success",
      });
    } catch (error: any) {
      const errorResponse: ApiErrorResponse<z.infer<typeof settingsSchema>> =
        error;

      const errorObj = getFormErrorObject(errorResponse);
      if (errorObj) {
        if (errorObj.file) setImageErrorMessage(errorObj.file);
        formSetErrors(errorObj, setError);
        return;
      }
      toast({
        title: "Error!",
        description: "An error has occurred. Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetNotificationSettings = useCallback(
    (value: boolean, key: string) => {
      setNotificationSettings((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );
  const sidesClass = cn(
    `p-6 border border-offwhite rounded-[7px] sm:rounded-[10px] flex flex-col gap-y-6 w-full `,
  );
  const titleClass = cn(`text-xs sm:text-base text-grey9 font-semibold`);

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div
        className={"flex flex-col justify-between gap-x-6 gap-y-6 sm:flex-row"}
      >
        <div className={sidesClass}>
          <h3 className={titleClass}>Profile details</h3>
          <ImageUploader
            format={"profile"}
            file={file}
            name={"file"}
            key={avatar}
            setValue={setFile}
            disabled={loading}
            imageUrl={avatar}
            errorMessage={imageErrorMessage}
            setHasError={setImageHasError}
          />

          <Controller
            render={({ field }) => (
              <FormTopLabel label={"Full name"}>
                <TextInput
                  {...field}
                  placeholder={"Enter your full name"}
                  disabled={loading}
                  name={field.name}
                  value={field.value || ""}
                  errorMessage={errors.name?.message}
                />
              </FormTopLabel>
            )}
            name={"name"}
            control={control}
          />

          <Controller
            render={({ field }) => (
              <FormTopLabel label={"Email"}>
                <TextInput
                  {...field}
                  placeholder={"Enter email"}
                  type={"email"}
                  disabled={true}
                  name={field.name}
                  value={field.value || ""}
                  errorMessage={errors.email?.message}
                />
              </FormTopLabel>
            )}
            name={"email"}
            control={control}
          />

          <Controller
            render={({ field }) => (
              <FormTopLabel label={"Phone number"}>
                <TextInput
                  {...field}
                  placeholder={"Enter your phone number"}
                  name={field.name}
                  value={field.value || ""}
                  disabled={loading}
                  errorMessage={errors.phoneNumber?.message}
                  autoComplete="off"
                />
              </FormTopLabel>
            )}
            name={"phoneNumber"}
            control={control}
          />

          <Controller
            render={({ field }) => (
              <FormTopLabel
                label={role === "BUYER" ? "Address" : "Business address"}
              >
                <TextAreaInput
                  {...field}
                  placeholder={"Enter address"}
                  name={field.name}
                  value={field.value || ""}
                  disabled={loading}
                  errorMessage={errors.address?.message}
                />
              </FormTopLabel>
            )}
            name={"address"}
            control={control}
          />

          <Controller
            render={({ field }) => (
              <FormTopLabel label={role === "BUYER" ? "Bio" : "About business"}>
                <TextAreaInput
                  {...field}
                  placeholder={"Enter description"}
                  name={field.name}
                  value={field.value || ""}
                  disabled={loading}
                  errorMessage={errors.aboutBusiness?.message}
                />
              </FormTopLabel>
            )}
            name={"aboutBusiness"}
            control={control}
          />
        </div>

        <div className={"flex w-full flex-col gap-y-6"}>
          <div className={sidesClass}>
            <h3 className={titleClass}>Change password</h3>

            <Controller
              render={({ field }) => (
                <FormTopLabel label={"Old password"} wrapperClass={"mt-2"}>
                  <TextInput
                    {...field}
                    placeholder={"********"}
                    type={"password"}
                    name={field.name}
                    value={field.value || ""}
                    disabled={loading}
                    isPassword
                    errorMessage={errors.oldPassword?.message}
                    autoComplete={"new-password"}
                  />
                </FormTopLabel>
              )}
              name={"oldPassword"}
              control={control}
            />

            <Controller
              render={({ field }) => (
                <FormTopLabel label={"New password"}>
                  <TextInput
                    {...field}
                    placeholder={"********"}
                    type={"password"}
                    name={field.name}
                    value={field.value || ""}
                    disabled={loading}
                    isPassword
                    errorMessage={errors.newPassword?.message}
                    autoComplete={"new-password"}
                  />
                </FormTopLabel>
              )}
              name={"newPassword"}
              control={control}
            />

            <Controller
              render={({ field }) => (
                <FormTopLabel label={"Confirm new password"}>
                  <TextInput
                    {...field}
                    placeholder={"********"}
                    type={"password"}
                    name={field.name}
                    value={field.value || ""}
                    disabled={loading}
                    isPassword
                    errorMessage={errors.confirmPassword?.message}
                    autoComplete={"new-password"}
                  />
                </FormTopLabel>
              )}
              name={"confirmPassword"}
              control={control}
            />
          </div>

          <div className={sidesClass}>
            <div>
              <h3 className={titleClass}> Notifications settings</h3>
              <p className={"text-xs font-medium text-grey8 sm:text-sm"}>
                You will get an email notifications for the options you toggle
                on
              </p>
            </div>

            <Toggle
              label={"New features and updates"}
              checked={notificationSettings.feature}
              disabled={loading}
              onChange={(val) => handleSetNotificationSettings(val, "feature")}
            />

            <Toggle
              label={"Your subscription"}
              checked={notificationSettings.subscription}
              disabled={loading}
              onChange={(val) =>
                handleSetNotificationSettings(val, "subscription")
              }
            />

            <Toggle
              label={"Messages"}
              checked={notificationSettings.message}
              disabled={loading}
              onChange={(val) => handleSetNotificationSettings(val, "message")}
            />

            <Toggle
              label={"Feedback"}
              checked={notificationSettings.feedback}
              disabled={loading}
              onChange={(val) => handleSetNotificationSettings(val, "feedback")}
            />
          </div>
        </div>
      </div>

      <Button
        className={"ml-auto mt-[40px] block"}
        format={"primary"}
        type={"submit"}
        disabled={loading}
      >
        Save
      </Button>

      <Modal
        isShown={showModal}
        setIsShown={setShowModal}
        preventOverlayClose
        onOpenChange={(val) => {
          if (!val) {
            setUpdatePayload(undefined);
          }
        }}
      >
        <OtpModal
          setHasUpdated={setHasUpdatedPhone}
          updatePayload={updatePayload}
          setIsShown={setShowModal}
        />
      </Modal>
    </form>
  );
};
