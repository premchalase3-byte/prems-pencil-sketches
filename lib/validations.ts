
import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1).max(100),
  password: z.string().min(1).max(200),
});

export const createOrderSchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  customerPhone: z.string().trim().min(7).max(20),

  artworkType: z.string().trim().min(2).max(100),
  artworkSize: z.enum(["A4", "A3", "A5", "Custom"]),

  // Framing preference
  framing: z.enum(["framed", "frameless"]).default("frameless"),

  artworkDescription: z.string().trim().max(1000).optional().default(""),

  totalAmount: z.number().finite().positive().max(10000000),
  advancePaid: z.number().finite().min(0).max(10000000),

  estimatedDelivery: z.string().datetime().optional().nullable(),

  internalNotes: z.string().trim().max(3000).optional().default(""),
}).refine((data) => data.advancePaid <= data.totalAmount, {
  message: "Advance payment cannot exceed the total amount.",
  path: ["advancePaid"],
});

export const trackingLookupSchema = z.object({
  code: z.string().trim().min(8).max(50),
});

export const updateOrderStagesSchema = z.object({
  stages: z.array(
    z.object({
      key: z.string().min(1).max(100),
      status: z.enum(["pending", "in_progress", "completed"]),
    })
  ).length(13),
});
