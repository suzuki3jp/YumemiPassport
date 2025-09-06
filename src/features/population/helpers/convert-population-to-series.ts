import type { usePrefectures } from "@//contexts/prefectures";
import type { usePopulationsCache } from "@/contexts/populations-cache";
import type { useSelectedPrefectures } from "@/contexts/selected-prefectures";
import type { PopulationChart } from "../components/population-chart";
import type { usePopulationTypes } from "../contexts/population-types";

interface ConvertPopulationToSeriesOptions {
  populationsCache: ReturnType<typeof usePopulationsCache>;
  selectedPrefectures: ReturnType<typeof useSelectedPrefectures>;
  populationTypes: ReturnType<typeof usePopulationTypes>;
  prefectures: ReturnType<typeof usePrefectures>;
}

type ConvertPopulationToSeriesReturnType =
  | Parameters<typeof PopulationChart>[0]["series"]
  | null;

/**
 * 選択されている都道府県と人口区分に基づいて、グラフ描画用のデータシリーズを生成する
 */
export function convertPopulationToSeries({
  populationsCache,
  selectedPrefectures,
  populationTypes,
  prefectures,
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

        // チェックボックスがチェックにされたときにこの関数が呼ばれているので、必ず都道府県が存在する
        const prefecture = prefectures?.find((p) => p.code === prefCode);
        if (!prefecture) throw new Error();

        return {
          type: "line",
          name: prefecture.name,
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
