"use server";

import { getApiKey } from "@/lib/get-api-key";
import {
  ApiEndpoints,
  handleFetchResponse,
  makeRequestHeader,
  makeUrl,
} from "@/lib/prefecture-api/client";
import {
  isRetryablePrefectureApiError,
  PrefectureApiErrorCode,
} from "@/lib/prefecture-api/error";
import { PrefecturesSuccessResponse } from "@/lib/prefecture-api/response";
import { retry } from "@/lib/retry";
import { safeFetch } from "@/lib/safe-fetch";
import {
  err,
  isOk,
  ok,
  type SerializableResult,
} from "@/lib/serializable-result";
import type { Prefecture } from "./schemas/prefecture";

/**
 * 都道府県の一覧を取得する
 */
export async function getPrefectures(): Promise<
  SerializableResult<Prefecture[], PrefectureApiErrorCode>
> {
  return await retry(getPrefecturesWithoutRetry, (r) =>
    isOk(r) ? false : isRetryablePrefectureApiError(r.error),
  );
}

async function getPrefecturesWithoutRetry(): Promise<
  SerializableResult<Prefecture[], PrefectureApiErrorCode>
> {
  const apiKey = getApiKey();
  const responseResult = await safeFetch(
    makeUrl(ApiEndpoints.prefectures),
    makeRequestHeader(apiKey),
  );
  if (responseResult.isErr()) return err(PrefectureApiErrorCode.FETCH_ERROR);

  const handledResponseResult = await handleFetchResponse(
    responseResult.value,
    PrefecturesSuccessResponse,
  );
  if (handledResponseResult.isErr()) return err(handledResponseResult.error);

  return ok(
    handledResponseResult.value.result.map((prefecture) => ({
      code: prefecture.prefCode,
      name: prefecture.prefName,
    })),
  );
}
