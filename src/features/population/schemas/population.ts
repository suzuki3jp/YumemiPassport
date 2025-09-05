import z from "zod";

/**
 * 人口データのスキーマ
 * API はこの構造ではないため、`RawPopulation` から変換して使う
 */
export const Population = z.object({
  label: z.string(),
  data: z.array(
    z.object({
      year: z.number(),
      population: z.number(),
      rate: z.number().optional(),
    }),
  ),
});

export type Population = z.infer<typeof Population>;
