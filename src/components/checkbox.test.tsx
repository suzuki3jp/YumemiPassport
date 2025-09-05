import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  afterEach(() => {
    cleanup();
  });

  it("タイトルが正しく表示される", () => {
    render(<Checkbox title="テスト用チェックボックス" />);
    expect(screen.getByText("テスト用チェックボックス")).toBeInTheDocument();
  });

  it("デフォルトではチェックされていない", () => {
    render(<Checkbox title="テスト用チェックボックス" />);
    const input = screen.getByRole("checkbox");
    expect(input).not.toBeChecked();
  });

  it("defaultChecked が反映される", () => {
    render(<Checkbox title="テスト用チェックボックス" defaultChecked />);
    const input = screen.getByRole("checkbox");
    expect(input).toBeChecked();
  });

  it("クリック時に onChange が正しく呼ばれる", () => {
    const handleChange = vi.fn();
    render(
      <Checkbox title="テスト用チェックボックス" onChange={handleChange} />,
    );
    const input = screen.getByRole("checkbox");
    fireEvent.click(input);
    expect(handleChange).toHaveBeenCalledWith(true);
    fireEvent.click(input);
    expect(handleChange).toHaveBeenCalledWith(false);
  });
});
