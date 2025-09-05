"use client";
import { Checkbox } from "@/components/checkbox";
import {
  useSelectedPrefectures,
  useSetSelectedPrefectures,
} from "@/contexts/selected-prefectures";
import type { Prefecture } from "../schemas/prefecture";

interface PrefecturesCheckboxProps {
  prefecture: Prefecture;
}

export function PrefectureCheckbox({ prefecture }: PrefecturesCheckboxProps) {
  const selectedPrefectures = useSelectedPrefectures();
  const setSelectedPrefectures = useSetSelectedPrefectures();

  const selected = getSelected(selectedPrefectures, prefecture);
  function onChange(selected: boolean) {
    setSelected({
      selected,
      selectedPrefectures,
      setSelectedPrefectures,
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
