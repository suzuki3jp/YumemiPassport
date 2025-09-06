import type {
  usePopulationsCache,
  useSetPopulationsCache,
} from "@/contexts/populations-cache";
import { getPopulation } from "@/features/population/get-population";
import { isOk } from "@/lib/serializable-result";

/**
 * 人口データをキャッシュしていなければ取得してキャッシュする
 * @param param0
 * @returns
 */
export async function fetchPopulationIfNotCached({
  populationsCache,
  setPopulationCache,
  prefCode,
}: {
  populationsCache: ReturnType<typeof usePopulationsCache>;
  setPopulationCache: ReturnType<typeof useSetPopulationsCache>;
  prefCode: number;
}) {
  if (populationsCache.has(prefCode)) return; // キャッシュがあれば何もしない

  // キャッシュがなければ取得して保存
  const populationResult = await getPopulation(prefCode);
  setPopulationCache((old) => {
    const newMap = new Map(old); // コピーしないと参照は変更されないため、依存コンポーネントの再レンダリングが起きない
    newMap.set(
      prefCode,
      isOk(populationResult) ? populationResult.value : null,
    );
    return newMap;
  });
}
