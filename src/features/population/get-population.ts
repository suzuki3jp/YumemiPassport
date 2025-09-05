"use server";
import { err, type Result } from "neverthrow";

import { getApiKey } from "@/lib/get-api-key";
import {
  ApiEndpoints,
  handleFetchResponse,
  makeRequestHeader,
  makeUrl,
} from "@/lib/prefecture-api/client";
import type { PrefectureApiError } from "@/lib/prefecture-api/error";
import { PopulationSuccessResponse } from "@/lib/prefecture-api/response";
import { safeFetch } from "@/lib/safe-fetch";
import type { Population } from "./schemas/population";

/**
 * 人口データを取得する
 */
export async function getPopulation(
  prefCode: number,
): Promise<Result<Population[], PrefectureApiError>> {
  const apiKey = getApiKey();
  const responseResult = await safeFetch(
    makeUrl(ApiEndpoints.population, { prefCode }),
    makeRequestHeader(apiKey),
  );
  if (responseResult.isErr()) return err(responseResult.error);

  const handledResponseResult = await handleFetchResponse(
    responseResult.value,
    PopulationSuccessResponse,
  );

  return handledResponseResult.map((res) =>
    convertToPopulation(res.result.data),
  );
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
