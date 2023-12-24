import localForage from "localforage";
import { User, UserRole } from "@/interface/user";
import { Chat } from "@/interface/chat";
import { Category } from "@/interface/products";
import { Subscription } from "@/interface/payment";
import { create } from "zustand";
import { persist, createJSONStorage as createStore } from "zustand/middleware";

export interface ILocalStore {
  user?: User;
  chats: Chat[];
  categories?: Category[];
  subscription: Subscription[];
  loading: boolean;
  setUser: (user: User) => void;
  updateUser: (user: Partial<User>) => void;
  setChats: (chats: Chat[]) => void;
  setCategories: (categories: Category[]) => void;
  setSubscription: (subscription: Subscription[]) => void;
  setLoading: (loading: boolean) => void;
  clear: () => void;
}

export const useGeneralStore = create<{
  hasSetCategories: boolean;
  setHasSetCategories: (val: boolean) => void;
}>((set) => ({
  hasSetCategories: false,
  setHasSetCategories: (val) => set({ hasSetCategories: val }),
}));

export const useLocalStore = create(
  persist<ILocalStore>(
    (set, get) => ({
      user: undefined,
      chats: [],
      categories: [],
      subscription: [],
      loading: true,
      setUser: (user: User) => set({ user }),
      updateUser: (user: Partial<User>) =>
        set({ user: { ...get().user, ...(user as any) } }),
      setChats: (chats: Chat[]) => set({ chats }),
      setCategories: (categories: Category[]) => set({ categories }),
      setSubscription: (subscription: Subscription[]) => set({ subscription }),
      setLoading: (loading: boolean) => set({ loading }),
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
