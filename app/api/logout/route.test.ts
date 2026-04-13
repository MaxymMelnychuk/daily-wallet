import { describe, it, expect, vi } from "vitest";
import { POST } from "./route";

vi.mock("@/lib/session", () => ({
    getSession: vi.fn().mockResolvedValue({
        destroy: vi.fn(),
    }),
}));

/**
 * Logout is thin: ensure we return JSON 200 and a stable message for the navbar
 * fetch handler.
 */
describe("POST /api/logout", () => {
    it("should return 200 and success message", async () => {
        const response = await POST();
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.message).toBe("Logged out successfully");
    });
});
