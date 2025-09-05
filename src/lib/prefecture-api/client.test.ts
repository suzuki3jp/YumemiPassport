import { describe, expect, it } from "vitest";
import z from "zod";

import {
  ApiEndpoints,
  BASE_URL,
  handleFetchResponse,
  makeRequestHeader,
  makeUrl,
} from "./client";
import { PrefectureApiErrorCode } from "./error";

const dummySchema = z.object({ success: z.boolean() });

describe("handleFetchResponse", () => {
  it("should return parsed JSON for successful response", async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    } as Response;

    const result = await handleFetchResponse(mockResponse, dummySchema);
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual({ success: true });
  });

  it("should return NOT_FOUND for 404 response", async () => {
    const mockResponse = {
      ok: false,
      status: 404,
      json: async () => ({}),
    } as Response;

    const result = await handleFetchResponse(mockResponse, dummySchema);
    expect(result.isErr()).toBe(true);
    const error = result._unsafeUnwrapErr();
    expect(error).toEqual(PrefectureApiErrorCode.NOT_FOUND);
  });
});

describe("makeRequestHeader", () => {
  it("should set apiKey in headers", () => {
    const apiKey = "test-key";
    const result = makeRequestHeader(apiKey);
    expect(result.headers["X-API-KEY"]).toBe(apiKey);
  });
});

describe("makeUrl", () => {
  it("should construct the correct URL", () => {
    const result = makeUrl(ApiEndpoints.population, { prefCode: 23 });
    expect(result).toBe(`${BASE_URL}${ApiEndpoints.population}?prefCode=23`);
  });
});
