import { Checkbox } from "@/components/checkbox";
import { ErrorCard } from "@/components/error-card";
import { getPrefectures } from "@/features/prefecture/get-prefectures";

export async function PrefecturesList() {
  const prefectures = await getPrefectures();

  if (prefectures.isErr())
    return (
      <ErrorCard
        title="エラーが発生しました"
        description="都道府県の取得に失敗しました。"
      />
    );

  return (
    <section className="mb-6 space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-3 font-medium text-gray-700">都道府県</h2>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {prefectures.value.map((prefecture) => (
          <Checkbox
            key={`prefecture-checkbox-${prefecture.code}`}
            title={prefecture.name}
          />
        ))}
      </div>
    </section>
  );
}
