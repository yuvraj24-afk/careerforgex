import { describe, it, expect } from "vitest";
import { z } from "zod";
import { MockDeterministicProvider } from "../src/lib/ai/mock-provider";
import { WebhookDispatcher } from "../src/lib/webhooks/dispatcher";
import { executeAllowlistedTool, toolRegistry } from "../src/lib/ai/tools";
import { hasRequiredRole } from "../src/lib/auth";

describe("CareerForgeX Validation & Systems Test Suite", () => {
  // Test 1: Lead Validation Schema
  it("should validate valid lead data and reject malformed emails", () => {
    const leadSchema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      company: z.string().min(2),
      automationGoal: z.string().min(10),
    });

    const validLead = {
      name: "Alex Sterling",
      email: "alex@company.com",
      company: "Acme Logistics",
      automationGoal: "Automate freight invoice parsing and NetSuite sync.",
    };

    expect(() => leadSchema.parse(validLead)).not.toThrow();

    const invalidLead = {
      name: "A",
      email: "invalid-email-string",
      company: "",
      automationGoal: "short",
    };

    expect(() => leadSchema.parse(invalidLead)).toThrow();
  });

  // Test 2: Booking Validation Schema
  it("should enforce date format YYYY-MM-DD on bookings", () => {
    const bookingSchema = z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      time: z.string().min(4),
      email: z.string().email(),
    });

    expect(() =>
      bookingSchema.parse({ date: "2026-10-02", time: "14:00", email: "test@domain.com" })
    ).not.toThrow();

    expect(() =>
      bookingSchema.parse({ date: "10/02/2026", time: "14:00", email: "test@domain.com" })
    ).toThrow();
  });

  // Test 3: AI Output Validation via MockDeterministicProvider
  it("should return structured, deterministic outputs for lead scoring in demo mode", async () => {
    const provider = new MockDeterministicProvider();
    const result = await provider.scoreLead({
      name: "Marcus Vance",
      company: "Vance Realty",
      email: "marcus@vancerealty.com",
      message: "Need real estate buyer tour scheduling automation",
    });

    expect(result).toHaveProperty("leadSummary");
    expect(result).toHaveProperty("intent");
    expect(result).toHaveProperty("industry", "Real Estate");
    expect(result).toHaveProperty("score");
    expect(result.score).toBeGreaterThan(70);
    expect(result).toHaveProperty("suggestedOutreachEmail");
  });

  // Test 4: Webhook HMAC Signature Verification
  it("should generate and verify valid cryptographic webhook signatures", () => {
    const dispatcher = new WebhookDispatcher();
    const payload = JSON.stringify({ event: "lead.created", id: "lead_123" });
    const signature = dispatcher.generateSignature(payload);

    expect(signature).toBeDefined();
    expect(typeof signature).toBe("string");
    expect(dispatcher.verifySignature(payload, signature)).toBe(true);

    const tamperedPayload = JSON.stringify({ event: "lead.created", id: "lead_999" });
    expect(dispatcher.verifySignature(tamperedPayload, signature)).toBe(false);
  });

  // Test 5: Allowlisted Tool Execution (calculateROI)
  it("should execute allowlisted calculateROI tool and compute recovered capacity", async () => {
    const toolCall = await executeAllowlistedTool("calculateROI", {
      employees: 5,
      hoursPerWeek: 10,
      hourlyCost: 50,
      weeksPerYear: 50,
      automationPercentage: 70,
    });

    expect(toolCall.success).toBe(true);
    expect(toolCall.result).toBeDefined();
    // 5 * 10 * 50 = 2500 hrs/yr. 70% automated = 1750 hrs
    expect(toolCall.result.automatedHours).toBe(1750);
    // 2500 * $50 = $125,000. 70% recovered = $87,500
    expect(toolCall.result.recoveredLaborCapacity).toBe(87500);
  });

  // Test 6: Authorization & RBAC
  it("should enforce RBAC privileges properly", () => {
    expect(hasRequiredRole("admin", ["viewer"])).toBe(true); // admin has superuser access
    expect(hasRequiredRole("staff", ["admin", "staff"])).toBe(true);
    expect(hasRequiredRole("viewer", ["admin", "staff"])).toBe(false);
  });
});
