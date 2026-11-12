import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const auditLogSchema = new Schema(
  {
    actor: { type: String, required: true, default: "admin" },
    action: { type: String, required: true, maxlength: 100 },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    details: { type: Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: Date.now, required: true },
  },
  { versionKey: false },
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ orderId: 1, createdAt: -1 });

export type AuditLogDocument = InferSchemaType<typeof auditLogSchema>;

const AuditLog: Model<AuditLogDocument> =
  (mongoose.models.AuditLog as Model<AuditLogDocument>) ??
  mongoose.model<AuditLogDocument>("AuditLog", auditLogSchema);

export default AuditLog;
