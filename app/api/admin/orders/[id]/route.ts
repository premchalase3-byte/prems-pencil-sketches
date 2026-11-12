
import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import AuditLog from "@/models/AuditLog";
import { ORDER_STAGES } from "@/lib/constants/order-stages";
import { updateOrderStagesSchema } from "@/lib/validations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET: Retrieve one order for the admin.
export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    await requireAdmin();

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid order ID." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const order = await Order.findById(id)
      .select("-trackingCodeHash -trackingCodeHint")
      .lean();

    if (!order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    console.error("Order retrieval failed:", error);

    return NextResponse.json(
      { error: "Unable to retrieve this order." },
      { status: 500 }
    );
  }
}

// PATCH: Update production stages.
export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    await requireAdmin();

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid order ID." },
        { status: 400 }
      );
    }

    const body: unknown = await request.json();
    const parsed = updateOrderStagesSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid stage update. Please check all 13 stages." },
        { status: 400 }
      );
    }

    const submittedStages = parsed.data.stages;
    const expectedKeys = ORDER_STAGES.map((stage) => stage.key);
    const submittedKeys = submittedStages.map((stage) => stage.key);

    if (
      new Set(submittedKeys).size !== expectedKeys.length ||
      !expectedKeys.every((key) => submittedKeys.includes(key))
    ) {
      return NextResponse.json(
        { error: "The submitted stages do not match this order's workflow." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    const now = new Date();

    const updatedStages = ORDER_STAGES.map((definition) => {
      const submitted = submittedStages.find(
        (stage) => stage.key === definition.key
      );

      const previous = order.production?.stages?.find(
        (stage) => stage.key === definition.key
      );

      const status = submitted?.status ?? "pending";

      return {
        key: definition.key,
        label: definition.label,
        category: definition.category,
        status,
        updatedAt: now,
        ...(status === "completed"
          ? { completedAt: previous?.completedAt ?? now }
          : {}),
      };
    });

    const productionStages = updatedStages.filter(
      (stage) => stage.category === "production"
    );

    const completedProduction = productionStages.filter(
      (stage) => stage.status === "completed"
    ).length;

    const progressPercent = Math.round(
      (completedProduction / productionStages.length) * 100
    );

    const inProgressStage = updatedStages.find(
      (stage) => stage.status === "in_progress"
    );

    const completedStages = updatedStages.filter(
      (stage) => stage.status === "completed"
    );

    const currentStage =
      inProgressStage?.key ??
      completedStages.at(-1)?.key ??
      "order-placed";

    order.set("production.stages", updatedStages);
    order.set("production.progressPercent", progressPercent);
    order.set("production.currentStage", currentStage);
    order.set("updatedAt", now);

    await order.save();

    await AuditLog.create({
      action: "order_stages_updated",
      orderId: order._id,
      details: {
        progressPercent,
        currentStage,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Order stages updated successfully.",
      progressPercent,
      currentStage,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    console.error("Order stage update failed:", error);

    return NextResponse.json(
      { error: "Unable to update order stages." },
      { status: 500 }
    );
  }
}

// DELETE: Permanently delete an order and its associated audit logs.
export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  try {
    await requireAdmin();

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid order ID." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    // Remove audit history associated with this deleted order.
    try {
      await AuditLog.deleteMany({ orderId: deletedOrder._id });
    } catch (auditError) {
      // The order is already deleted. Report the cleanup failure
      // in server logs rather than suggesting the deletion failed.
      console.error(
        "Order deleted, but associated audit-log cleanup failed:",
        auditError
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order permanently deleted.",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    console.error("Order deletion failed:", error);

    return NextResponse.json(
      { error: "Unable to delete this order." },
      { status: 500 }
    );
  }
}
