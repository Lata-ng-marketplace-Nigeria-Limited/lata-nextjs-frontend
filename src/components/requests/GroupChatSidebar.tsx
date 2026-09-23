"use client";

import React, { useState, useMemo } from "react";
import { Category } from "@/interface/products";
import { cn } from "@/utils";
import { Hash, Search, Users, Sparkles, MessageSquare, User } from "lucide-react";
import { useUser } from "@/hooks/useUser";

interface Props {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  totalRequestsCount: number;
  unreadCounts?: Record<string, number>;
}

export const GroupChatSidebar: React.FC<Props> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  totalRequestsCount,
  unreadCounts = {},
}) => {
  const { user } = useUser();
  const [filterQuery, setFilterQuery] = useState("");

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(filterQuery.toLowerCase())
    );
  }, [categories, filterQuery]);

  return (
    <div className="w-full md:w-80 bg-white border-r border-grey2 flex flex-col h-full min-h-0 max-h-full shrink-0 select-none">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-grey2 flex flex-col gap-3 bg-grey1/20 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-grey10 leading-none">
                Category Rooms
              </h2>
              <span className="text-[11px] text-grey6">
                Buyer & Seller Channels
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-purp2 text-primary font-bold text-[11px]">
            {totalRequestsCount} Posts
          </span>
        </div>

        {/* Search Categories */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search channels..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 bg-grey1 rounded-lg text-xs border border-grey2 focus:bg-white focus:border-primary outline-none transition-all"
          />
          <Search className="w-3.5 h-3.5 text-grey5 absolute left-2.5 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Group Channels List */}
      <div className="flex-1 overflow-y-auto min-h-0 p-2 space-y-1 scrollbar-thin">
        {/* "My Requests" Channel for logged-in users */}
        {user && (
          <button
            onClick={() => onSelectCategory("MY_REQUESTS")}
            className={cn(
              "w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-150 group mb-1 border",
              selectedCategoryId === "MY_REQUESTS"
                ? "bg-primary text-white font-semibold border-primary"
                : "bg-purp2/50 hover:bg-purp2 text-primary font-bold border-primary/20"
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                  selectedCategoryId === "MY_REQUESTS"
                    ? "bg-white/20 text-white"
                    : "bg-primary/10 text-primary group-hover:bg-primary/20"
                )}
              >
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <p
                  className={cn(
                    "text-xs truncate font-bold",
                    selectedCategoryId === "MY_REQUESTS" ? "text-white" : "text-primary"
                  )}
                >
                  # My Requests
                </p>
                <span
                  className={cn(
                    "text-[10px] block truncate font-normal",
                    selectedCategoryId === "MY_REQUESTS" ? "text-white/80" : "text-grey6"
                  )}
                >
                  Your posted requests
                </span>
              </div>
            </div>
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                selectedCategoryId === "MY_REQUESTS" ? "bg-emerald-300" : "bg-primary"
              )}
            />
          </button>
        )}

        {/* "All Categories / Global Feed" Channel */}
        <button
          onClick={() => onSelectCategory("")}
          className={cn(
            "w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-150 group",
            selectedCategoryId === ""
              ? "bg-primary text-white font-semibold"
              : "hover:bg-grey1 text-grey8 hover:text-grey10"
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                selectedCategoryId === ""
                  ? "bg-white/20 text-white"
                  : "bg-grey2/60 text-grey7 group-hover:bg-primary/10 group-hover:text-primary"
              )}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="truncate">
              <p
                className={cn(
                  "text-xs truncate",
                  selectedCategoryId === ""
                    ? "font-bold text-white"
                    : (unreadCounts["all"] || 0) > 0
                    ? "font-bold text-grey10"
                    : "font-medium"
                )}
              >
                # All Category Requests
              </p>
              <span
                className={cn(
                  "text-[10px] block truncate",
                  selectedCategoryId === "" ? "text-white/80" : "text-grey5"
                )}
              >
                Global buyer request stream
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-1">
            {selectedCategoryId !== "" && (unreadCounts["all"] || 0) > 0 ? (
              <span className="px-1.5 py-0.5 min-w-[18px] bg-emerald-500 text-white text-[10px] font-bold rounded-full text-center">
                {unreadCounts["all"]}
              </span>
            ) : (
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  selectedCategoryId === "" ? "bg-emerald-300" : "bg-emerald-500"
                )}
              />
            )}
          </div>
        </button>

        <div className="pt-2 pb-1 px-2 flex items-center justify-between text-[10px] font-bold text-grey5 uppercase tracking-wider">
          <span>Categories ({filteredCategories.length})</span>
          <Users className="w-3 h-3 text-grey5" />
        </div>

        {/* Individual Category Group Channels */}
        {filteredCategories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          const unreadCount = unreadCounts[cat.id] || 0;
          const hasUnread = !isSelected && unreadCount > 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                "w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-150 group",
                isSelected
                  ? "bg-primary text-white font-semibold"
                  : hasUnread
                  ? "bg-emerald-50/40 hover:bg-emerald-50/80 text-grey10 font-bold"
                  : "hover:bg-grey1 text-grey8 hover:text-grey10"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                    isSelected
                      ? "bg-white/20 text-white"
                      : hasUnread
                      ? "bg-emerald-500/10 text-emerald-600 font-bold"
                      : "bg-grey2/60 text-grey7 group-hover:bg-primary/10 group-hover:text-primary"
                  )}
                >
                  <Hash className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <p
                    className={cn(
                      "text-xs truncate",
                      isSelected
                        ? "font-bold text-white"
                        : hasUnread
                        ? "font-bold text-grey10"
                        : "font-medium"
                    )}
                  >
                    {cat.name}
                  </p>
                  <span
                    className={cn(
                      "text-[10px] block truncate",
                      isSelected
                        ? "text-white/80"
                        : hasUnread
                        ? "text-emerald-700 font-semibold"
                        : "text-grey5"
                    )}
                  >
                    {hasUnread ? `${unreadCount} new request${unreadCount > 1 ? "s" : ""}` : "Group Room"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-1">
                {hasUnread ? (
                  <span className="px-1.5 py-0.5 min-w-[20px] bg-emerald-500 text-white text-[10px] font-bold rounded-full text-center">
                    {unreadCount}
                  </span>
                ) : (
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      isSelected ? "bg-emerald-300" : "bg-emerald-500"
                    )}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
