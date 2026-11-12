
export const ORDER_STAGES = [
  { key: "order-placed", label: "Order Placed", category: "order" },
  { key: "advance-payment-received", label: "Advance Payment Received", category: "payment" },
  { key: "grid-completed", label: "Grid Completed", category: "production" },
  { key: "outlines-completed", label: "Outlines Completed", category: "production" },
  { key: "raw-sketching-completed", label: "Raw Sketching Completed", category: "production" },
  { key: "shading-stage-1", label: "Shading – Stage 1", category: "production" },
  { key: "final-shading", label: "Final Shading", category: "production" },
  { key: "detailing", label: "Detailing", category: "production" },
  { key: "final-detailing", label: "Final Detailing", category: "production" },
  { key: "artwork-completed", label: "Artwork Completed", category: "production" },
  { key: "sent-for-delivery", label: "Sent for Delivery", category: "delivery" },
  { key: "order-received", label: "Order Received", category: "delivery" },
  { key: "final-payment-completed", label: "Final Payment Completed", category: "payment" },
] as const;

export type OrderStageKey = (typeof ORDER_STAGES)[number]["key"];
export type OrderStageCategory = (typeof ORDER_STAGES)[number]["category"];

export const PRODUCTION_STAGE_KEYS = ORDER_STAGES
  .filter((stage) => stage.category === "production")
  .map((stage) => stage.key) as OrderStageKey[];

export function getStageLabel(key: string): string {
  return ORDER_STAGES.find((stage) => stage.key === key)?.label ?? "Unknown stage";
}
