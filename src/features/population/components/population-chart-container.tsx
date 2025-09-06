"use client";
import { ErrorCard } from "@/components/error-card";
import { usePopulationsCache } from "@/contexts/populations-cache";
import { useSelectedPrefectures } from "@/contexts/selected-prefectures";
import { usePopulationTypes } from "../contexts/population-types";
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

interface ConvertPopulationToSeriesOptions {
  populationsCache: ReturnType<typeof usePopulationsCache>;
  selectedPrefectures: ReturnType<typeof useSelectedPrefectures>;
  populationTypes: ReturnType<typeof usePopulationTypes>;
}

type ConvertPopulationToSeriesReturnType =
  | Parameters<typeof PopulationChart>[0]["series"]
  | null;

/**
 * 選択されている都道府県と人口区分に基づいて、グラフ描画用のデータシリーズを生成する
 * NOTE: テストのためにのみエクスポートしている
 */
export function convertPopulationToSeries({
  populationsCache,
  selectedPrefectures,
  populationTypes,
}: ConvertPopulationToSeriesOptions): ConvertPopulationToSeriesReturnType {
  try {
    return selectedPrefectures
      .map((prefCode) => {
        const populations = populationsCache.get(prefCode);

        // select されているけどキャッシュが undefined → まだ fetch が成功していない状態
        // null → フィルターして無視
        // fetch が完了したら 再レンダリングされるので OK
        if (populations === undefined) return null;
        if (populationTypes === null) return null;

        const targetPopulation = populations?.find(
          (p) => p.label === populationTypes?.selected,
        );

        // 対象の人口データが存在しない場合として考えられるシナリオは以下があり、いずれも重大なバグか再現不能な状態であると考えられるため、再読み込みを勧める
        // - 人口データのキャッシュが null (すべてのリトライを含んだ fetch が失敗している)
        // - 選択されている都道府県に対して人口データのキャッシュが存在しない (fetch が失敗しているのに null が設定されていない → コードの重大なバグの可能性)
        // - 選択されている人口区分が存在しない（これが起きた場合は重大なコードのバグが考えられる）
        if (!targetPopulation) throw new Error();

        return {
          type: "line",
          name: prefCode.toString(),
          data: targetPopulation.data.map((d) => ({
            x: d.year,
            y: d.population,
          })),
        };
      })
      .filter((d) => d !== null);
  } catch {
    return null;
  }
}
