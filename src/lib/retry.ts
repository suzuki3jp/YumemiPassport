import { a } from "vitest/dist/chunks/suite.d.FvehnV49.js";

interface RetryOptions {
  /**
   * リトライ回数 (デフォルト: 3)
   */
  retries?: number;
}

/**
 * 指数バックオフでリトライを行う
 *
 * `NOTE`: この関数は、与えられた非同期関数をtry-catchで囲まずに実行します。
 * そのため、非同期関数内で例外が発生した場合、その例外は呼び出し元に伝播されます。
 * 呼び出し元で適切に例外処理を行う必要があります。
 * @param safeFunc 安全に実行できる非同期関数
 * @returns 成功した場合は関数の戻り値、全て失敗した場合は null
 */
export async function retry<T extends () => Promise<unknown>>(
  safeFunc: T,
  shouldRetry: (result: Awaited<ReturnType<T>>) => boolean,
  options?: RetryOptions,
): Promise<Awaited<ReturnType<T>>> {
  const { retries = 3 } = options || {};

  let attempt = 0;
  let delay = 100; // 初期遅延時間 (ミリ秒)
  let latestResult: Awaited<ReturnType<T>>;

  while (attempt < retries) {
    const result = (await safeFunc()) as Awaited<ReturnType<T>>;
    latestResult = result;
    if (!shouldRetry(result)) {
      return result as Awaited<ReturnType<T>>;
    }

    attempt += 1;
    await new Promise((resolve) => setTimeout(resolve, delay));
    delay = Math.min(delay * 2, 1000); // 遅延時間を指数的に増加、最大1秒
  }

  // @ts-expect-error latestResult は必ずセットされる
  return latestResult;
}
