import { err, ok, type Result } from "neverthrow";
import type z from "zod";

import {
  ApiErrorCode,
  BadRequestError,
  ForbiddenError,
  InternalError,
  NotFoundError,
  ParseError,
  type PrefectureApiError,
} from "./error";

export const BASE_URL =
  "https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1";

export const ApiEndpoints = {
  prefectures: "/prefectures",
} as const;

export type ApiEndpoints = typeof ApiEndpoints;

/**
 * API からのレスポンスをスキーマ、API エラーにマッピングする
 * @param response
 * @param responseSchema
 * @returns
 */
export async function handleFetchResponse<T extends z.ZodObject>(
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

export function makeRequestHeader(apiKey: string): {
  headers: { [key: string]: string };
} {
  return {
    headers: {
      "X-API-KEY": apiKey,
    },
  };
}

export function makeUrl(endpoint: ApiEndpoints[keyof ApiEndpoints]): string {
  return `${BASE_URL}${endpoint}`;
}
