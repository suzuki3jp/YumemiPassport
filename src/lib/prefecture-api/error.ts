// docs: https://yumemi-frontend-engineer-codecheck-api.vercel.app/api-doc

export enum PrefectureApiErrorCode {
  /**
   * 404 Not Found
   * エンドポイントが間違っている可能性
   */
  NOT_FOUND = 404,

  /**
   * 500 Internal Server Error
   * リトライするべきなエラー
   */
  INTERNAL_ERROR = 500,

  /**
   * 403 Forbidden
   * API キーが無いか、不正
   */
  FORBIDDEN = 403,

  /**
   * 400 Bad Request
   * 必要なパラメータが無いかフォーマットが不正
   */
  BAD_REQUEST = 400,

  /**
   * API からレスポンスを zod スキーマでパースしようとしたが、失敗したときに返されるエラー
   * これが発生した場合、API の仕様が変わった可能性がある
   */
  PARSE_ERROR = 1000, // ステータスコードに存在しない値を使用

  /**
   * fetch がリジェクトされたときに返されるエラー
   * サーバーがエラーを返したときはこのエラーは使用されません。
   * ref: https://developer.mozilla.org/ja/docs/Web/API/Fetch_API/Using_Fetch#%E3%83%AC%E3%82%B9%E3%83%9D%E3%83%B3%E3%82%B9%E3%82%B9%E3%83%86%E3%83%BC%E3%82%BF%E3%82%B9%E3%81%AE%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF
   */
  FETCH_ERROR = 1001, // ステータスコードに存在しない値を使用
}
