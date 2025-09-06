import { describe, expect, it } from "vitest";
import type { SerializableResult } from "./index";
import { _unsafeUnwrap, _unsafeUnwrapErr, err, isErr, isOk, ok } from "./index";

describe("SerializableResult", () => {
  describe("ok", () => {
    it("SerializableOk型の値を生成できる", () => {
      const result = ok(123);
      expect(result).toEqual({ success: true, value: 123 });
    });
  });

  describe("err", () => {
    it("SerializableErr型の値を生成できる", () => {
      const result = err("error!");
      expect(result).toEqual({ success: false, error: "error!" });
    });
  });

  describe("isOk", () => {
    it("SerializableOk型の場合はtrueを返す", () => {
      const result: SerializableResult<number, string> = ok(1);
      expect(isOk(result)).toBe(true);
    });
    it("SerializableErr型の場合はfalseを返す", () => {
      const result: SerializableResult<number, string> = err("fail");
      expect(isOk(result)).toBe(false);
    });
  });

  describe("isErr", () => {
    it("SerializableErr型の場合はtrueを返す", () => {
      const result: SerializableResult<number, string> = err("fail");
      expect(isErr(result)).toBe(true);
    });
    it("SerializableOk型の場合はfalseを返す", () => {
      const result: SerializableResult<number, string> = ok(1);
      expect(isErr(result)).toBe(false);
    });
  });

  describe("_unsafeUnwrap", () => {
    it("SerializableOk型の場合はvalueを返す", () => {
      const result: SerializableResult<number, string> = ok(42);
      expect(_unsafeUnwrap(result)).toBe(42);
    });
    it("SerializableErr型の場合は例外を投げる", () => {
      const result: SerializableResult<number, string> = err("fail");
      expect(() => _unsafeUnwrap(result)).toThrow(
        "Called _unsafeUnwrap on an Err value: fail",
      );
    });
  });

  describe("_unsafeUnwrapErr", () => {
    it("SerializableErr型の場合はerrorを返す", () => {
      const result: SerializableResult<number, string> = err("fail");
      expect(_unsafeUnwrapErr(result)).toBe("fail");
    });
    it("SerializableOk型の場合は例外を投げる", () => {
      const result: SerializableResult<number, string> = ok(42);
      expect(() => _unsafeUnwrapErr(result)).toThrow(
        "Called _unsafeUnwrapErr on an Ok value: 42",
      );
    });
  });
});
