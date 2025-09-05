import { afterEach, describe, expect, it, vi } from "vitest";
import { FetchError, safeFetch } from "./safe-fetch";

function injectFetchMock(data: Response | Error) {
  const mockFetch =
    data instanceof Response
      ? vi.fn().mockResolvedValue(data)
      : vi.fn().mockRejectedValue(data);
  global.fetch = mockFetch;
  return mockFetch;
}

const FETCH_ARGS = [
  "https://example.com",
  { method: "POST", body: "data" },
] as const;

describe("safeFetch", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("fetchの引数に正しく渡される", async () => {
    const mockFetch = injectFetchMock(new Response());

    await safeFetch(...FETCH_ARGS);
    expect(mockFetch).toHaveBeenCalledWith(...FETCH_ARGS);
  });

  it("fetchが成功したときOkで返す", async () => {
    const mockResponse = new Response("ok");
    injectFetchMock(mockResponse);

    const result = await safeFetch(...FETCH_ARGS);
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toBe(mockResponse);
  });

  it("fetchが失敗したときErr(FetchError)で返す", async () => {
    injectFetchMock(new Error("fail"));

    const result = await safeFetch(...FETCH_ARGS);
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(FetchError);
  });
});
