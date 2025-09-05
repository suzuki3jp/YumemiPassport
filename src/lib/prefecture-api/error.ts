// docs: https://yumemi-frontend-engineer-codecheck-api.vercel.app/api-doc
import type { FetchError } from "../safe-fetch";

export const ApiErrorCode = {
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
  FORBIDDEN: 403,
  BAD_REQUEST: 400,
} as const;

export type PrefectureApiError =
  | FetchError
  | InternalError
  | NotFoundError
  | ForbiddenError
  | BadRequestError
  | ParseError;

/**
 * 500 Internal Server Error
 * リトライするべきなエラー
 */
export class InternalError extends Error {}

/**
 * 404 Not Found
 * エンドポイントが間違っている可能性
 */
export class NotFoundError extends Error {}

/**
 * 403 Forbidden
 * API キーが無いか、不正
 */
export class ForbiddenError extends Error {}

/**
 * 400 Bad Request
 * 必要なパラメータが無いかフォーマットが不正
 */
export class BadRequestError extends Error {}

/**
 * API からレスポンスを zod スキーマでパースしようとしたが、失敗したときに返されるエラー
 * これが発生した場合、API の仕様が変わった可能性がある
 */
export class ParseError extends Error {}
