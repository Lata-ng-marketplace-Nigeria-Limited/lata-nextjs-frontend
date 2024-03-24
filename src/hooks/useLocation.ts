"use client";

import { getAllStatesApi } from "@/api/location";
import { SearchOption } from "@/interface/input";
import { useLocalStore, useLocationStore } from "@/store/states/localStore";
import { useEffect, useState } from "react";

export const useLocation = () => {
  const { location, setLocations } = useLocalStore();
  const { hasSetLocation, setHasSetLocation } = useLocationStore();

  const [statesSelectData, setStatesSelectData] = useState<SearchOption[]>([]);

  useEffect(() => {
    if (hasSetLocation) return;
    (async () => {
      const allStates = await getAllStatesApi();
      if (!allStates?.data || !allStates?.data?.length) return;

      setLocations(allStates?.data);
      setHasSetLocation(true);
    })();
  }, [location, hasSetLocation]);

  useEffect(() => {
    if (!location.length) return;
    const statesOptions = location.map((loc) => ({
      label: loc.name,
      value: loc.id,
    }));
    setStatesSelectData(statesOptions);
  }, [location]);

  return {
    location: location || [],
    statesSelectData,
  };
};
