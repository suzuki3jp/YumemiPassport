import z from "zod";

/**
 * 都道府県のスキーマ
 * API はこの構造ではないため、`RawPrefecture` から変換して使う
 */
export const Prefecture = z.object({
  code: z.number(),
  name: z.string(),
});

export type Prefecture = z.infer<typeof Prefecture>;
