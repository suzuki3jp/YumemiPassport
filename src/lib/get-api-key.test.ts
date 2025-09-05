import { afterEach, describe, expect, it } from "vitest";
import { getApiKey } from "./get-api-key";

describe("getApiKey", () => {
  const OLD_API_KEY = process.env.API_KEY;
  afterEach(() => {
    process.env.API_KEY = OLD_API_KEY;
  });

  it("API_KEYがセットされていればその値を返す", () => {
    process.env.API_KEY = "test-key-abc";
    expect(getApiKey()).toBe("test-key-abc");
  });

  it("API_KEYが未設定ならエラーをスローする", () => {
    delete process.env.API_KEY;
    expect(() => getApiKey()).toThrow();
  });
});
