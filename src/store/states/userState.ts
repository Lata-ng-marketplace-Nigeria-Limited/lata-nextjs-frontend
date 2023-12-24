import { User } from "@/interface/user";
import { z } from "zod";
import { sellerSignUpSchema } from "../schemas/sellerSignUpSchema";
import { create } from "zustand";

interface UserState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  isSocketConnected: boolean;
  hasInitializedSocketConnection: boolean;
  loading: boolean;
  hasUnReadNotification?: boolean;
  setIsSocketConnected: (value: boolean) => void;
  setHasUnReadNotification: (value: boolean) => void;
  setHasInitializedSocketConnection: (value: boolean) => void;
  setUserData: (user: User) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  isLoggedIn: false,
  user: null,
  token: null,
  isSocketConnected: false,
  hasInitializedSocketConnection: false,
  loading: true,
  hasUnReadNotification: false,
  setIsSocketConnected: (value) => set({ isSocketConnected: value }),
  setHasUnReadNotification: (value) => set({ hasUnReadNotification: value }),
  setHasInitializedSocketConnection: (value) =>
    set({ hasInitializedSocketConnection: value }),
  setUserData: (user) => set({ user }),
}));

export const registrationFormDataDefaultState = {
  name: "",
  password: "",
  email: "",
  address: "",
  aboutBusiness: "",
  phoneNumber: "",
  avatar: "",
  shouldCompleteForm: false,
  isUpgradingToSeller: false,
};

interface RegistrationFormState extends z.infer<typeof sellerSignUpSchema> {
  avatar: string;
  shouldCompleteForm: boolean;
  isUpgradingToSeller: boolean;
  setRegistrationForm: (data: Partial<SetData>) => void;
  clearRegistrationForm: () => void;
}

interface SetData
  extends Omit<
    RegistrationFormState,
    "setRegistrationForm" | "clearRegistrationForm"
  > {}

export const useRegistrationFormStore = create<RegistrationFormState>(
  (set) => ({
    ...registrationFormDataDefaultState,
    setRegistrationForm: (data) => set({ ...data }),
    clearRegistrationForm: () => set({ ...registrationFormDataDefaultState }),
  }),
);
