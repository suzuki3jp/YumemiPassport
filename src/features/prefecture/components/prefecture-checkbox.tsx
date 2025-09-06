"use client";
import { Checkbox } from "@/components/checkbox";
import { useFetchPopulationHelpers } from "../hooks/use-fetch-population-helpers";
import { useSelectedPrefecturesHelpers } from "../hooks/use-selected-prefectures-helpers";
import type { Prefecture } from "../schemas/prefecture";

interface PrefecturesCheckboxProps {
  prefecture: Prefecture;
}

export function PrefectureCheckbox({ prefecture }: PrefecturesCheckboxProps) {
  const { getSelected, setSelected } = useSelectedPrefecturesHelpers();
  const { fetchPopulationIfNotCached } = useFetchPopulationHelpers();

  const selected = getSelected(prefecture.code);

  async function onChange(selected: boolean) {
    setSelected(prefecture.code, selected);

    fetchPopulationIfNotCached(prefecture.code);
  }

  return (
    <Checkbox
      title={prefecture.name}
      defaultChecked={selected}
      onChange={onChange}
    />
  );
}
