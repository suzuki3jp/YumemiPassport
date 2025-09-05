import { err, ok, type Result } from "neverthrow";

/**
 * Fetch API をラップして、エラーを Result 型で返す
 * @param args
 * @returns
 */
export async function safeFetch(
  ...args: Parameters<typeof fetch>
): Promise<Result<Response, FetchError>> {
  try {
    const response = await fetch(...args);
    return ok(response);
  } catch {
    return err(new FetchError());
  }
}

/**
 * fetch がリジェクトされたときに返されるエラー
 * サーバーがエラーを返したときはこのエラーは使用されません。
 * ref: https://developer.mozilla.org/ja/docs/Web/API/Fetch_API/Using_Fetch#%E3%83%AC%E3%82%B9%E3%83%9D%E3%83%B3%E3%82%B9%E3%82%B9%E3%83%86%E3%83%BC%E3%82%BF%E3%82%B9%E3%81%AE%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF
 */
export class FetchError extends Error {}
