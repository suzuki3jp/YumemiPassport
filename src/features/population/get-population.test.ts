import { err, ok } from "neverthrow";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { safeFetch } from "@/lib/safe-fetch";
import { getPopulation } from "./get-population";

vi.mock("@/lib/safe-fetch");

describe("getPopulation", () => {
  const mockSafeFetch = safeFetch as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.API_KEY = "dummy-key";
  });

  it("safeFetchの引数を検証する", async () => {
    mockSafeFetch.mockResolvedValueOnce(
      ok(new Response(JSON.stringify({ message: null, result: { data: [] } }))),
    );

    await getPopulation(1);
    expect(mockSafeFetch).toHaveBeenCalledWith(
      expect.stringContaining("population"),
      expect.any(Object),
    );
  });

  it("safeFetchの返り値が異常系の場合、エラーを返す", async () => {
    const error = { message: "error" };
    mockSafeFetch.mockResolvedValueOnce(err(error));

    const result = await getPopulation(1);
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toEqual(error);
  });

  it("safeFetchの返り値が正常系の場合、Population型に変換される", async () => {
    const apiResponse = {
      message: null,
      result: {
        boundaryYear: 2025,
        data: [
          {
            label: "総人口",
            data: [
              { year: 2020, value: 100, rate: undefined },
              { year: 2025, value: 110, rate: 1.1 },
            ],
          },
        ],
      },
    };
    mockSafeFetch.mockResolvedValueOnce(
      ok(new Response(JSON.stringify(apiResponse))),
    );

    const result = await getPopulation(1);
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual([
      {
        label: "総人口",
        data: [
          { year: 2020, population: 100, rate: undefined },
          { year: 2025, population: 110, rate: 1.1 },
        ],
      },
    ]);
  });
});
