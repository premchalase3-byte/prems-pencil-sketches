
"use client";

import { FormEvent, useState } from "react";
import {
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  Loader2,
  Package,
  Search,
  Truck,
  Wallet,
  XCircle,
} from "lucide-react";

type OrderStage = {
  key: string;
  label: string;
  category: string;
  status: string;
  completedAt: string | null;
};

type PublicOrder = {
  customerName: string;
  artworkType: string;
  artworkSize: string;
  framing?: "framed" | "frameless";
  createdAt: string;
  estimatedDelivery: string | null;
  orderStatus: string;
  payment: {
    total: number;
    advancePaid: number;
    balance: number;
    finalPaymentCompleted: boolean;
  };
  production: {
    currentStage: string;
    progressPercent: number;
    stages: OrderStage[];
  };
  delivery: {
    status: string;
    courierName: string | null;
    courierTrackingNumber: string | null;
  };
};

function formatDate(value: string | null) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getStageIcon(status: string) {
  if (status === "completed") return CheckCircle2;
  if (status === "current" || status === "in_progress") return Clock3;
  return Circle;
}

export default function TrackOrderForm() {
  const [code, setCode] = useState("");
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setOrder(null);

    const trackingCode = code.trim().toUpperCase();

    if (!trackingCode) {
      setError("Please enter your tracking code.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: trackingCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to find your order.");
        return;
      }

      setOrder(data.order);
    } catch {
      setError(
        "Something went wrong. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-7">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[#e8dfd3] bg-white p-5 shadow-sm sm:p-8"
      >
        <label
          htmlFor="tracking-code"
          className="mb-3 block text-sm font-semibold text-[#292622]"
        >
          Enter your tracking code
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="tracking-code"
            type="text"
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            placeholder="PREM-XXXX-XXXX-XXXX-XXXX"
            autoComplete="off"
            spellCheck={false}
            maxLength={50}
            className="min-w-0 flex-1 rounded-xl border border-[#e5ded4] bg-[#fcfaf7] px-4 py-4 text-sm font-medium tracking-wider text-[#292622] outline-none transition placeholder:text-[#b2aaa0] focus:border-[#b18a52] focus:ring-2 focus:ring-[#b18a52]/15"
          />

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#98713d] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#78572e] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Search size={17} />
                Track Order
              </>
            )}
          </button>
        </div>

        <p className="mt-3 text-xs leading-5 text-[#8b8175]">
          Enter the unique tracking code shared with you through WhatsApp.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <XCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {order && <OrderDetails order={order} />}
    </div>
  );
}

function OrderDetails({ order }: { order: PublicOrder }) {
  const completedStages = order.production.stages.filter(
    (stage) => stage.status === "completed"
  ).length;

  const progress = Math.max(
    0,
    Math.min(100, order.production.progressPercent || 0)
  );

  const isCancelled = order.orderStatus === "cancelled";
  const isArchived = order.orderStatus === "archived";

  return (
    <section className="space-y-6" aria-live="polite">
      <div className="rounded-2xl border border-[#e8dfd3] bg-white p-5 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b18a52]">
              Order details
            </p>

            <h2
              className="mt-2 text-2xl font-semibold text-[#292622]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Hello, {order.customerName}
            </h2>

            <p className="mt-2 text-sm text-[#77716a]">
              Your artwork order is registered successfully.
            </p>
          </div>

          <span className="rounded-full bg-[#f3eee6] px-3 py-2 text-xs font-semibold capitalize text-[#80613a]">
            {order.orderStatus.replaceAll("_", " ")}
          </span>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-4 border-t border-[#eee8df] pt-6 sm:grid-cols-3">
          <InfoItem label="Artwork" value={order.artworkType} />
          <InfoItem label="Size" value={order.artworkSize} />
          <InfoItem
            label="Framing"
            value={order.framing === "framed" ? "Framed" : "Frameless"}
          />
          <InfoItem label="Order date" value={formatDate(order.createdAt)} />
          <InfoItem
            label="Estimated delivery"
            value={formatDate(order.estimatedDelivery)}
          />
          <InfoItem label="Production completed" value={`${progress}%`} />
          <InfoItem
            label="Stages completed"
            value={`${completedStages}/${order.production.stages.length}`}
          />
        </div>
      </div>

      {isCancelled || isArchived ? (
        <div className="rounded-2xl border border-[#e8dfd3] bg-white p-6">
          <p className="font-semibold text-[#292622]">
            {isCancelled
              ? "This order has been cancelled."
              : "This order is archived."}
          </p>
          <p className="mt-2 text-sm text-[#77716a]">
            Please contact the studio if you need more information.
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-[#e8dfd3] bg-white p-5 shadow-sm sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b18a52]">
                  Production progress
                </p>
                <h3 className="mt-2 text-xl font-semibold text-[#292622]">
                  Your artwork is taking shape
                </h3>
              </div>

              <span className="text-2xl font-semibold tabular-nums text-[#98713d]">
                {progress}%
              </span>
            </div>

            <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-[#eee8df]">
              <div
                className="h-full rounded-full bg-[#b18a52] transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="mt-3 text-xs text-[#8b8175]">
              {completedStages} of {order.production.stages.length} production
              stages completed.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e8dfd3] bg-white p-5 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b18a52]">
              Artwork journey
            </p>

            <h3 className="mt-2 text-xl font-semibold text-[#292622]">
              Production timeline
            </h3>

            <div className="mt-7">
              {order.production.stages.map((stage, index) => {
                const isCompleted = stage.status === "completed";
                const isCurrent =
                  stage.status === "current" ||
                  stage.status === "in_progress";

                const Icon = getStageIcon(stage.status);

                return (
                  <div
                    key={stage.key}
                    className="relative flex gap-4 pb-7 last:pb-0"
                  >
                    {index !== order.production.stages.length - 1 && (
                      <div
                        className={`absolute left-[15px] top-8 h-full w-px ${
                          isCompleted ? "bg-[#b18a52]" : "bg-[#e8dfd3]"
                        }`}
                      />
                    )}

                    <div
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        isCompleted
                          ? "bg-[#98713d] text-white"
                          : isCurrent
                            ? "border-2 border-[#b18a52] bg-[#fbf6ee] text-[#98713d]"
                            : "border border-[#e8dfd3] bg-white text-[#b8afa3]"
                      }`}
                    >
                      <Icon size={16} />
                    </div>

                    <div className="min-w-0 flex-1 pt-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p
                          className={`text-sm font-semibold ${
                            isCompleted || isCurrent
                              ? "text-[#292622]"
                              : "text-[#999187]"
                          }`}
                        >
                          {stage.label}
                        </p>

                        {isCompleted && (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-[#8b7048]">
                            <Check size={13} />
                            Completed
                          </span>
                        )}

                        {isCurrent && (
                          <span className="rounded-full bg-[#f5eddf] px-2 py-1 text-[10px] font-semibold text-[#98713d]">
                            In progress
                          </span>
                        )}
                      </div>

                      {isCompleted && stage.completedAt && (
                        <p className="mt-1 text-xs text-[#999187]">
                          Completed on {formatDate(stage.completedAt)}
                        </p>
                      )}

                      {!isCompleted && !isCurrent && (
                        <p className="mt-1 text-xs text-[#aaa196]">
                          Waiting to begin
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-[#e8dfd3] bg-white p-5 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <Wallet className="text-[#98713d]" size={21} />
              <h3 className="text-lg font-semibold text-[#292622]">
                Payment summary
              </h3>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <PaymentRow
                label="Total artwork price"
                value={order.payment.total}
              />
              <PaymentRow
                label="Advance received"
                value={order.payment.advancePaid}
              />
              <div className="border-t border-[#eee8df] pt-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-[#292622]">
                    Remaining balance
                  </span>
                  <span className="text-lg font-semibold text-[#98713d]">
                    {formatCurrency(order.payment.balance)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-[#f8f5f0] p-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={17}
                  className={
                    order.payment.finalPaymentCompleted
                      ? "text-green-700"
                      : "text-[#98713d]"
                  }
                />
                <span className="font-medium text-[#51483d]">
                  {order.payment.finalPaymentCompleted
                    ? "Final payment completed"
                    : "Final payment pending"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e8dfd3] bg-white p-5 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              {order.delivery.status === "delivered" ? (
                <CheckCircle2 className="text-[#98713d]" size={21} />
              ) : (
                <Truck className="text-[#98713d]" size={21} />
              )}

              <h3 className="text-lg font-semibold text-[#292622]">
                Delivery information
              </h3>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <InfoItem
                label="Delivery status"
                value={order.delivery.status.replaceAll("_", " ")}
              />

              {order.delivery.courierName && (
                <InfoItem
                  label="Courier"
                  value={order.delivery.courierName}
                />
              )}

              {order.delivery.courierTrackingNumber && (
                <InfoItem
                  label="Courier tracking number"
                  value={order.delivery.courierTrackingNumber}
                />
              )}
            </div>
          </div>
        </>
      )}

      <div className="rounded-xl bg-[#f1ebe1] p-5 text-center">
        <Package className="mx-auto text-[#98713d]" size={22} />
        <p className="mt-3 text-sm font-semibold text-[#51483d]">
          Every sketch is made with care.
        </p>
        <p className="mt-1 text-xs leading-5 text-[#817568]">
          Thank you for choosing PREM&apos;S Pencil Sketches.
        </p>
      </div>
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-[#999187]">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-[#403a33]">
        {value}
      </p>
    </div>
  );
}

function PaymentRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[#77716a]">{label}</span>
      <span className="font-medium text-[#403a33]">
        {formatCurrency(value)}
      </span>
    </div>
  );
}
