import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ErrorCard } from "./error-card";

describe("ErrorCard", () => {
  afterEach(() => {
    cleanup();
  });

  it("タイトルと説明が正しく表示される", () => {
    render(
      <ErrorCard title="エラータイトル" description="エラーの説明文です" />,
    );
    expect(screen.getByText("エラータイトル")).toBeInTheDocument();
    expect(screen.getByText("エラーの説明文です")).toBeInTheDocument();
  });
});
