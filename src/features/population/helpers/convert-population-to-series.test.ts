// 都道府県のモックデータ
const mockPrefectures = [
  { code: 1, name: "北海道" },
  { code: 2, name: "青森県" },
  { code: 3, name: "岩手県" },
];

import { describe, expect, it, vi } from "vitest";

import { convertPopulationToSeries } from "./convert-population-to-series";

// ./population-chart-container には highcharts が含まれるため、JSDOM 環境でのテスト実行時にエラーになる。
// そのため highcharts をモック化する。
vi.mock("highcharts", () => ({
  default: {},
}));

type Population = {
  label: string;
  data: { year: number; population: number; rate?: number }[];
};

describe("convertPopulationToSeries", () => {
  // より丁寧なダミーデータ
  const basePopulation = [
    {
      label: "総人口",
      data: [
        { year: 1980, population: 1200000 },
        { year: 1990, population: 1250000 },
        { year: 2000, population: 1300000 },
        { year: 2010, population: 1280000 },
        { year: 2020, population: 1260000 },
      ],
    },
    {
      label: "年少人口",
      data: [
        { year: 1980, population: 300000 },
        { year: 1990, population: 280000 },
        { year: 2000, population: 250000 },
        { year: 2010, population: 220000 },
        { year: 2020, population: 200000 },
      ],
    },
    {
      label: "生産年齢人口",
      data: [
        { year: 1980, population: 700000 },
        { year: 1990, population: 750000 },
        { year: 2000, population: 800000 },
        { year: 2010, population: 780000 },
        { year: 2020, population: 760000 },
      ],
    },
    {
      label: "老年人口",
      data: [
        { year: 1980, population: 200000 },
        { year: 1990, population: 220000 },
        { year: 2000, population: 250000 },
        { year: 2010, population: 280000 },
        { year: 2020, population: 300000 },
      ],
    },
  ];

  function createCache(map: Record<number, Population[] | null>) {
    const cache = new Map<number, Population[] | null>();
    for (const key in map) {
      cache.set(Number(key), map[key]);
    }
    return cache;
  }

  it("正常系: 選択された都道府県・人口区分に対して正しい series を返す", () => {
    const populationsCache = createCache({
      1: basePopulation,
      2: basePopulation,
    });
    const selectedPrefectures = [1, 2];
    const populationTypes = {
      types: ["総人口", "年少人口", "生産年齢人口", "老年人口"],
      selected: "総人口",
    };
    const result = convertPopulationToSeries({
      populationsCache,
      selectedPrefectures,
      populationTypes,
      prefectures: mockPrefectures,
    });
    expect(result).toEqual([
      {
        type: "line",
        name: "北海道",
        data: [
          { x: 1980, y: 1200000 },
          { x: 1990, y: 1250000 },
          { x: 2000, y: 1300000 },
          { x: 2010, y: 1280000 },
          { x: 2020, y: 1260000 },
        ],
      },
      {
        type: "line",
        name: "青森県",
        data: [
          { x: 1980, y: 1200000 },
          { x: 1990, y: 1250000 },
          { x: 2000, y: 1300000 },
          { x: 2010, y: 1280000 },
          { x: 2020, y: 1260000 },
        ],
      },
    ]);
  });

  it("キャッシュが undefined の場合は無視される（fetch 未完了）", () => {
    const populationsCache = createCache({
      2: basePopulation,
    });
    const selectedPrefectures = [1, 2];
    const populationTypes = {
      types: ["総人口", "年少人口", "生産年齢人口", "老年人口"],
      selected: "総人口",
    };
    const result = convertPopulationToSeries({
      populationsCache,
      selectedPrefectures,
      populationTypes,
      prefectures: mockPrefectures,
    });
    expect(result).toEqual([
      {
        type: "line",
        name: "青森県",
        data: [
          { x: 1980, y: 1200000 },
          { x: 1990, y: 1250000 },
          { x: 2000, y: 1300000 },
          { x: 2010, y: 1280000 },
          { x: 2020, y: 1260000 },
        ],
      },
    ]);
  });

  it("キャッシュが null の場合は null を返す（fetch 失敗）", () => {
    const populationsCache = createCache({
      1: null,
    });
    const selectedPrefectures = [1];
    const populationTypes = {
      types: ["総人口", "年少人口", "生産年齢人口", "老年人口"],
      selected: "総人口",
    };
    const result = convertPopulationToSeries({
      populationsCache,
      selectedPrefectures,
      populationTypes,
      prefectures: mockPrefectures,
    });
    expect(result).toBeNull();
  });

  it("選択された人口区分が存在しない場合は null を返す", () => {
    const populationsCache = createCache({
      1: basePopulation,
    });
    const selectedPrefectures = [1];
    const populationTypes = {
      types: ["総人口", "年少人口", "生産年齢人口", "老年人口"],
      selected: "存在しない区分",
    };
    const result = convertPopulationToSeries({
      populationsCache,
      selectedPrefectures,
      populationTypes,
      prefectures: mockPrefectures,
    });
    expect(result).toBeNull();
  });
});
