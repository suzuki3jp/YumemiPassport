import { PrefecturesList } from "./prefectures-list";

export function HomeView() {
  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-center font-bold text-2xl text-gray-800">
          都道府県別人口推移
        </h1>

        <PrefecturesList />
      </div>
    </div>
  );
}
