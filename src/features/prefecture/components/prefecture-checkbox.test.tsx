import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Population } from "@/features/population/schemas/population";
import type { Prefecture } from "../schemas/prefecture";
import {
  fetchPopulationIfNotCached,
  getSelected,
  setSelected,
} from "./prefecture-checkbox";

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
      prefecture: dummyPrefecture,
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
      prefecture: dummyPrefecture,
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
      prefecture: dummyPrefecture,
    });
    expect(getPopulationMock).toHaveBeenCalledWith(dummyPrefecture.code);
    expect(setPopulationCacheMock).toHaveBeenCalledWith(expect.any(Function));
  });
});

const prefectureA: Prefecture = { code: 1, name: "北海道" };
const prefectureB: Prefecture = { code: 2, name: "青森県" };

describe("getSelected", () => {
  it("選択済みの場合はtrueを返す", () => {
    const selectedPrefectures = [1, 2];
    expect(getSelected(selectedPrefectures, prefectureA)).toBe(true);
    expect(getSelected(selectedPrefectures, prefectureB)).toBe(true);
  });
  it("未選択の場合はfalseを返す", () => {
    const selectedPrefectures = [1];
    expect(getSelected(selectedPrefectures, prefectureB)).toBe(false);
  });
});

describe("setSelected", () => {
  it("未選択→選択にすると追加される", () => {
    const selectedPrefectures = [2];
    const setSelectedPrefectures = vi.fn();
    setSelected({
      selected: true,
      selectedPrefectures,
      setSelectedPrefectures,
      prefecture: prefectureA,
    });
    expect(setSelectedPrefectures).toHaveBeenCalledWith([2, 1]);
  });

  it("選択→未選択にすると削除される", () => {
    const selectedPrefectures = [1, 2];
    const setSelectedPrefectures = vi.fn();
    setSelected({
      selected: false,
      selectedPrefectures,
      setSelectedPrefectures,
      prefecture: prefectureA,
    });
    expect(setSelectedPrefectures).toHaveBeenCalledWith([2]);
  });

  it("状態が変わらない場合は何もしない", () => {
    const selectedPrefectures = [1, 2];
    const setSelectedPrefectures = vi.fn();
    setSelected({
      selected: true,
      selectedPrefectures,
      setSelectedPrefectures,
      prefecture: prefectureA,
    });
    expect(setSelectedPrefectures).not.toHaveBeenCalled();
  });
});
