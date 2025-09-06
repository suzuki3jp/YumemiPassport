"use client";
import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useContext,
  useState,
} from "react";

import type { Population } from "@/features/population/schemas/population";

/**
 *  Fetch が失敗した場合は null にし、空配列と区別する
 */
type PopulationsCacheContextType = Map<number, Population[] | null>;

// パフォーマンスのために分割するのが適切らしい
// ref: https://zenn.dev/yuta_ura/articles/react-context-api#%E3%82%A2%E3%83%B3%E3%83%81%E3%83%91%E3%82%BF%E3%83%BC%E3%83%B3-1.-%E5%80%A4%E6%9C%AC%E4%BD%93%E3%81%A8%E5%80%A4%E3%82%92%E5%85%A5%E3%82%8C%E3%82%8B%E9%96%A2%E6%95%B0%E3%82%92-1-%E3%81%AE-context-%E3%81%AB%E5%85%A5%E3%82%8C%E3%81%A6%E3%81%84%E3%82%8B
const PopulationsCacheContext = createContext<PopulationsCacheContextType>(
  new Map(),
);
const SetPopulationsCacheContext = createContext<
  Dispatch<SetStateAction<PopulationsCacheContextType>>
>(() => {
  throw new Error("SetPopulationsCacheContext.Provider is not found");
});

export function PopulationsCacheProvider({ children }: PropsWithChildren) {
  const [pop, setPop] = useState<PopulationsCacheContextType>(new Map());

  return (
    <PopulationsCacheContext.Provider value={pop}>
      <SetPopulationsCacheContext.Provider value={setPop}>
        {children}
      </SetPopulationsCacheContext.Provider>
    </PopulationsCacheContext.Provider>
  );
}

export function usePopulationsCache() {
  return useContext(PopulationsCacheContext);
}

export function useSetPopulationsCache() {
  return useContext(SetPopulationsCacheContext);
}
