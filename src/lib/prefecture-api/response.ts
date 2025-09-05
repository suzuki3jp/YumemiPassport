import z from "zod";

import { RawPrefecture } from "./entity";

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
