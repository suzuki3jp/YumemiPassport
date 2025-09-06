import { PrefecturesList } from "@/features/prefecture/components/prefectures-list";

export function PrefecturesSection() {
  return (
    <section className="mb-6 space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-3 font-medium text-gray-700">都道府県</h2>
      <PrefecturesList />
    </section>
  );
}
