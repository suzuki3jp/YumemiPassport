"use client";
import { ErrorCard } from "@/components/error-card";
import { usePopulationsCache } from "@/contexts/populations-cache";
import { useSelectedPrefectures } from "@/contexts/selected-prefectures";
import { usePopulationTypes } from "../contexts/population-types";
import { convertPopulationToSeries } from "../helpers/convert-population-to-series";
import { PopulationChart } from "./population-chart";

export function PopulationChartContainer() {
  const populationsCache = usePopulationsCache();
  const selectedPrefectures = useSelectedPrefectures();
  const populationTypes = usePopulationTypes();

  if (selectedPrefectures.length === 0) {
    return (
      <div className="h-96 w-full rounded border border-gray-200 bg-gray-50 p-4">
        <div className="flex h-full items-center justify-center text-gray-500">
          都道府県を選択してください
        </div>
      </div>
    );
  }

  const convertedSeries = convertPopulationToSeries({
    populationsCache,
    selectedPrefectures,
    populationTypes,
  });

  if (convertedSeries === null) {
    return (
      <ErrorCard
        title="エラーが発生しました。"
        description="人口データの取得に失敗しました。"
      />
    );
  }

  return <PopulationChart series={convertedSeries} />;
}
