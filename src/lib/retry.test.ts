import { describe, expect, it } from "vitest";
import { retry } from "./retry";

describe("retry", () => {
  it("途中で成功する場合は成功した値を返す", async () => {
    let callCount = 0;
    const fn = async () => {
      callCount++;
      if (callCount < 3) return "fail";
      return "success";
    };

    const shouldRetry = (result: string) => result === "fail";
    const result = await retry(fn, shouldRetry, { retries: 5 });
    expect(result).toBe("success");
    expect(callCount).toBe(3);
  });

  it("はじめから成功した場合は1回だけ呼ばれる", async () => {
    let callCount = 0;
    const fn = async () => {
      callCount++;
      return "success";
    };

    const shouldRetry = (result: string) => result === "fail";
    const result = await retry(fn, shouldRetry, { retries: 5 });
    expect(result).toBe("success");
    expect(callCount).toBe(1);
  });

  it("最後まで成功しなかった場合は最後の値を返す", async () => {
    let callCount = 0;
    const fn = async () => {
      callCount++;
      return "fail";
    };

    const shouldRetry = (result: string) => result === "fail";
    const result = await retry(fn, shouldRetry, { retries: 3 });
    expect(result).toBe("fail");
    expect(callCount).toBe(3);
  });
});
