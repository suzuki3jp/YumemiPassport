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
import { PrefecturesSuccessResponse } from "@/lib/prefecture-api/response";
import { safeFetch } from "@/lib/safe-fetch";
import type { Prefecture } from "./schemas/prefecture";

/**
 * 都道府県の一覧を取得する
 */
export async function getPrefectures(): Promise<
  Result<Prefecture[], PrefectureApiError>
> {
  const apiKey = getApiKey();
  const responseResult = await safeFetch(
    makeUrl(ApiEndpoints.prefectures),
    makeRequestHeader(apiKey),
  );
  if (responseResult.isErr()) return err(responseResult.error);

  const handledResponseResult = await handleFetchResponse(
    responseResult.value,
    PrefecturesSuccessResponse,
  );
  if (handledResponseResult.isErr()) return err(handledResponseResult.error);

  return handledResponseResult.map<Prefecture[]>((res) =>
    res.result.map((prefecture) => ({
      code: prefecture.prefCode,
      name: prefecture.prefName,
    })),
  );
}
