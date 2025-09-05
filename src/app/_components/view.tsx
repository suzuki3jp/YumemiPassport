import { PrefecturesContainer } from "@/features/prefecture/components/prefectures-container";
import { PrefecturesSection } from "./prefectures-section";

export function HomeView() {
  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-center font-bold text-2xl text-gray-800">
          都道府県別人口推移
        </h1>

        <PrefecturesContainer>
          <PrefecturesSection />
        </PrefecturesContainer>
      </div>
    </div>
  );
}
