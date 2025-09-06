"use client";
import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePopulationsCache } from "@/contexts/populations-cache";

/**
 * Fetch が失敗した場合は null にし、文字列と区別する
 */
type PopulationTypesContextType = { types: string[]; selected: string } | null;

// パフォーマンスのために分割するのが適切らしい
// ref: https://zenn.dev/yuta_ura/articles/react-context-api#%E3%82%A2%E3%83%B3%E3%83%81%E3%83%91%E3%82%BF%E3%83%BC%E3%83%B3-1.-%E5%80%A4%E6%9C%AC%E4%BD%93%E3%81%A8%E5%80%A4%E3%82%92%E5%85%A5%E3%82%8C%E3%82%8B%E9%96%A2%E6%95%B0%E3%82%92-1-%E3%81%AE-context-%E3%81%AB%E5%85%A5%E3%82%8C%E3%81%A6%E3%81%84%E3%82%8B
const PopulationTypesContext = createContext<PopulationTypesContextType>(null);
const SetPopulationTypesContext = createContext<
  Dispatch<SetStateAction<PopulationTypesContextType>>
>(() => {
  throw new Error("SetPopulationTypesContext.Provider is not found");
});

export function PopulationTypesProvider({ children }: PropsWithChildren) {
  const populationsCache = usePopulationsCache();
  const [popTypes, setPopTypes] = useState<PopulationTypesContextType>(null);

  useEffect(() => {
    if (populationsCache.size > 0) {
      // 重複を排除しつつ、キャッシュからラベルの配列を作成
      const types = Array.from(
        new Set(
          populationsCache
            .values()
            .flatMap((p) => p?.map((p) => p.label) ?? [])
            .toArray(),
        ),
      );

      // 以前選択されていたものがあればそれを、なければ先頭のものを selected にする
      setPopTypes((prev) => {
        if (!prev) return { types, selected: types[0] };
        const selected =
          prev.selected && types.includes(prev.selected)
            ? prev.selected
            : types[0];
        return { types, selected };
      });
    } else {
      setPopTypes(null);
    }
  }, [populationsCache]);

  return (
    <PopulationTypesContext.Provider value={popTypes}>
      <SetPopulationTypesContext.Provider value={setPopTypes}>
        {children}
      </SetPopulationTypesContext.Provider>
    </PopulationTypesContext.Provider>
  );
}

export function usePopulationTypes() {
  return useContext(PopulationTypesContext);
}

export function useSetPopulationTypes() {
  return useContext(SetPopulationTypesContext);
}
