export const validateChangePassword = (values: {
  oldPassword: string | undefined;
  newPassword: string | undefined;
  confirmPassword: string | undefined;
}) => {
  const error = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  if (!values.oldPassword) {
    error.oldPassword =
      "Old password is required if new password or confirm password is set";
  }

  if (!values.newPassword) {
    error.newPassword =
      "New password is required if old password or confirm password is set";
  }

  if (!values.confirmPassword) {
    error.confirmPassword =
      "Confirm password is required if old password or new password is set";
  }

  if (values.newPassword !== values.confirmPassword) {
    error.confirmPassword = "Passwords do not match";
  }

  return error;
};

export const validateSellerSettings = (values: {
  phoneNumber: string | undefined;
  address: string | undefined;
  aboutBusiness: string | undefined;
}) => {
  const error = {
    phoneNumber: "",
    address: "",
    aboutBusiness: "",
  };
  if (!values.phoneNumber) {
    error.phoneNumber = "Please enter a valid phone number";
  }
  if (!values.address) {
    error.address = "Business address is required";
  }
  if (!values.aboutBusiness) {
    error.aboutBusiness = "Business description is required";
  }
  return error;
};
