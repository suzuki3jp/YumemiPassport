"use client";

export function ReloadButton() {
  return (
    <button
      type="button"
      onClick={() => location.reload()}
      className="mt-3 cursor-pointer rounded-md bg-red-100 px-4 py-2 font-medium text-red-800 text-sm transition-colors hover:bg-red-200"
    >
      ページを再読込する
    </button>
  );
}
