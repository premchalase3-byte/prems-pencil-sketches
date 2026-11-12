
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { timingSafeEqual } from "node:crypto";

import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import {
  decryptTrackingCode,
  encryptTrackingCode,
  hashTrackingCode,
} from "@/lib/tracking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET: Retrieve the tracking code for an authenticated admin.
export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    await requireAdmin();

    const { id } = await context.params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid order ID." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const order = await Order.findById(id).select(
      "+trackingCodeEncrypted"
    );

    if (!order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    // Existing orders may not have an encrypted tracking code yet.
    if (!order.trackingCodeEncrypted) {
      return NextResponse.json(
        { needsSetup: true },
        {
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const trackingCode = decryptTrackingCode(
      order.trackingCodeEncrypted
    );

    return NextResponse.json(
      {
        success: true,
        trackingCode,
        needsSetup: false,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    console.error("Tracking code retrieval failed:", error);

    return NextResponse.json(
      { error: "Unable to retrieve tracking code." },
      { status: 500 }
    );
  }
}

// POST: Verify and encrypt the tracking code of an existing order.
export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    await requireAdmin();

    const { id } = await context.params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid order ID." },
        { status: 400 }
      );
    }

    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("code" in body) ||
      typeof body.code !== "string"
    ) {
      return NextResponse.json(
        { error: "Please provide a valid tracking code." },
        { status: 400 }
      );
    }

    const trackingCode = body.code.trim();

    if (trackingCode.length < 10 || trackingCode.length > 100) {
      return NextResponse.json(
        { error: "Please provide a valid tracking code." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const order = await Order.findById(id).select(
      "+trackingCodeEncrypted"
    );

    if (!order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    // Compare the submitted code's hash with the stored hash.
    const storedHash = order.trackingCodeHash;
    const submittedHash = hashTrackingCode(trackingCode);

    const storedHashBuffer = Buffer.from(storedHash, "hex");
    const submittedHashBuffer = Buffer.from(submittedHash, "hex");

    if (
      storedHashBuffer.length !== submittedHashBuffer.length ||
      !timingSafeEqual(storedHashBuffer, submittedHashBuffer)
    ) {
      return NextResponse.json(
        {
          error:
            "Tracking code does not match this order. Please check the code and try again.",
        },
        { status: 400 }
      );
    }

    // The code matches. Store its encrypted copy.
    order.trackingCodeEncrypted = encryptTrackingCode(trackingCode);
    order.updatedAt = new Date();

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Tracking code securely saved.",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    console.error("Tracking code setup failed:", error);

    return NextResponse.json(
      { error: "Unable to save tracking code." },
      { status: 500 }
    );
  }
}
