// vitest 動作確認用のテストファイル。後に消す
import { describe, expect, it } from "vitest";

function sum(a: number, b: number) {
  return a + b;
}

describe("sum", () => {
  it("should return the sum of two numbers", () => {
    expect(sum(1, 2)).toBe(3);
  });
});
