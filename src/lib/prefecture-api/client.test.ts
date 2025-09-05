import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchFromPrefectureApi } from "./client";
import {
  ApiErrorCode,
  BadRequestError,
  ForbiddenError,
  InternalError,
  NotFoundError,
} from "./error";
import { PrefecturesSuccessResponse } from "./response";

type MockResponse = {
  ok: boolean;
  status?: number;
  json?: () => Promise<unknown>;
};
function injectFetchMock(data: MockResponse | Error) {
  const mockFetch =
    data instanceof Error
      ? vi.fn().mockRejectedValue(data)
      : vi.fn().mockResolvedValue(data);
  global.fetch = mockFetch;
  return mockFetch;
}

describe("fetchFromPrefectureApi", () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("正しいパスでfetchが呼ばれる", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ message: null, result: [] }),
    };
    const fetchMock = injectFetchMock(mockResponse);
    const apiKey = "dummy-key";
    const result = await fetchFromPrefectureApi({
      path: "/prefectures",
      apiKey,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/prefectures",
      {
        headers: {
          "X-API-KEY": apiKey,
        },
      },
    );
    expect(result.isOk()).toBe(true);
  });

  it("正常なレスポンスの場合はOkを返す", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ message: null, result: [] }),
    };
    injectFetchMock(mockResponse);
    const apiKey = "dummy-key";
    const result = await fetchFromPrefectureApi({
      path: "/prefectures",
      apiKey,
    });
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(PrefecturesSuccessResponse.safeParse(result.value).success).toBe(
        true,
      );
    }
  });

  it("存在しないパスの場合はNotFoundErrorを返す", async () => {
    const apiKey = "dummy-key";
    const result = await fetchFromPrefectureApi({
      // @ts-expect-error: 不正な値を渡していることをテストしたい
      path: "/unknown",
      apiKey,
    });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(NotFoundError);
    }
  });

  it("500レスポンスの場合はInternalErrorを返す", async () => {
    const mockResponse = { ok: false, status: ApiErrorCode.INTERNAL_ERROR };
    injectFetchMock(mockResponse);
    const apiKey = "dummy-key";
    const result = await fetchFromPrefectureApi({
      path: "/prefectures",
      apiKey,
    });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(InternalError);
    }
  });

  it("403レスポンスの場合はForbiddenErrorを返す", async () => {
    const mockResponse = { ok: false, status: ApiErrorCode.FORBIDDEN };
    injectFetchMock(mockResponse);
    const apiKey = "dummy-key";
    const result = await fetchFromPrefectureApi({
      path: "/prefectures",
      apiKey,
    });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(ForbiddenError);
    }
  });

  it("400レスポンスの場合はBadRequestErrorを返す", async () => {
    const mockResponse = { ok: false, status: ApiErrorCode.BAD_REQUEST };
    injectFetchMock(mockResponse);
    const apiKey = "dummy-key";
    const result = await fetchFromPrefectureApi({
      path: "/prefectures",
      apiKey,
    });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(BadRequestError);
    }
  });

  it("fetchが例外を投げた場合はエラーを返す", async () => {
    injectFetchMock(new Error("network error"));
    const apiKey = "dummy-key";
    const result = await fetchFromPrefectureApi({
      path: "/prefectures",
      apiKey,
    });
    expect(result.isErr()).toBe(true);
  });
});
