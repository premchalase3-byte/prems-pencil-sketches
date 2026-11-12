
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import {
  hashTrackingCode,
  normalizeTrackingCode,
} from "@/lib/tracking";
import { trackingLookupSchema } from "@/lib/validations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = trackingLookupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Enter your tracking code." },
        { status: 400 }
      );
    }

    const normalized = normalizeTrackingCode(parsed.data.code);

    if (!normalized.startsWith("PREM") || normalized.length < 16) {
      return NextResponse.json(
        {
          error:
            "We couldn't find an order with that tracking code.",
        },
        { status: 404 }
      );
    }

    await connectToDatabase();

    const order = await Order.findOne({
      trackingCodeHash: hashTrackingCode(parsed.data.code),
      orderStatus: { $ne: "archived" },
    }).lean();

    if (!order) {
      return NextResponse.json(
        {
          error:
            "We couldn't find an order with that tracking code.",
        },
        { status: 404 }
      );
    }

    // Explicit public response: never expose phone, internal notes,
    // tracking-code hashes or internal database identifiers.

    return NextResponse.json({
      order: {
        customerName: order.customer?.name ?? "",
        artworkType: order.artwork?.type ?? "",
        artworkSize: order.artwork?.size ?? "",
        framing: order.artwork?.framing ?? "frameless",

        createdAt: order.createdAt,

        estimatedDelivery:
          order.delivery?.estimatedDate ?? null,

        orderStatus: order.orderStatus,

        payment: {
          total: order.payment?.total ?? 0,
          advancePaid: order.payment?.advancePaid ?? 0,
          balance: order.payment?.balance ?? 0,
          finalPaymentCompleted:
            order.payment?.finalPaymentCompleted ?? false,
        },

        production: {
          currentStage:
            order.production?.currentStage ?? "order-placed",

          progressPercent:
            order.production?.progressPercent ?? 0,

          stages: (order.production?.stages ?? []).map(
            (stage) => ({
              key: stage.key,
              label: stage.label,
              category: stage.category,
              status: stage.status,
              completedAt: stage.completedAt ?? null,
            })
          ),
        },

        delivery: {
          status:
            order.delivery?.status ?? "not-dispatched",

          courierName:
            order.delivery?.courierName || null,

          courierTrackingNumber:
            order.delivery?.courierTrackingNumber || null,
        },
      },
    });
  } catch (error) {
    console.error("Tracking lookup failed:", error);

    return NextResponse.json(
      {
        error:
          "Unable to check your order right now. Please try again later.",
      },
      { status: 500 }
    );
  }
}
