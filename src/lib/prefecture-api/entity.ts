import z from "zod";

/**
 * API から取得した都道府県データの生の形式
 */
export const RawPrefecture = z.object({
  prefCode: z.number(),
  prefName: z.string(),
});

export type RawPrefecture = z.infer<typeof RawPrefecture>;
