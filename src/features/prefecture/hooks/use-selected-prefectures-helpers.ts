"use client";
import {
  useSelectedPrefectures,
  useSetSelectedPrefectures,
} from "@/contexts/selected-prefectures";
import { getSelected, setSelected } from "../helpers/selected-prefectures";

type SelectedPrefecturesHelpers = {
  getSelected: (prefCode: number) => boolean;
  setSelected: (prefCode: number, selected: boolean) => void;
};

export function useSelectedPrefecturesHelpers(): SelectedPrefecturesHelpers {
  const selectedPrefectures = useSelectedPrefectures();
  const setSelectedPrefectures = useSetSelectedPrefectures();

  return {
    getSelected(prefCode) {
      return getSelected(selectedPrefectures, prefCode);
    },

    setSelected(prefCode, selected) {
      return setSelected({
        selected,
        selectedPrefectures,
        setSelectedPrefectures,
        prefCode,
      });
    },
  };
}
