/**
 * Tests for the PredevAPI client
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { PredevAPI } from "./client";
import {
	PredevAPIError,
	AuthenticationError,
	RateLimitError,
} from "./exceptions";

// Mock the global fetch function
global.fetch = vi.fn();

describe("PredevAPI", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("initialization", () => {
		it("should initialize with API key", () => {
			const client = new PredevAPI({ apiKey: "test_key" });
			expect(client).toBeInstanceOf(PredevAPI);
		});

		it("should initialize with custom base URL", () => {
			const client = new PredevAPI({
				apiKey: "test_key",
				baseUrl: "https://custom.api.com/",
			});
			expect(client).toBeInstanceOf(PredevAPI);
		});
	});

	describe("fastSpec", () => {
		it("should successfully generate a fast spec", async () => {
			const mockResponse = {
				spec_id: "123",
				url: "https://example.com/spec",
			};

			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse,
			});

			const client = new PredevAPI({ apiKey: "test_key" });
			const result = await client.fastSpec({ input: "Build a todo app" });

			expect(result).toEqual(mockResponse);
			expect(global.fetch).toHaveBeenCalledTimes(1);
		});

		it("should generate fast spec with markdown format", async () => {
			const mockResponse = { markdown: "# Spec data" };

			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse,
			});

			const client = new PredevAPI({ apiKey: "test_key" });
			await client.fastSpec({
				input: "Build a todo app",
				outputFormat: "markdown",
			});

			const fetchCall = (global.fetch as any).mock.calls[0];
			const body = JSON.parse(fetchCall[1].body);
			expect(body.outputFormat).toBe("markdown");
		});

		it("should throw AuthenticationError on 401", async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: false,
				status: 401,
				json: async () => ({}),
			});

			const client = new PredevAPI({ apiKey: "invalid_key" });

			await expect(
				client.fastSpec({ input: "Build a todo app" })
			).rejects.toThrow(AuthenticationError);
		});

		it("should throw RateLimitError on 429", async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: false,
				status: 429,
				json: async () => ({}),
			});

			const client = new PredevAPI({ apiKey: "test_key" });

			await expect(
				client.fastSpec({ input: "Build a todo app" })
			).rejects.toThrow(RateLimitError);
		});

		it("should throw PredevAPIError on other errors", async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: false,
				status: 500,
				json: async () => ({ error: "Internal server error" }),
			});

			const client = new PredevAPI({ apiKey: "test_key" });

			await expect(
				client.fastSpec({ input: "Build a todo app" })
			).rejects.toThrow(PredevAPIError);
		});
	});

	describe("deepSpec", () => {
		it("should successfully generate a deep spec", async () => {
			const mockResponse = {
				spec_id: "456",
				url: "https://example.com/deep-spec",
			};

			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse,
			});

			const client = new PredevAPI({ apiKey: "test_key" });
			const result = await client.deepSpec({ input: "Build an ERP system" });

			expect(result).toEqual(mockResponse);
			expect(global.fetch).toHaveBeenCalledTimes(1);
		});

		it("should generate deep spec with URL format", async () => {
			const mockResponse = { url: "https://example.com" };

			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse,
			});

			const client = new PredevAPI({ apiKey: "test_key" });
			await client.deepSpec({
				input: "Build an ERP system",
				outputFormat: "url",
			});

			const fetchCall = (global.fetch as any).mock.calls[0];
			expect(fetchCall[0]).toContain("/deep-spec");
		});
	});

	describe("getSpecStatus", () => {
		it("should successfully get spec status", async () => {
			const mockResponse = {
				status: "completed",
				spec_id: "123",
			};

			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse,
			});

			const client = new PredevAPI({ apiKey: "test_key" });
			const result = await client.getSpecStatus("123");

			expect(result).toEqual(mockResponse);
			expect(global.fetch).toHaveBeenCalledTimes(1);
		});

		it("should throw AuthenticationError on 401", async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: false,
				status: 401,
				json: async () => ({}),
			});

			const client = new PredevAPI({ apiKey: "invalid_key" });

			await expect(client.getSpecStatus("123")).rejects.toThrow(
				AuthenticationError
			);
		});
	});

	describe("listSpecs", () => {
		it("should successfully list specs", async () => {
			const mockResponse = {
				specs: [
					{ _id: "1", input: "Build a todo app", status: "completed" },
					{ _id: "2", input: "Build an ERP system", status: "processing" },
				],
				total: 42,
				hasMore: true,
			};

			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse,
			});

			const client = new PredevAPI({ apiKey: "test_key" });
			const result = await client.listSpecs();

			expect(result).toEqual(mockResponse);
			expect(result.specs).toHaveLength(2);
			expect(result.total).toBe(42);
			expect(result.hasMore).toBe(true);
			expect(global.fetch).toHaveBeenCalledTimes(1);
		});

		it("should list specs with filters", async () => {
			const mockResponse = {
				specs: [{ _id: "1", input: "Build a todo app", status: "completed" }],
				total: 1,
				hasMore: false,
			};

			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse,
			});

			const client = new PredevAPI({ apiKey: "test_key" });
			await client.listSpecs({
				status: "completed",
				endpoint: "fast_spec",
				limit: 10,
				skip: 5,
			});

			const fetchCall = (global.fetch as any).mock.calls[0];
			expect(fetchCall[0]).toContain("/list-specs");
			expect(fetchCall[0]).toContain("status=completed");
			expect(fetchCall[0]).toContain("endpoint=fast_spec");
			expect(fetchCall[0]).toContain("limit=10");
			expect(fetchCall[0]).toContain("skip=5");
		});

		it("should throw AuthenticationError on 401", async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: false,
				status: 401,
				json: async () => ({}),
			});

			const client = new PredevAPI({ apiKey: "invalid_key" });

			await expect(client.listSpecs()).rejects.toThrow(AuthenticationError);
		});
	});

	describe("findSpecs", () => {
		it("should successfully find specs", async () => {
			const mockResponse = {
				specs: [
					{ _id: "1", input: "Build a payment system", status: "completed" },
				],
				total: 1,
				hasMore: false,
			};

			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse,
			});

			const client = new PredevAPI({ apiKey: "test_key" });
			const result = await client.findSpecs({ query: "payment" });

			expect(result).toEqual(mockResponse);
			expect(result.specs).toHaveLength(1);
			expect(global.fetch).toHaveBeenCalledTimes(1);
		});

		it("should find specs with regex pattern", async () => {
			const mockResponse = {
				specs: [
					{ _id: "1", input: "Build a todo app", status: "completed" },
					{ _id: "2", input: "Build an ERP system", status: "completed" },
				],
				total: 2,
				hasMore: false,
			};

			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse,
			});

			const client = new PredevAPI({ apiKey: "test_key" });
			await client.findSpecs({
				query: "^Build",
				status: "completed",
				limit: 20,
			});

			const fetchCall = (global.fetch as any).mock.calls[0];
			expect(fetchCall[0]).toContain("/find-specs");
			expect(fetchCall[0]).toContain("query=%5EBuild"); // URL encoded ^Build
			expect(fetchCall[0]).toContain("status=completed");
			expect(fetchCall[0]).toContain("limit=20");
		});

		it("should throw AuthenticationError on 401", async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: false,
				status: 401,
				json: async () => ({}),
			});

			const client = new PredevAPI({ apiKey: "invalid_key" });

			await expect(client.findSpecs({ query: "test" })).rejects.toThrow(
				AuthenticationError
			);
		});
	});

	describe("error handling", () => {
		it("should handle network errors", async () => {
			(global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

			const client = new PredevAPI({ apiKey: "test_key" });

			await expect(
				client.fastSpec({ input: "Build a todo app" })
			).rejects.toThrow(PredevAPIError);
		});

		it("should handle error responses with message", async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: false,
				status: 500,
				json: async () => ({ error: "Custom error message" }),
			});

			const client = new PredevAPI({ apiKey: "test_key" });

			await expect(
				client.fastSpec({ input: "Build a todo app" })
			).rejects.toThrow("Custom error message");
		});
	});
});
