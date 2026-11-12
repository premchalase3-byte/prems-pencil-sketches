
import { NextResponse } from "next/server";
import type { HydratedDocument } from "mongoose";

import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Order, {
  createInitialStages,
  type OrderDocument,
} from "@/models/Order";
import AuditLog from "@/models/AuditLog";
import { createOrderSchema } from "@/lib/validations";
import {
  generateTrackingCode,
  getTrackingCodeHint,
  hashTrackingCode,
  encryptTrackingCode,
} from "@/lib/tracking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: Retrieve all orders for the admin dashboard.
export async function GET() {
  try {
    await requireAdmin();
    await connectToDatabase();

    const orders = await Order.find()
      .select("-trackingCodeHash -trackingCodeHint")
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return NextResponse.json({ orders });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    console.error("Order list failed:", error);

    return NextResponse.json(
      { error: "Unable to retrieve orders." },
      { status: 500 }
    );
  }
}

// POST: Create a new customer order.
export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body: unknown = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please check the order details.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const data = parsed.data;

    let trackingCode = "";
    let order: HydratedDocument<OrderDocument> | null = null;

    // Retry if a tracking-code hash collision occurs.
    for (let attempt = 0; attempt < 3; attempt += 1) {
      trackingCode = generateTrackingCode();

      try {
        order = await Order.create({
          customer: {
            name: data.customerName,
            phone: data.customerPhone,
          },

          // Store the hash for public tracking lookup.
          trackingCodeHash: hashTrackingCode(trackingCode),

          // Store the encrypted code for secure admin retrieval.
          trackingCodeEncrypted: encryptTrackingCode(trackingCode),

          trackingCodeHint: getTrackingCodeHint(trackingCode),

          artwork: {
            type: data.artworkType,
            size: data.artworkSize,
            framing: data.framing,
            description: data.artworkDescription,
          },

          payment: {
            currency: "INR",
            total: data.totalAmount,
            advancePaid: data.advancePaid,
            balance: data.totalAmount - data.advancePaid,
            finalPaymentCompleted: false,
            records:
              data.advancePaid > 0
                ? [
                    {
                      amount: data.advancePaid,
                      type: "advance",
                      paidAt: new Date(),
                      note: "Advance payment",
                    },
                  ]
                : [],
          },

          production: {
            stages: createInitialStages(data.advancePaid),
            currentStage:
              data.advancePaid > 0
                ? "advance-payment-received"
                : "order-placed",
            progressPercent: 0,
          },

          delivery: {
            estimatedDate: data.estimatedDelivery
              ? new Date(data.estimatedDelivery)
              : undefined,
          },

          internalNotes: data.internalNotes,
        });

        break;
      } catch (error) {
        if (
          !(error instanceof Error) ||
          !error.message.includes("duplicate")
        ) {
          throw error;
        }
      }
    }

    if (!order) {
      return NextResponse.json(
        {
          error:
            "Could not generate a unique tracking code. Please try again.",
        },
        { status: 500 }
      );
    }

    // Record order creation in the audit log.
    await AuditLog.create({
      action: "order_created",
      orderId: order._id,
      details: {
        customerName: data.customerName,
        trackingCodeHint: getTrackingCodeHint(trackingCode),
      },
    });

    // Return the tracking code only once when the order is created.
    return NextResponse.json(
      {
        success: true,
        trackingCode,
        order: {
          id: order._id.toString(),
          customerName: order.customer?.name ?? "",
          artworkType: order.artwork?.type ?? "",
          artworkSize: order.artwork?.size ?? "",
          totalAmount: order.payment?.total ?? 0,
          advancePaid: order.payment?.advancePaid ?? 0,
          balance: order.payment?.balance ?? 0,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    console.error("Order creation failed:", error);

    return NextResponse.json(
      { error: "Unable to create order." },
      { status: 500 }
    );
  }
}
