
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Loader2,
  Save,
  Trash2,
  KeyRound,
} from "lucide-react";
import { ORDER_STAGES } from "@/lib/constants/order-stages";

type StageStatus = "pending" | "in_progress" | "completed";

type Stage = {
  key: string;
  label: string;
  category: string;
  status: StageStatus;
  completedAt?: string | null;
};

type OrderData = {
  _id: string;
  customer: {
    name: string;
    phone: string;
  };
  artwork: {
    type: string;
    size: string;
    framing?: "framed" | "frameless";
    description: string;
  };
  payment: {
    total: number;
    advancePaid: number;
    balance: number;
    finalPaymentCompleted: boolean;
  };
  production: {
    currentStage: string;
    progressPercent: number;
    stages: Stage[];
  };
  delivery: {
    estimatedDate?: string | null;
    status: string;
    courierName?: string;
    courierTrackingNumber?: string;
  };
  orderStatus: string;
  createdAt: string;
};

const statusOptions: {
  value: StageStatus;
  label: string;
}[] = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

function money(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function date(value?: string | null) {
  if (!value) return "Not specified";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function OrderDetailsManager({
  orderId,
}: {
  orderId: string;
}) {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [stages, setStages] = useState<Stage[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Tracking code states
  const [trackingCode, setTrackingCode] = useState("");
  const [trackingCodeInput, setTrackingCodeInput] = useState("");
  const [trackingLoading, setTrackingLoading] = useState(true);
  const [trackingSaving, setTrackingSaving] = useState(false);
  const [trackingNeedsSetup, setTrackingNeedsSetup] = useState(false);
  const [trackingError, setTrackingError] = useState("");
  const [trackingMessage, setTrackingMessage] = useState("");
  const [copying, setCopying] = useState(false);

  // Deletion state
  const [deleting, setDeleting] = useState(false);

  async function loadTrackingCode() {
    setTrackingLoading(true);
    setTrackingError("");
    setTrackingMessage("");
    setTrackingCode("");
    setTrackingNeedsSetup(false);

    try {
      const response = await fetch(
        `/api/admin/orders/${orderId}/tracking-code`,
        { cache: "no-store" }
      );

      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to retrieve tracking code.");
      }

      if (data.needsSetup) {
        setTrackingNeedsSetup(true);
        return;
      }

      setTrackingCode(data.trackingCode);
    } catch (err) {
      setTrackingError(
        err instanceof Error
          ? err.message
          : "Unable to retrieve tracking code."
      );
    } finally {
      setTrackingLoading(false);
    }
  }

  async function loadOrder() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        cache: "no-store",
      });

      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load this order.");
      }

      setOrder(data.order);

      const savedStages: Stage[] = data.order.production?.stages || [];

      const completeStages = ORDER_STAGES.map((definition) => {
        const saved = savedStages.find(
          (stage) => stage.key === definition.key
        );

        return {
          key: definition.key,
          label: definition.label,
          category: definition.category,
          status: saved?.status || "pending",
          completedAt: saved?.completedAt || null,
        };
      });

      setStages(completeStages);

      await loadTrackingCode();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load this order."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadOrder();
  }, [orderId]);

  function changeStage(key: string, status: StageStatus) {
    setStages((current) =>
      current.map((stage) => ({
        ...stage,
        status:
          stage.key === key
            ? status
            : status === "in_progress" && stage.status === "in_progress"
              ? "pending"
              : stage.status,
      }))
    );

    setMessage("");
  }

  async function saveStages() {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stages: stages.map(({ key, status }) => ({ key, status })),
        }),
      });

      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save stage updates.");
      }

      setMessage("Production stages saved successfully.");
      await loadOrder();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save stage updates."
      );
    } finally {
      setSaving(false);
    }
  }

  async function saveExistingTrackingCode() {
    if (!trackingCodeInput.trim()) {
      setTrackingError("Please enter the customer's original tracking code.");
      return;
    }

    setTrackingSaving(true);
    setTrackingError("");
    setTrackingMessage("");

    try {
      const response = await fetch(
        `/api/admin/orders/${orderId}/tracking-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: trackingCodeInput.trim(),
          }),
        }
      );

      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save tracking code.");
      }

      setTrackingCodeInput("");
      setTrackingNeedsSetup(false);
      setTrackingMessage("Tracking code verified and securely saved.");

      await loadTrackingCode();
    } catch (err) {
      setTrackingError(
        err instanceof Error ? err.message : "Unable to save tracking code."
      );
    } finally {
      setTrackingSaving(false);
    }
  }

  async function copyTrackingCode() {
    if (!trackingCode) return;

    setCopying(true);
    setTrackingError("");
    setTrackingMessage("");

    try {
      await navigator.clipboard.writeText(trackingCode);
      setTrackingMessage(
        "Tracking code copied. You can now send it to the customer."
      );
    } catch {
      setTrackingError(
        "Unable to copy automatically. Please select and copy the tracking code manually."
      );
    } finally {
      setCopying(false);
    }
  }

  async function deleteOrder() {
    const confirmed = window.confirm(
      `PERMANENTLY DELETE ORDER?\n\nCustomer: ${order?.customer.name}\nArtwork: ${order?.artwork.type}\n\nThis will permanently delete the order, customer details and associated audit logs. The tracking code will stop working.\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      });

      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete this order.");
      }

      window.location.href = "/admin/orders";
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete this order."
      );
      setDeleting(false);
    }
  }

  const completedProduction = stages.filter(
    (stage) =>
      stage.category === "production" && stage.status === "completed"
  ).length;

  const totalProduction = stages.filter(
    (stage) => stage.category === "production"
  ).length;

  const progress = totalProduction
    ? Math.round((completedProduction / totalProduction) * 100)
    : 0;

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#e8dfd3] bg-white p-12 text-center text-sm text-[#77716a]">
        <Loader2 className="mx-auto mb-3 animate-spin" size={24} />
        Loading order details...
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error}
        <button
          onClick={loadOrder}
          className="mt-4 block font-semibold underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!order) return null;

  const categories = [
    { key: "order", title: "Order registration" },
    { key: "payment", title: "Payment milestones" },
    { key: "production", title: "Artwork production" },
    { key: "delivery", title: "Delivery milestones" },
  ];

  return (
    <div className="space-y-6">
      {/* Order information */}
      <section className="rounded-2xl border border-[#e8dfd3] bg-white p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="rounded-full bg-[#f3eee6] px-3 py-1 text-xs font-semibold capitalize text-[#80613a]">
              {order.orderStatus}
            </span>

            <h2 className="mt-4 text-2xl font-semibold text-[#292622]">
              {order.customer.name}
            </h2>

            <p className="mt-1 text-sm text-[#77716a]">
              {order.customer.phone}
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-sm text-[#98713d] hover:underline"
          >
            <ArrowLeft size={15} />
            Back to orders
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-5 border-t border-[#eee8df] pt-6 sm:grid-cols-3">
          <Info label="Artwork" value={order.artwork.type} />
          <Info label="Size" value={order.artwork.size} />
          <Info
            label="Framing"
            value={
              order.artwork.framing === "framed" ? "Framed" : "Frameless"
            }
          />
          <Info label="Order date" value={date(order.createdAt)} />
          <Info label="Total price" value={money(order.payment.total)} />
          <Info label="Advance paid" value={money(order.payment.advancePaid)} />
          <Info label="Balance" value={money(order.payment.balance)} />
          <Info
            label="Estimated delivery"
            value={date(order.delivery.estimatedDate)}
          />
        </div>

        {order.artwork.description && (
          <div className="mt-6 border-t border-[#eee8df] pt-5">
            <p className="text-xs text-[#999187]">Artwork requirements</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#51483d]">
              {order.artwork.description}
            </p>
          </div>
        )}
      </section>

      {/* Tracking code management */}
      <section className="rounded-2xl border border-[#e8dfd3] bg-white p-5 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3eee6] text-[#98713d]">
            <KeyRound size={19} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b18a52]">
              Customer tracking
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[#292622]">
              Tracking ID
            </h2>
          </div>
        </div>

        {trackingLoading ? (
          <div className="mt-6 flex items-center gap-2 text-sm text-[#77716a]">
            <Loader2 size={18} className="animate-spin" />
            Retrieving tracking code...
          </div>
        ) : trackingNeedsSetup ? (
          <div className="mt-6 rounded-xl border border-[#e8dfd3] bg-[#fcfaf7] p-4 sm:p-5">
            <p className="text-sm font-semibold text-[#403a33]">
              Existing order — tracking code setup required
            </p>

            <p className="mt-2 text-sm leading-6 text-[#77716a]">
              Enter the original tracking code that was generated when this
              order was created. The system will verify it against the stored
              hash before securely saving it. The code cannot be recovered from
              the hash alone.
            </p>

            <input
              type="text"
              value={trackingCodeInput}
              onChange={(event) => setTrackingCodeInput(event.target.value)}
              placeholder="Enter original tracking code"
              autoComplete="off"
              className="mt-4 w-full rounded-lg border border-[#e8dfd3] bg-white px-4 py-3 text-sm uppercase outline-none focus:border-[#b18a52]"
            />

            <button
              onClick={saveExistingTrackingCode}
              disabled={trackingSaving || !trackingCodeInput.trim()}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#292622] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#443a30] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {trackingSaving ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Verifying code...
                </>
              ) : (
                <>
                  <Check size={17} />
                  Verify and Save Tracking Code
                </>
              )}
            </button>
          </div>
        ) : trackingCode ? (
          <div className="mt-6 rounded-xl border border-[#e8dfd3] bg-[#fcfaf7] p-4 sm:p-5">
            <p className="text-xs text-[#999187]">
              Customer's tracking code
            </p>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <p className="min-w-0 flex-1 break-all font-mono text-lg font-semibold tracking-wider text-[#292622]">
                {trackingCode}
              </p>

              <button
                onClick={copyTrackingCode}
                disabled={copying}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#292622] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#443a30] disabled:opacity-60"
              >
                {copying ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Copy size={16} />
                )}
                Copy Tracking ID
              </button>
            </div>

            <p className="mt-3 text-xs leading-5 text-[#8b8175]">
              Copy this code and manually share it with the customer through
              WhatsApp.
            </p>
          </div>
        ) : (
          <div className="mt-5">
            <p className="text-sm text-[#77716a]">
              Tracking code is currently unavailable.
            </p>
            <button
              onClick={loadTrackingCode}
              className="mt-2 text-sm font-semibold text-[#98713d] hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {trackingError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {trackingError}
          </div>
        )}

        {trackingMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            <Check size={17} />
            {trackingMessage}
          </div>
        )}
      </section>

      {/* Production overview */}
      <section className="rounded-2xl border border-[#e8dfd3] bg-white p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b18a52]">
              Production overview
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[#292622]">
              Artwork progress
            </h2>
          </div>

          <span className="text-3xl font-semibold text-[#98713d]">
            {progress}%
          </span>
        </div>

        <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-[#eee8df]">
          <div
            className="h-full rounded-full bg-[#b18a52] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-3 text-xs text-[#8b8175]">
          {completedProduction} of {totalProduction} artwork production stages
          completed.
        </p>
      </section>

      {/* Stage control */}
      <section className="rounded-2xl border border-[#e8dfd3] bg-white p-5 sm:p-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b18a52]">
            Stage control
          </p>

          <h2 className="mt-2 text-xl font-semibold text-[#292622]">
            Manage all 13 order stages
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#77716a]">
            Select the current status of each milestone. Only one stage can be
            marked In Progress at a time.
          </p>
        </div>

        <div className="mt-7 space-y-8">
          {categories.map((category) => {
            const categoryStages = stages.filter(
              (stage) => stage.category === category.key
            );

            return (
              <div key={category.key}>
                <h3 className="mb-4 border-b border-[#eee8df] pb-3 text-sm font-semibold text-[#51483d]">
                  {category.title}
                </h3>

                <div className="space-y-4">
                  {categoryStages.map((stage, index) => (
                    <div
                      key={stage.key}
                      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            stage.status === "completed"
                              ? "bg-[#98713d] text-white"
                              : stage.status === "in_progress"
                                ? "bg-[#f5eddf] text-[#98713d]"
                                : "bg-[#f2f0ed] text-[#999187]"
                          }`}
                        >
                          {stage.status === "completed" ? (
                            <CheckCircle2 size={17} />
                          ) : stage.status === "in_progress" ? (
                            <Clock3 size={17} />
                          ) : (
                            <span className="text-xs font-semibold">
                              {index + 1}
                            </span>
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-medium text-[#403a33]">
                            {stage.label}
                          </p>

                          <p className="mt-1 text-xs capitalize text-[#999187]">
                            {stage.status.replace("_", " ")}
                          </p>
                        </div>
                      </div>

                      <select
                        value={stage.status}
                        onChange={(event) =>
                          changeStage(
                            stage.key,
                            event.target.value as StageStatus
                          )
                        }
                        className="w-full rounded-lg border border-[#e8dfd3] bg-[#fcfaf7] px-3 py-2.5 text-sm outline-none focus:border-[#b18a52] sm:w-44"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            <Check size={17} />
            {message}
          </div>
        )}

        <div className="mt-7 border-t border-[#eee8df] pt-6">
          <button
            onClick={saveStages}
            disabled={saving || deleting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#292622] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#443a30] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {saving ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Saving changes...
              </>
            ) : (
              <>
                <Save size={17} />
                Save Production Updates
              </>
            )}
          </button>
        </div>
      </section>

      {/* Permanent deletion */}
      <section className="rounded-2xl border border-red-200 bg-white p-5 sm:p-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">
            Danger zone
          </p>

          <h2 className="mt-2 text-xl font-semibold text-[#292622]">
            Permanently delete this order
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#77716a]">
            This permanently removes the order and its embedded customer
            information from the database. Associated audit logs will also be
            deleted where cleanup succeeds. The customer's tracking code will
            no longer work. This action cannot be undone.
          </p>
        </div>

        <button
          onClick={deleteOrder}
          disabled={deleting || saving}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-300 bg-white px-6 py-4 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {deleting ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Deleting order...
            </>
          ) : (
            <>
              <Trash2 size={17} />
              Permanently Delete Order
            </>
          )}
        </button>
      </section>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-[#999187]">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-[#403a33]">
        {value}
      </p>
    </div>
  );
}
