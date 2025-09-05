import type { PropsWithChildren } from "react";
import "server-only";

import { PrefecturesProvider } from "../contexts/prefectures";
import { SelectedPrefecturesProvider } from "../contexts/selected-prefectures";
import { getPrefectures } from "../get-prefectures";

export async function PrefecturesContainer({ children }: PropsWithChildren) {
  const prefectures = await getPrefectures();

  return (
    <PrefecturesProvider prefectures={prefectures}>
      <SelectedPrefecturesProvider>{children}</SelectedPrefecturesProvider>
    </PrefecturesProvider>
  );
}
