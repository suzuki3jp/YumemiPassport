"use client";
import { usePopulationsCache } from "@/contexts/populations-cache";
import { useSelectedPrefectures } from "@/contexts/selected-prefectures";
import { usePopulationTypes } from "../contexts/population-types";
import { PopulationChart } from "./population-chart";

export function PopulationChartContainer() {
  const populationsCache = usePopulationsCache();
  const selectedPrefectures = useSelectedPrefectures();
  const populationTypes = usePopulationTypes();

  if (!populationTypes) return null; // TODO: エラーをスローして error boundary でキャッチするようにする

  const series: Parameters<typeof PopulationChart>[0]["series"] =
    selectedPrefectures
      .map((prefCode) => {
        const population = populationsCache.get(prefCode)!;
        const targetPopulation = population?.find(
          (p) => p.label === populationTypes.selected,
        );
        if (!targetPopulation) return null; // TODO: エラーをスローして error boundary でキャッチするようにする
        return {
          type: "line",
          name: prefCode.toString(),
          data: targetPopulation.data.map((d) => ({
            x: d.year,
            y: d.population,
          })),
        };
      })
      .filter((s) => s !== null);
  return <PopulationChart series={series} />;
}
