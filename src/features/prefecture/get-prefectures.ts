"use server";
import type { Result } from "neverthrow";
import { getApiKey } from "@/lib/get-api-key";
import { fetchFromPrefectureApi } from "@/lib/prefecture-api/client";
import type { PrefectureApiError } from "@/lib/prefecture-api/error";
import type { Prefecture } from "./schemas/prefecture";

/**
 * 都道府県の一覧を取得する
 */
export async function getPrefectures(): Promise<
  Result<Prefecture[], PrefectureApiError>
> {
  const apiKey = getApiKey();
  const fetchResult = await fetchFromPrefectureApi({
    path: "/prefectures",
    apiKey,
  });
  const mappedFetchResult = fetchResult.map<Prefecture[]>((res) =>
    res.result.map((prefecture) => ({
      code: prefecture.prefCode,
      name: prefecture.prefName,
    })),
  );
  return mappedFetchResult;
}
