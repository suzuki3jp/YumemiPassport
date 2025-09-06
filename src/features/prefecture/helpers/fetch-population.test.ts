import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Population } from "@/features/population/schemas/population";
import type { Prefecture } from "../schemas/prefecture";
import { fetchPopulationIfNotCached } from "./fetch-population";

let getPopulationMock: ReturnType<typeof vi.fn>;
vi.mock("@/features/population/get-population", () => ({
  getPopulation: (prefCode: number) => getPopulationMock(prefCode),
}));

describe("fetchPopulationIfNotCached", () => {
  const dummyPrefecture: Prefecture = { code: 1, name: "北海道" };
  let setPopulationCacheMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    setPopulationCacheMock = vi.fn();
    getPopulationMock = vi.fn();
  });

  it("キャッシュに人口データがある場合は何もしない", async () => {
    const populationsCache = new Map<number, Population[] | null>([
      [dummyPrefecture.code, [{ label: "test", data: [] }]],
    ]);
    await fetchPopulationIfNotCached({
      populationsCache,
      setPopulationCache: setPopulationCacheMock,
      prefCode: dummyPrefecture.code,
    });
    expect(getPopulationMock).not.toHaveBeenCalled();
    expect(setPopulationCacheMock).not.toHaveBeenCalled();
  });

  it("キャッシュに人口データがない場合は取得してキャッシュする（成功時）", async () => {
    const populationsCache = new Map<number, Population[] | null>();
    getPopulationMock.mockResolvedValue({
      ok: true,
      value: [{ label: "test", data: [] }],
    });
    await fetchPopulationIfNotCached({
      populationsCache,
      setPopulationCache: setPopulationCacheMock,
      prefCode: dummyPrefecture.code,
    });
    expect(getPopulationMock).toHaveBeenCalledWith(dummyPrefecture.code);
    expect(setPopulationCacheMock).toHaveBeenCalledWith(expect.any(Function));
  });

  it("キャッシュに人口データがない場合は取得して失敗時はnullをキャッシュする", async () => {
    const populationsCache = new Map<number, Population[] | null>();
    getPopulationMock.mockResolvedValue({ ok: false, error: "fail" });
    await fetchPopulationIfNotCached({
      populationsCache,
      setPopulationCache: setPopulationCacheMock,
      prefCode: dummyPrefecture.code,
    });
    expect(getPopulationMock).toHaveBeenCalledWith(dummyPrefecture.code);
    expect(setPopulationCacheMock).toHaveBeenCalledWith(expect.any(Function));
  });
});
