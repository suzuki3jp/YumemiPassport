import z from "zod";

import { RawPopulation, RawPrefecture } from "./entity";

/**
 * 都道府県取得APIの成功レスポンス
 */
export const PrefecturesSuccessResponse = z.object({
  message: z.null(),
  result: z.array(RawPrefecture),
});

export type PrefecturesSuccessResponse = z.infer<
  typeof PrefecturesSuccessResponse
>;

/**
 * 人口取得APIの成功レスポンス
 */
export const PopulationSuccessResponse = z.object({
  message: z.null(),
  result: z.object({
    boundaryYear: z.number(),
    data: z.array(
      z.object({
        label: z.string(),
        data: z.array(RawPopulation),
      }),
    ),
  }),
});

export type PopulationSuccessResponse = z.infer<
  typeof PopulationSuccessResponse
>;
