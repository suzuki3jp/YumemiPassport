import type {
  useSelectedPrefectures,
  useSetSelectedPrefectures,
} from "@/contexts/selected-prefectures";

/**
 * 選択されているかどうか
 */
export function getSelected(
  selectedPrefectures: ReturnType<typeof useSelectedPrefectures>,
  prefCode: number,
) {
  return selectedPrefectures.some((p) => p === prefCode);
}

/**
 * 選択・未選択を切り替える
 */
export function setSelected({
  selected,
  selectedPrefectures,
  setSelectedPrefectures,
  prefCode,
}: {
  selected: boolean;
  selectedPrefectures: ReturnType<typeof useSelectedPrefectures>;
  setSelectedPrefectures: ReturnType<typeof useSetSelectedPrefectures>;
  prefCode: number;
}) {
  const oldSelectedState = getSelected(selectedPrefectures, prefCode);
  if (oldSelectedState === selected) return;

  if (selected) {
    // 選択されている場合は追加
    setSelectedPrefectures([...selectedPrefectures, prefCode]);
  } else {
    // 選択されていない場合は削除
    setSelectedPrefectures(selectedPrefectures.filter((p) => p !== prefCode));
  }
}
