"use client";

import React, { useState, useEffect } from "react";
import { Category } from "@/interface/products";
import { ProductRequest, getProductRequestsApi } from "@/api/productRequest";
import { RequestCard } from "./RequestCard";
import { GroupChatSidebar } from "./GroupChatSidebar";
import { CreateRequestModal } from "./CreateRequestModal";
import Button from "@atom/Button";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  PlusCircle,
  ShoppingBag,
  Loader2,
  Users,
  Hash,
  Menu,
  Sparkles,
} from "lucide-react";
import { cn } from "@/utils";

interface Props {
  categories: Category[];
  initialRequests?: ProductRequest[];
}

export const ProductRequestsFeed: React.FC<Props> = ({
  categories,
  initialRequests = [],
}) => {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const urlCategoryId =
    searchParams?.get("category") || searchParams?.get("categoryId") || "";

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(urlCategoryId);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [requests, setRequests] = useState<ProductRequest[]>(initialRequests);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState<boolean>(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  // Sync state if URL search param changes
  useEffect(() => {
    if (urlCategoryId && urlCategoryId !== selectedCategoryId) {
      setSelectedCategoryId(urlCategoryId);
    }
  }, [urlCategoryId]);

  // Debounce search query input by 350ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchRequests = async (catId?: string, search?: string, status?: string) => {
    try {
      setLoading(true);
      const isMineView = catId === "MY_REQUESTS";
      const res = await getProductRequestsApi({
        mine: isMineView ? "true" : undefined,
        categoryId: !isMineView && catId ? catId : undefined,
        search: search || undefined,
        status: isMineView && status && status !== "ALL" ? status : undefined,
      });
      if (res && res.data) {
        setRequests(res.data);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(selectedCategoryId, debouncedSearchQuery, statusFilter);

    if (selectedCategoryId) {
      setUnreadCounts((prev) => ({
        ...prev,
        [selectedCategoryId]: 0,
      }));
    } else {
      setUnreadCounts((prev) => ({
        ...prev,
        all: 0,
      }));
    }
  }, [selectedCategoryId, debouncedSearchQuery, statusFilter]);

  const handleSelectCategory = (catId: string) => {
    setSelectedCategoryId(catId);
    setShowMobileSidebar(false);

    setUnreadCounts((prev) => ({
      ...prev,
      [catId || "all"]: 0,
    }));

    // Update URL query parameter without page reload
    const params = new URLSearchParams(window.location.search);
    if (catId) {
      params.set("category", catId);
    } else {
      params.delete("category");
      params.delete("categoryId");
    }
    router.replace(`/requests${params.toString() ? `?${params.toString()}` : ""}`, {
      scroll: false,
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRequests(selectedCategoryId, searchQuery, statusFilter);
  };

  const handleOpenModal = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to post a product request.",
        variant: "info",
      });
      router.push("/auth/login");
      return;
    }
    setIsModalOpen(true);
  };

  const currentCategoryName =
    selectedCategoryId === "MY_REQUESTS"
      ? "My Requests"
      : categories.find((c) => c.id === selectedCategoryId)?.name ||
        "All Category Requests";

  return (
    <div className="w-full max-w-[1450px] mx-auto p-2 sm:p-4">
      {/* Main Group Chat Layout Container */}
      <div className="bg-white border border-grey2 rounded-2xl shadow-lg flex flex-col md:flex-row min-h-[calc(100vh-140px)] max-h-[calc(100vh-120px)] overflow-hidden relative">
        {/* Mobile Sidebar Overlay Drawer */}
        {showMobileSidebar && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setShowMobileSidebar(false)}
          />
        )}

        {/* Left Sidebar - Category Group Channels */}
        <div
          className={cn(
            "fixed md:relative inset-y-0 left-0 z-50 md:z-auto transition-transform duration-200 ease-in-out md:translate-x-0 w-80 max-w-[85vw]",
            showMobileSidebar ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <GroupChatSidebar
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={handleSelectCategory}
            totalRequestsCount={requests.length}
            unreadCounts={unreadCounts}
          />
        </div>

        {/* Right Panel - Active Group Room Chat Feed */}
        <div className="flex-1 flex flex-col h-full min-h-0 max-h-full bg-grey1/20 min-w-0">
          {/* Active Room Top Bar */}
          <div className="bg-white border-b border-grey2 p-3 sm:p-4 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="md:hidden p-1.5 rounded-lg bg-grey1 text-grey7 hover:bg-grey2 shrink-0"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                {selectedCategoryId ? (
                  <Hash className="w-5 h-5" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
              </div>

              <div className="truncate">
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-bold text-grey10 truncate">
                    #{currentCategoryName}
                  </h1>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-grey6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>
                    Category Room • <strong className="font-semibold text-grey9">{requests.length}</strong> request{requests.length === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
            </div>

            {/* Room Actions: Search & Post Request Modal Button */}
            <div className="flex items-center gap-2 shrink-0">
              <form
                onSubmit={handleSearchSubmit}
                className="hidden sm:relative sm:block min-w-[160px] lg:min-w-[220px]"
              >
                <input
                  type="text"
                  placeholder="Search in room..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 rounded-full text-xs border border-grey3 bg-grey1/50 text-grey9 outline-none focus:bg-white focus:border-primary transition-all"
                />
                <Search className="w-3.5 h-3.5 text-grey5 absolute left-2.5 top-2.5 pointer-events-none" />
              </form>

              <Button
                format="primary"
                onClick={handleOpenModal}
                className="py-1.5 px-3 sm:px-4 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Post Request</span>
              </Button>
            </div>
          </div>

          {/* Status Filter Tabs for My Requests View */}
          {selectedCategoryId === "MY_REQUESTS" && (
            <div className="bg-white border-b border-grey2 px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
              {[
                { id: "ALL", label: "All Requests" },
                { id: "OPEN", label: "Active" },
                { id: "INACTIVE", label: "Expired (>7 days)" },
                { id: "CLOSED", label: "Closed" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0",
                    statusFilter === tab.id
                      ? "bg-primary text-white shadow-2xs"
                      : "bg-grey1/70 text-grey7 hover:bg-grey2 hover:text-grey10"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Group Room Chat Stream */}
          <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-grey2/40 custom-scrollbar pb-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-grey6 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-xs font-medium">
                  Loading group room requests...
                </p>
              </div>
            ) : requests.length === 0 ? (
              <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-3 my-auto">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                {selectedCategoryId === "MY_REQUESTS" ? (
                  <div className="max-w-[420px]">
                    <h3 className="text-base sm:text-lg font-bold text-grey10">
                      You Haven't Posted Any Requests Yet
                    </h3>
                    <p className="text-xs sm:text-sm text-grey6 mt-1.5 leading-relaxed">
                      Do you have a specific product in mind? Post a request now and verified sellers on Lata.ng will reach out directly to you with great offers!
                    </p>
                  </div>
                ) : (
                  <div className="max-w-[380px]">
                    <h3 className="text-base font-bold text-grey9">
                      No Requests in #{currentCategoryName}
                    </h3>
                    <p className="text-xs text-grey6 mt-1">
                      Be the first buyer to post a request in this group room!
                    </p>
                  </div>
                )}
                <Button
                  format="primary"
                  onClick={handleOpenModal}
                  className="mt-2 py-2.5 px-5 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{selectedCategoryId === "MY_REQUESTS" ? "Post a Request" : "Post First Request"}</span>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col">
                {requests.map((req) => (
                  <RequestCard
                    key={req.id}
                    productRequest={req}
                    onClosed={() => fetchRequests(selectedCategoryId, searchQuery)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Modal for Detailed Request Creation */}
      <CreateRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchRequests(selectedCategoryId, searchQuery)}
        categories={categories}
      />
    </div>
  );
};
