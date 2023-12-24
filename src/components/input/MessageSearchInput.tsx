import { Chat } from "@/interface/chat";
import React, { SetStateAction, useEffect, useState } from "react";
import { useUser } from "@hooks/useUser";
import { cn, searchString } from "@/utils";
import { SearchIcon } from "@atom/icons/Search";

interface Props {
  wrapperClass?: string;
  inputClass?: string;
  searchIconClass?: string;
  setFilteredChats: React.Dispatch<SetStateAction<Chat[]>>;
  chats: Chat[];
}

export default function MessageSearchInput(props: Props) {
  const [search, setSearch] = useState("");
  const { user } = useUser();

  useEffect(() => {
    if (!search) {
      props.setFilteredChats(props.chats);
      return;
    }
    const filteredChats = props.chats.filter((chat) => {
      const { seller, buyer, product } = chat;
      const isOwner = chat.product?.userId === user?.id;
      const name = isOwner ? buyer?.name : seller?.name;
      const isNameMatch = searchString(search, name);
      const isProductMatch = searchString(search, product?.name);
      return isNameMatch || isProductMatch;
    });
    props.setFilteredChats(filteredChats);
  });

  return (
    <div className={cn("relative w-full", props.wrapperClass)}>
      <input
        {...props}
        placeholder={"Search messages"}
        className={cn(
          `
           bg-offwhite
           h-[35px]
           sm:h-[50px]
           rounded-[10px]
           relative
           w-full
           px-2.5
           sm:px-4
           outline-none
           
           `,
          props.inputClass,
        )}
        value={search}
        onInput={(e) => {
          props.setFilteredChats([]);
          setSearch(e.currentTarget.value);
        }}
      />
      <SearchIcon
        className={cn(
          `
            w-3 
            h-3 
            absolute 
            sm:w-4 
            sm:h-4 
            top-1/2 
            transform 
            -translate-y-1/2 
            right-2.5 
            sm:right-4
          `,
          props.searchIconClass,
        )}
        pathClass={cn("stroke-grey6")}
      />
    </div>
  );
}
