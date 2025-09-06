"use client";
import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useContext,
  useState,
} from "react";
import { isOk } from "@/lib/serializable-result";
import type { getPrefectures } from "../get-prefectures";
import type { Prefecture } from "../schemas/prefecture";

/**
 *  Fetch が失敗した場合は null にし、空配列と区別する
 */
type PrefecturesContextType = Prefecture[] | null;

// パフォーマンスのために分割するのが適切らしい
// ref: https://zenn.dev/yuta_ura/articles/react-context-api#%E3%82%A2%E3%83%B3%E3%83%81%E3%83%91%E3%82%BF%E3%83%BC%E3%83%B3-1.-%E5%80%A4%E6%9C%AC%E4%BD%93%E3%81%A8%E5%80%A4%E3%82%92%E5%85%A5%E3%82%8C%E3%82%8B%E9%96%A2%E6%95%B0%E3%82%92-1-%E3%81%AE-context-%E3%81%AB%E5%85%A5%E3%82%8C%E3%81%A6%E3%81%84%E3%82%8B
const PrefecturesContext = createContext<PrefecturesContextType>([]);
const SetPrefecturesContext = createContext<
  Dispatch<SetStateAction<PrefecturesContextType>>
>(() => {
  throw new Error("SetPrefecturesContext.Provider is not found");
});

export function PrefecturesProvider({
  prefectures,
  children,
}: PropsWithChildren<{
  prefectures: Awaited<ReturnType<typeof getPrefectures>>;
}>) {
  const [pref, setPref] = useState<PrefecturesContextType>(
    isOk(prefectures) ? prefectures.value : null,
  );

  return (
    <PrefecturesContext.Provider value={pref}>
      <SetPrefecturesContext.Provider value={setPref}>
        {children}
      </SetPrefecturesContext.Provider>
    </PrefecturesContext.Provider>
  );
}

export function usePrefectures() {
  return useContext(PrefecturesContext);
}

export function useSetPrefectures() {
  return useContext(SetPrefecturesContext);
}
