import { describe, expect, it, vi } from "vitest";

import type { Prefecture } from "../schemas/prefecture";
import { getSelected, setSelected } from "./prefecture-checkbox";

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
