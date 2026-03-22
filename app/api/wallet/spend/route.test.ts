import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/session";

vi.mock("@/lib/session", () => ({
    getSessionUser: vi.fn(),
}));

const { mockQuery, mockBeginTransaction, mockCommit, mockRollback, mockRelease } = vi.hoisted(() => ({
    mockQuery: vi.fn(),
    mockBeginTransaction: vi.fn(),
    mockCommit: vi.fn(),
    mockRollback: vi.fn(),
    mockRelease: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
    db: {
        getConnection: vi.fn().mockResolvedValue({
            query: mockQuery,
            beginTransaction: mockBeginTransaction,
            commit: mockCommit,
            rollback: mockRollback,
            release: mockRelease,
        }),
    },
}));

describe("POST /api/wallet/spend", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return 401 if unauthorized", async () => {
        vi.mocked(getSessionUser).mockResolvedValue(null);

        const req = new NextRequest("http://localhost/api/wallet/spend", {
            method: "POST",
            body: JSON.stringify({ amount: 10, description: "Food" }),
        });

        const response = await POST(req);
        expect(response.status).toBe(401);
    });

    it("should return 400 for invalid amount", async () => {
        vi.mocked(getSessionUser).mockResolvedValue({ id: 1, username: "testuser", email: "test@example.com" });

        const req = new NextRequest("http://localhost/api/wallet/spend", {
            method: "POST",
            body: JSON.stringify({ amount: -5 }),
        });

        const response = await POST(req);
        expect(response.status).toBe(400);
    });

    it("should return 422 if insufficient balance", async () => {
        vi.mocked(getSessionUser).mockResolvedValue({ id: 1, username: "testuser", email: "test@example.com" });

        mockQuery.mockResolvedValueOnce([[{ balance: 5 }]]);

        const req = new NextRequest("http://localhost/api/wallet/spend", {
            method: "POST",
            body: JSON.stringify({ amount: 10 }),
        });

        const response = await POST(req);

        expect(mockRollback).toHaveBeenCalled();
        expect(mockRelease).toHaveBeenCalled();
        expect(response.status).toBe(422);
    });

    it("should process spend correctly and return 200", async () => {
        vi.mocked(getSessionUser).mockResolvedValue({ id: 1, username: "testuser", email: "test@example.com" });

        mockQuery.mockResolvedValueOnce([[{ balance: 50 }]]);

        mockQuery.mockResolvedValueOnce([]);

        mockQuery.mockResolvedValueOnce([]);

        mockQuery.mockResolvedValueOnce([[{ balance: 40 }]]);

        const req = new NextRequest("http://localhost/api/wallet/spend", {
            method: "POST",
            body: JSON.stringify({ amount: 10, description: "Lunch" }),
        });

        const response = await POST(req);
        const data = await response.json();

        expect(mockCommit).toHaveBeenCalled();
        expect(mockRelease).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(data.balance).toBe(40);
        expect(data.message).toBe("Spending recorded");
    });
});
