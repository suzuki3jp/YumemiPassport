"use server";
import { getApiKey } from "@/lib/get-api-key";
import {
  ApiEndpoints,
  handleFetchResponse,
  makeRequestHeader,
  makeUrl,
} from "@/lib/prefecture-api/client";
import { PrefectureApiErrorCode } from "@/lib/prefecture-api/error";
import { PopulationSuccessResponse } from "@/lib/prefecture-api/response";
import { safeFetch } from "@/lib/safe-fetch";
import { err, ok, type SerializableResult } from "@/lib/serializable-result";
import type { Population } from "./schemas/population";

/**
 * 人口データを取得する
 */
export async function getPopulation(
  prefCode: number,
): Promise<SerializableResult<Population[], PrefectureApiErrorCode>> {
  const apiKey = getApiKey();
  const responseResult = await safeFetch(
    makeUrl(ApiEndpoints.population, { prefCode }),
    makeRequestHeader(apiKey),
  );
  if (responseResult.isErr()) return err(PrefectureApiErrorCode.FETCH_ERROR);

  const handledResponseResult = (
    await handleFetchResponse(responseResult.value, PopulationSuccessResponse)
  ).map((res) => convertToPopulation(res.result.data));

  if (handledResponseResult.isErr()) return err(handledResponseResult.error);

  return ok(handledResponseResult.value);
}

function convertToPopulation(
  res: PopulationSuccessResponse["result"]["data"],
): Population[] {
  return res.map((pop) => ({
    label: pop.label,
    data: pop.data.map((d) => ({
      year: d.year,
      population: d.value,
      rate: d.rate,
    })),
  }));
}
