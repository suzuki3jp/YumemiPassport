"use client";
import {
  usePopulationsCache,
  useSetPopulationsCache,
} from "@/contexts/populations-cache";
import { fetchPopulationIfNotCached } from "../helpers/fetch-population";

interface UseFetchPopulationHelpersReturn {
  fetchPopulationIfNotCached: (prefCode: number) => Promise<void>;
}

export function useFetchPopulationHelpers(): UseFetchPopulationHelpersReturn {
  const populationsCache = usePopulationsCache();
  const setPopulationCache = useSetPopulationsCache();

  return {
    fetchPopulationIfNotCached(prefCode) {
      return fetchPopulationIfNotCached({
        populationsCache,
        setPopulationCache,
        prefCode,
      });
    },
  };
}
