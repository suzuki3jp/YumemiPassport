import { err, ok } from "neverthrow";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PrefectureApiErrorCode } from "@/lib/prefecture-api/error";
import { safeFetch } from "@/lib/safe-fetch";
import {
  _unsafeUnwrap,
  _unsafeUnwrapErr,
  isErr,
  isOk,
} from "@/lib/serializable-result";
import { getPrefectures } from "./get-prefectures";

vi.mock("@/lib/safe-fetch");

describe("getPrefectures", () => {
  const mockSafeFetch = safeFetch as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.API_KEY = "dummy-key";
  });

  it("safeFetchの引数を検証する", async () => {
    mockSafeFetch.mockResolvedValueOnce(
      ok(new Response(JSON.stringify({ message: null, result: [] }))),
    );

    await getPrefectures();
    expect(mockSafeFetch).toHaveBeenCalledWith(
      expect.stringContaining("prefectures"),
      expect.any(Object),
    );
  });

  it("safeFetchの返り値が異常系の場合、エラーを返す", async () => {
    const error = { message: "error" };
    mockSafeFetch.mockResolvedValueOnce(err(error));

    const result = await getPrefectures();
    expect(isErr(result)).toBe(true);
    expect(_unsafeUnwrapErr(result)).toEqual(
      PrefectureApiErrorCode.FETCH_ERROR,
    );
  });

  it("safeFetchの返り値が正常系の場合、Prefecture型に変換される", async () => {
    const apiResponse = {
      message: null,
      result: [
        { prefCode: 1, prefName: "北海道" },
        { prefCode: 13, prefName: "東京都" },
      ],
    };
    mockSafeFetch.mockResolvedValueOnce(
      ok(new Response(JSON.stringify(apiResponse))),
    );

    const result = await getPrefectures();
    expect(isOk(result)).toBe(true);
    expect(_unsafeUnwrap(result)).toEqual([
      { code: 1, name: "北海道" },
      { code: 13, name: "東京都" },
    ]);
  });
});
