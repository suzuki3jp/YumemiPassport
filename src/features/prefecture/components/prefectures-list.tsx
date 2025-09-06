"use client";
import { ErrorCard } from "@/components/error-card";
import { usePrefectures } from "@/contexts/prefectures";
import { PrefectureCheckbox } from "./prefecture-checkbox";

export function PrefecturesList() {
  const prefectures = usePrefectures();

  if (prefectures === null)
    return (
      <ErrorCard
        title="エラーが発生しました。"
        description="都道府県データの取得に失敗しました。"
      />
    );

  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
      {prefectures.map((prefecture) => (
        <PrefectureCheckbox
          prefecture={prefecture}
          key={`prefecture-checkbox-${prefecture.code}`}
        />
      ))}
    </div>
  );
}
