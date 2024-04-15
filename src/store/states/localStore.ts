import localForage from "localforage";
import { User, UserRole } from "@/interface/user";
import { Chat } from "@/interface/chat";
import { Category } from "@/interface/products";
import { Subscription } from "@/interface/payment";
import { create } from "zustand";
import { persist, createJSONStorage as createStore } from "zustand/middleware";
import { State } from "@/interface/location";

export interface ILocalStore {
  user?: User;
  chats: Chat[];
  categories?: Category[];
  subscription: Subscription[];
  loading: boolean;
  location: State[];
  setUser: (user: User) => void;
  updateUser: (user: Partial<User>) => void;
  setChats: (chats: Chat[]) => void;
  setCategories: (categories: Category[]) => void;
  setSubscription: (subscription: Subscription[]) => void;
  setLoading: (loading: boolean) => void;
  setLocations: (location: State[]) => void;
  clear: () => void;
}

export const useGeneralStore = create<{
  hasSetCategories: boolean;
  setHasSetCategories: (val: boolean) => void;
}>((set) => ({
  hasSetCategories: false,
  setHasSetCategories: (val) => set({ hasSetCategories: val }),
}));

export const useLocationStore = create<{
  hasSetLocation: boolean;
  setHasSetLocation: (val: boolean) => void;
}>((set) => ({
  hasSetLocation: false,
  setHasSetLocation: (val) => set({ hasSetLocation: val }),
}));

export const useLocalStore = create(
  persist<ILocalStore>(
    (set, get) => ({
      user: undefined,
      chats: [],
      categories: [],
      subscription: [],
      loading: true,
      location: [],
      setUser: (user: User) => set({ user }),
      updateUser: (user: Partial<User>) =>
        set({ user: { ...get().user, ...(user as any) } }),
      setChats: (chats: Chat[]) => set({ chats }),
      setCategories: (categories: Category[]) => set({ categories }),
      setSubscription: (subscription: Subscription[]) => set({ subscription }),
      setLoading: (loading: boolean) => set({ loading }),
      setLocations: (location: State[]) => set({ location }),
      clear: () =>
        set({
          user: undefined,
          chats: [],
          loading: true,
        }),
    }),

    {
      name: "lata.ng-async-store",
      storage: createStore(() => localForage as any),
    },
  ),
);

interface IFastLocalStore {
  selectedRole?: UserRole;
  lastCategoryFetch?: string;
  lastSubscriptionFetch?: string;
  setSelectedRole: (selectedRole?: UserRole) => void;
  setLastCategoryFetch: (lastCategoryFetch: string) => void;
  setLastSubscriptionFetch: (lastSubscriptionFetch: string) => void;
}

export const useFastLocalStore = create(
  persist<IFastLocalStore>(
    (set, get) => ({
      selectedRole: undefined,
      lastCategoryFetch: undefined,
      lastSubscriptionFetch: undefined,
      setSelectedRole: (selectedRole?: UserRole) => set({ selectedRole }),
      setLastCategoryFetch: (lastCategoryFetch: string) =>
        set({ lastCategoryFetch }),
      setLastSubscriptionFetch: (lastSubscriptionFetch: string) =>
        set({ lastSubscriptionFetch }),
    }),
    {
      name: "lata.ng-fast-store",
      storage: createStore(() => localStorage),
    },
  ),
);

interface IIsUserBlocked {
  userIsBlocked: "true" | "false";
  setUserIsBlocked: (userIsBlocked: "true" | "false") => void;
}

export const useIsUserBlocked = create(
  persist<IIsUserBlocked>(
    (set) => ({
      userIsBlocked: "false",
      setUserIsBlocked: (userIsBlocked: "true" | "false") =>
        set({ userIsBlocked }),
    }),
    {
      name: "lata.ng-blocked-users",
      storage: createStore(() => localStorage),
    },
  ),
);

interface IRoleSwitchState {
  isSwitchingRole: "true" | "";
  sessionUser: User | null; // Represents the user whose session is being used
  searchQuery: string; // Captures the userId and role of the user being switched to
  previousUrl: string;
  setIsSwitchingRole: (isSwitchingRole: "true" | "") => void;
  setSessionUser: (sessionUser: User | null) => void;
  setSearchQuery: (searchQuery: string) => void;
  setPreviousUrl: (previousUrl: string) => void;
}

export const useRoleSwitchStore = create(
  persist<IRoleSwitchState>(
    (set) => ({
      isSwitchingRole: "",
      sessionUser: null,
      searchQuery: "",
      previousUrl: "",
      setIsSwitchingRole: (isSwitchingRole: "true" | "") =>
        set({ isSwitchingRole }),
      setSessionUser: (sessionUser: User | null) =>
        set({ sessionUser }),
      setSearchQuery: (searchQuery: string) => set({ searchQuery }),
      setPreviousUrl: (previousUrl: string) => set({ previousUrl }),
    }),
    {
      name: "app.role-switch-state",
      storage: createStore(() => localStorage),
    },
  ),
);
