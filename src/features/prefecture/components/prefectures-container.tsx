import type { PropsWithChildren } from "react";
import "server-only";

import { PrefecturesProvider } from "@/contexts/prefectures";
import { getPrefectures } from "../get-prefectures";

export async function PrefecturesContainer({ children }: PropsWithChildren) {
  const prefectures = await getPrefectures();

  return (
    <PrefecturesProvider prefectures={prefectures}>
      {children}
    </PrefecturesProvider>
  );
}
