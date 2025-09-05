import { err, ok } from "neverthrow";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as clientModule from "@/lib/prefecture-api/client";
import {
  BadRequestError,
  ForbiddenError,
  InternalError,
} from "@/lib/prefecture-api/error";
import { getPrefectures } from "./get-prefectures";

describe("getPrefectures", () => {
  const OLD_API_KEY = process.env.API_KEY;
  afterEach(() => {
    vi.restoreAllMocks();
    process.env.API_KEY = OLD_API_KEY;
  });

  it("process.env.API_KEYの値がfetchFromPrefectureApiに渡される", async () => {
    process.env.API_KEY = "test-key-123";
    const spy = vi
      .spyOn(clientModule, "fetchFromPrefectureApi")
      .mockResolvedValue(ok({ message: null, result: [] }));

    await getPrefectures();
    expect(spy).toHaveBeenCalledWith({
      path: "/prefectures",
      apiKey: "test-key-123",
    });
  });

  it("正常なレスポンスの場合はPrefecture[]でOkを返す", async () => {
    process.env.API_KEY = "dummy-key";
    const mockApiResponse = {
      message: null,
      result: [
        { prefCode: 1, prefName: "北海道" },
        { prefCode: 13, prefName: "東京都" },
      ],
    };
    vi.spyOn(clientModule, "fetchFromPrefectureApi").mockResolvedValue(
      ok(mockApiResponse),
    );

    const result = await getPrefectures();
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual([
        { code: 1, name: "北海道" },
        { code: 13, name: "東京都" },
      ]);
    }
  });

  it("APIがエラーの場合はErr(InternalError)を返す", async () => {
    process.env.API_KEY = "dummy-key";
    vi.spyOn(clientModule, "fetchFromPrefectureApi").mockResolvedValue(
      err(new InternalError()),
    );

    const result = await getPrefectures();
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(InternalError);
    }
  });

  it("APIがForbiddenErrorの場合はErr(ForbiddenError)を返す", async () => {
    process.env.API_KEY = "dummy-key";
    vi.spyOn(clientModule, "fetchFromPrefectureApi").mockResolvedValue(
      err(new ForbiddenError()),
    );

    const result = await getPrefectures();
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(ForbiddenError);
    }
  });

  it("APIがBadRequestErrorの場合はErr(BadRequestError)を返す", async () => {
    process.env.API_KEY = "dummy-key";
    vi.spyOn(clientModule, "fetchFromPrefectureApi").mockResolvedValue(
      err(new BadRequestError()),
    );

    const result = await getPrefectures();
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(BadRequestError);
    }
  });

  it("process.env.API_KEYが未設定の場合はエラーがスローされる", async () => {
    delete process.env.API_KEY;
    // getApiKeyがthrowすることを期待
    await expect(getPrefectures()).rejects.toThrow();
  });
});
