import z from "zod";

/**
 * API から取得した都道府県データの生の形式
 */
export const RawPrefecture = z.object({
  prefCode: z.number(),
  prefName: z.string(),
});

export type RawPrefecture = z.infer<typeof RawPrefecture>;

/**
 * API から取得した人口データの生の形式
 * 総人口の場合は rate は存在しない
 */
export const RawPopulation = z.object({
  year: z.number(),
  value: z.number(),
  rate: z.number().optional(),
});

export type RawPopulation = z.infer<typeof RawPopulation>;
