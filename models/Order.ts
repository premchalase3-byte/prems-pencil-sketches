
import mongoose, {
  Schema,
  type InferSchemaType,
  type Model,
} from "mongoose";

import { ORDER_STAGES } from "@/lib/constants/order-stages";

const stageSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["order", "payment", "production", "delivery"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
      required: true,
    },
    completedAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    customer: {
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20,
      },
    },

    trackingCodeHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    trackingCodeHint: {
      type: String,
      required: true,
      select: false,
    },

    trackingCodeEncrypted: {
      type: String,
      select: false,
    },

    artwork: {
      type: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },
      size: {
        type: String,
        enum: ["A4", "A3", "A5", "Custom"],
        required: true,
      },
      framing: {
        type: String,
        enum: ["framed", "frameless"],
        default: "frameless",
      },
      description: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: "",
      },
    },

    payment: {
      currency: {
        type: String,
        default: "INR",
        required: true,
      },
      total: {
        type: Number,
        required: true,
        min: 0,
      },
      advancePaid: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
      balance: {
        type: Number,
        required: true,
        min: 0,
      },
      finalPaymentCompleted: {
        type: Boolean,
        default: false,
      },
      records: [
        {
          amount: {
            type: Number,
            required: true,
            min: 0,
          },
          type: {
            type: String,
            enum: ["advance", "additional", "final"],
            required: true,
          },
          paidAt: {
            type: Date,
            default: Date.now,
          },
          note: {
            type: String,
            maxlength: 300,
            default: "",
          },
        },
      ],
    },

    production: {
      stages: {
        type: [stageSchema],
        required: true,
      },
      currentStage: {
        type: String,
        required: true,
        default: "order-placed",
      },
      progressPercent: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
    },

    delivery: {
      estimatedDate: {
        type: Date,
      },
      status: {
        type: String,
        enum: ["not-dispatched", "dispatched", "delivered"],
        default: "not-dispatched",
      },
      courierName: {
        type: String,
        trim: true,
        maxlength: 100,
        default: "",
      },
      courierTrackingNumber: {
        type: String,
        trim: true,
        maxlength: 100,
        default: "",
      },
    },

    internalNotes: {
      type: String,
      maxlength: 3000,
      default: "",
    },

    orderStatus: {
      type: String,
      enum: ["active", "completed", "cancelled", "archived"],
      default: "active",
      index: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { timestamps: false }
);

orderSchema.index({ createdAt: -1 });
orderSchema.index({ "customer.name": 1 });

export type OrderDocument = InferSchemaType<typeof orderSchema>;

const Order: Model<OrderDocument> =
  (mongoose.models.Order as Model<OrderDocument>) ??
  mongoose.model<OrderDocument>("Order", orderSchema);

export function createInitialStages(advancePaid: number) {
  return ORDER_STAGES.map((stage) => {
    const completed =
      stage.key === "order-placed" ||
      (stage.key === "advance-payment-received" && advancePaid > 0);

    return {
      key: stage.key,
      label: stage.label,
      category: stage.category,
      status: completed ? "completed" : "pending",
      ...(completed ? { completedAt: new Date() } : {}),
    };
  });
}

export default Order;
