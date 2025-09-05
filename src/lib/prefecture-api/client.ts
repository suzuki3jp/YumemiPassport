import { err, ok, type Result } from "neverthrow";
import type z from "zod";

import { safeFetch } from "../safe-fetch";
import {
  ApiErrorCode,
  BadRequestError,
  ForbiddenError,
  InternalError,
  NotFoundError,
  ParseError,
  type PrefectureApiError,
} from "./error";
import { PrefecturesSuccessResponse } from "./response";

const BASE_URL =
  "https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1";

const ApiEndpoints = {
  prefectures: "/prefectures",
} as const;

type ApiEndpoints = typeof ApiEndpoints;

/**
 * 都道府県 API からデータを取得する
 * API docs: https://yumemi-frontend-engineer-codecheck-api.vercel.app/api-doc
 * @param options
 * @returns
 */
export async function fetchFromPrefectureApi(
  options: FetchOptions,
): Promise<Result<PrefecturesSuccessResponse, PrefectureApiError>> {
  if (options.path === ApiEndpoints.prefectures) {
    const responseResult = await safeFetch(
      `${BASE_URL}${ApiEndpoints.prefectures}`,
      {
        headers: {
          "X-API-KEY": options.apiKey,
        },
      },
    );
    if (responseResult.isErr()) return err(responseResult.error);

    const handledResponseResult = await handleFetchResponse(
      responseResult.value,
      PrefecturesSuccessResponse,
    );
    if (handledResponseResult.isErr()) return err(handledResponseResult.error);

    return ok(handledResponseResult.value);
  }

  return err(new NotFoundError());
}

type FetchOptions = FetchPrefecturesOptions;

interface FetchPrefecturesOptions {
  path: ApiEndpoints["prefectures"];
  apiKey: string;
}

/**
 * API からのレスポンスをスキーマ、API エラーにマッピングする
 * @param response
 * @param responseSchema
 * @returns
 */
async function handleFetchResponse<T extends z.ZodObject>(
  response: Response,
  responseSchema: T,
): Promise<Result<z.infer<T>, PrefectureApiError>> {
  if (response.ok) {
    const responseBody = await response.json();
    const parseResult = responseSchema.safeParse(responseBody);
    if (parseResult.success) {
      return ok(parseResult.data);
    }
    return err(new ParseError());
  }

  // Handling error codes
  if (response.status === ApiErrorCode.NOT_FOUND) {
    return err(new NotFoundError());
  }

  if (response.status === ApiErrorCode.INTERNAL_ERROR) {
    return err(new InternalError());
  }

  if (response.status === ApiErrorCode.FORBIDDEN) {
    return err(new ForbiddenError());
  }

  if (response.status === ApiErrorCode.BAD_REQUEST) {
    return err(new BadRequestError());
  }

  // ここは到達しえない場所なので throw して型推論を効かせる
  // このエラーが発生した場合、API の仕様が変わった可能性がある
  throw new Error("Unreachable code: unexpected response.status");
}
