"use client";

import { getAllStatesApi } from "@/api/location";
import { SearchOption } from "@/interface/input";
import { useLocalStore } from "@/store/states/localStore";
import { useCallback, useEffect, useState } from "react";

export const useNigerianStates = () => {
  const { nigerianStates, setNigerianStates } = useLocalStore();

  const [statesSelectData, setStatesSelectData] = useState<SearchOption[]>([]);

  const handleNigerianStates = useCallback(async () => {
    const allStates = await getAllStatesApi();
    if (!allStates?.data || !allStates?.data?.length) return;

    setNigerianStates(allStates?.data);

    const statesOptions = allStates?.data.map((loc) => ({
      label: loc.name,
      value: loc.id,
    }));
    setStatesSelectData(statesOptions);
  }, []);

  useEffect(() => {
    handleNigerianStates();
  }, []);

  return {
    nigerianStates: nigerianStates || [],
    statesSelectData,
  };
};
