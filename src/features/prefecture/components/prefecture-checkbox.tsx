"use client";
import { Checkbox } from "@/components/checkbox";
import {
  usePopulationsCache,
  useSetPopulationsCache,
} from "@/contexts/populations-cache";
import {
  useSelectedPrefectures,
  useSetSelectedPrefectures,
} from "@/contexts/selected-prefectures";
import { getPopulation } from "@/features/population/get-population";
import { isOk } from "@/lib/serializable-result";
import type { Prefecture } from "../schemas/prefecture";

interface PrefecturesCheckboxProps {
  prefecture: Prefecture;
}

export function PrefectureCheckbox({ prefecture }: PrefecturesCheckboxProps) {
  const selectedPrefectures = useSelectedPrefectures();
  const setSelectedPrefectures = useSetSelectedPrefectures();

  const populationsCache = usePopulationsCache();
  const setPopulationCache = useSetPopulationsCache();

  const selected = getSelected(selectedPrefectures, prefecture);
  async function onChange(selected: boolean) {
    setSelected({
      selected,
      selectedPrefectures,
      setSelectedPrefectures,
      prefecture,
    });

    fetchPopulationIfNotCached({
      populationsCache,
      setPopulationCache,
      prefecture,
    });
  }

  return (
    <Checkbox
      title={prefecture.name}
      defaultChecked={selected}
      onChange={onChange}
    />
  );
}

/**
 * テストのためにエクスポート
 */
export function getSelected(
  selectedPrefectures: ReturnType<typeof useSelectedPrefectures>,
  prefecture: Prefecture,
) {
  return selectedPrefectures.some((p) => p === prefecture.code);
}

/**
 * テストのためにエクスポート
 */
export function setSelected({
  selected,
  selectedPrefectures,
  setSelectedPrefectures,
  prefecture,
}: {
  selected: boolean;
  selectedPrefectures: ReturnType<typeof useSelectedPrefectures>;
  setSelectedPrefectures: ReturnType<typeof useSetSelectedPrefectures>;
  prefecture: Prefecture;
}) {
  const oldSelectedState = getSelected(selectedPrefectures, prefecture);
  if (oldSelectedState === selected) return;

  if (selected) {
    // 選択されている場合は追加
    setSelectedPrefectures([...selectedPrefectures, prefecture.code]);
  } else {
    // 選択されていない場合は削除
    setSelectedPrefectures(
      selectedPrefectures.filter((p) => p !== prefecture.code),
    );
  }
}

/**
 * テストのためにエクスポート
 */
export async function fetchPopulationIfNotCached({
  populationsCache,
  setPopulationCache,
  prefecture,
}: {
  populationsCache: ReturnType<typeof usePopulationsCache>;
  setPopulationCache: ReturnType<typeof useSetPopulationsCache>;
  prefecture: Prefecture;
}) {
  if (populationsCache.has(prefecture.code)) return; // キャッシュがあれば何もしない

  // キャッシュがなければ取得して保存
  const populationResult = await getPopulation(prefecture.code);
  setPopulationCache((old) => {
    const newMap = new Map(old); // コピーしないと参照は変更されないため、依存コンポーネントの再レンダリングが起きない
    newMap.set(
      prefecture.code,
      isOk(populationResult) ? populationResult.value : null,
    );
    return newMap;
  });
}
