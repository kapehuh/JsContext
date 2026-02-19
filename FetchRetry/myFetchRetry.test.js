// fetchRetry.test.js
const fetchRetry = require("./myFetchRetry");

describe("fetchRetry", () => {
  const originalFetch = global.fetch;
  const mockUrl = "https://example.com/api";

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  const mockResponse = (ok, status, data) => ({
    ok,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  });

  test("should resolve with response on first success (status 2xx)", async () => {
    const mockFetch = jest
      .fn()
      .mockResolvedValue(mockResponse(true, 200, { id: 1 }));
    global.fetch = mockFetch;

    const response = await fetchRetry(mockUrl, 3, 10);
    expect(response).toEqual(
      expect.objectContaining({ ok: true, status: 200 }),
    );
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  test("should retry on HTTP error (non-2xx) and eventually succeed", async () => {
    const mockFetch = jest
      .fn()
      .mockResolvedValueOnce(mockResponse(false, 500))
      .mockResolvedValueOnce(mockResponse(false, 502))
      .mockResolvedValueOnce(mockResponse(true, 200, { id: 42 }));

    global.fetch = mockFetch;

    const response = await fetchRetry(mockUrl, 3, 10);
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  test("should retry on network error and eventually succeed", async () => {
    const mockFetch = jest
      .fn()
      .mockRejectedValueOnce(new Error("Network error"))
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce(mockResponse(true, 200, { id: 123 }));

    global.fetch = mockFetch;

    const response = await fetchRetry(mockUrl, 3, 10);
    expect(response.ok).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  test("should fail after exhausting all retries on HTTP errors", async () => {
    const mockFetch = jest.fn().mockResolvedValue(mockResponse(false, 500));
    global.fetch = mockFetch;

    await expect(fetchRetry(mockUrl, 3, 10)).rejects.toThrow("HTTP error 500");
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  test("should fail after exhausting all retries on network errors", async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error("Network error"));
    global.fetch = mockFetch;

    await expect(fetchRetry(mockUrl, 2, 10)).rejects.toThrow("Network error");
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  test("should respect retries = 1 (no retry)", async () => {
    const mockFetch = jest
      .fn()
      .mockRejectedValueOnce(new Error("Network error"));
    global.fetch = mockFetch;

    await expect(fetchRetry(mockUrl, 1, 10)).rejects.toThrow("Network error");
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  test("should wait the specified delay between retries", async () => {
    const delay = 50;
    const mockFetch = jest
      .fn()
      .mockRejectedValueOnce(new Error("Error 1"))
      .mockRejectedValueOnce(new Error("Error 2"))
      .mockResolvedValueOnce(mockResponse(true, 200, "OK"));

    global.fetch = mockFetch;

    const start = Date.now();
    const response = await fetchRetry(mockUrl, 3, delay);
    const end = Date.now();

    expect(response.ok).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(end - start).toBeGreaterThanOrEqual(2 * delay); // две задержки между тремя попытками
  });
});
