
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

type CreatedOrder = {
  trackingCode: string;
  order: {
    id: string;
    customerName: string;
    artworkType: string;
    artworkSize: string;
    totalAmount: number;
    advancePaid: number;
    balance: number;
  };
};

const initialForm = {
  customerName: "",
  customerPhone: "",
  artworkType: "Portrait Sketch",
  artworkSize: "A4",
  framing: "frameless",
  artworkDescription: "",
  totalAmount: "",
  advancePaid: "",
  estimatedDelivery: "",
  internalNotes: "",
};

export default function CreateOrderForm() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<CreatedOrder | null>(null);
  const [copied, setCopied] = useState(false);

  function updateField(
    field: keyof typeof initialForm,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...form,
        totalAmount: Number(form.totalAmount),
        advancePaid: Number(form.advancePaid || 0),
        estimatedDelivery: form.estimatedDelivery
          ? new Date(
              `${form.estimatedDelivery}T12:00:00`
            ).toISOString()
          : null,
      };

      const response = await fetch("/api/admin/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/admin/login";
          return;
        }

        throw new Error(result.error || "Unable to create order.");
      }

      setCreated(result);
      setForm(initialForm);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyTrackingCode() {
    if (!created) return;

    try {
      await navigator.clipboard.writeText(created.trackingCode);
      setCopied(true);
    } catch {
      setError("Unable to copy. Please select the code manually.");
    }
  }

  if (created) {
    return (
      <section className="rounded-2xl border border-[#e9dfd1] bg-white p-6 shadow-sm sm:p-9">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-3xl text-green-700">
            ✓
          </div>

          <h2
            className="mt-5 text-2xl font-semibold text-[#292622]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Order created successfully!
          </h2>

          <p className="mt-2 text-sm text-[#77716a]">
            The order has been saved to your database.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-[#e9dfd1] bg-[#fbf8f3] p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#98713d]">
            Customer tracking code
          </p>

          <p className="mt-3 break-all text-center text-2xl font-bold tracking-wider text-[#292622]">
            {created.trackingCode}
          </p>

          <button
            type="button"
            onClick={copyTrackingCode}
            className="mt-5 w-full rounded-lg bg-[#292622] px-5 py-3 text-sm font-semibold text-white hover:bg-[#443a30]"
          >
            {copied ? "Copied!" : "Copy tracking code"}
          </button>
        </div>

        <div className="mt-6 space-y-3 text-sm text-[#625b52]">
          <p>
            <strong>Customer:</strong> {created.order.customerName}
          </p>
          <p>
            <strong>Artwork:</strong> {created.order.artworkType} (
            {created.order.artworkSize})
          </p>
          <p>
            <strong>Total:</strong> ₹{created.order.totalAmount}
          </p>
          <p>
            <strong>Advance:</strong> ₹{created.order.advancePaid}
          </p>
          <p>
            <strong>Balance:</strong> ₹{created.order.balance}
          </p>
        </div>

        <p className="mt-5 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900">
          Save this tracking code and send it to your customer. You can also
          retrieve it later from the admin production update page.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Link
            href="/admin/dashboard"
            className="rounded-lg border border-[#d9cbbc] px-5 py-3 text-center text-sm font-semibold text-[#55483b] hover:bg-[#faf7f2]"
          >
            Back to dashboard
          </Link>

          <button
            type="button"
            onClick={() => {
              setCreated(null);
              setCopied(false);
              setError("");
            }}
            className="rounded-lg bg-[#292622] px-5 py-3 text-sm font-semibold text-white hover:bg-[#443a30]"
          >
            Create another order
          </button>
        </div>
      </section>
    );
  }

  const inputClass =
    "mt-2 w-full rounded-lg border border-[#e4dbcf] bg-white px-4 py-3 text-sm text-[#292622] outline-none transition focus:border-[#b18a52] focus:ring-2 focus:ring-[#b18a52]/10";

  const labelClass = "text-sm font-medium text-[#4a4239]";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-7 rounded-2xl border border-[#e9dfd1] bg-white p-5 shadow-sm sm:p-8"
    >
      <section>
        <h2 className="text-lg font-semibold text-[#292622]">
          Customer information
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            Customer name *
            <input
              className={inputClass}
              value={form.customerName}
              onChange={(e) => updateField("customerName", e.target.value)}
              placeholder="Enter customer name"
              minLength={2}
              maxLength={100}
              required
            />
          </label>

          <label className={labelClass}>
            WhatsApp / Phone number *
            <input
              className={inputClass}
              type="tel"
              value={form.customerPhone}
              onChange={(e) => updateField("customerPhone", e.target.value)}
              placeholder="+91 9876543210"
              minLength={7}
              maxLength={20}
              required
            />
          </label>
        </div>
      </section>

      <div className="border-t border-[#eee7dd]" />

      <section>
        <h2 className="text-lg font-semibold text-[#292622]">
          Artwork details
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            Artwork type *
            <select
              className={inputClass}
              value={form.artworkType}
              onChange={(e) => updateField("artworkType", e.target.value)}
            >
              <option>Portrait Sketch</option>
              <option>Couple Sketch</option>
              <option>Family Sketch</option>
              <option>Pet Sketch</option>
              <option>Charcoal Sketch</option>
              <option>Custom Artwork</option>
              <option>Other</option>
            </select>
          </label>

          <label className={labelClass}>
            Artwork size *
            <select
              className={inputClass}
              value={form.artworkSize}
              onChange={(e) => updateField("artworkSize", e.target.value)}
            >
              <option value="A5">A5</option>
              <option value="A4">A4</option>
              <option value="A3">A3</option>
              <option value="Custom">Custom size</option>
            </select>
          </label>
        </div>

        <div className="mt-6">
          <p className={labelClass}>Framing option *</p>

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                form.framing === "framed"
                  ? "border-[#b18a52] bg-[#fbf8f3]"
                  : "border-[#e4dbcf] bg-white hover:border-[#c9b99f]"
              }`}
            >
              <input
                type="radio"
                name="framing"
                value="framed"
                checked={form.framing === "framed"}
                onChange={(e) => updateField("framing", e.target.value)}
                className="h-4 w-4 accent-[#98713d]"
              />

              <span>
                <span className="block text-sm font-semibold text-[#403a33]">
                  Framed
                </span>
                <span className="mt-1 block text-xs text-[#8b8175]">
                  Artwork supplied with a frame
                </span>
              </span>
            </label>

            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                form.framing === "frameless"
                  ? "border-[#b18a52] bg-[#fbf8f3]"
                  : "border-[#e4dbcf] bg-white hover:border-[#c9b99f]"
              }`}
            >
              <input
                type="radio"
                name="framing"
                value="frameless"
                checked={form.framing === "frameless"}
                onChange={(e) => updateField("framing", e.target.value)}
                className="h-4 w-4 accent-[#98713d]"
              />

              <span>
                <span className="block text-sm font-semibold text-[#403a33]">
                  Frameless
                </span>
                <span className="mt-1 block text-xs text-[#8b8175]">
                  Artwork supplied without a frame
                </span>
              </span>
            </label>
          </div>
        </div>

        <label className={`${labelClass} mt-5 block`}>
          Artwork instructions / description
          <textarea
            className={inputClass}
            rows={4}
            maxLength={1000}
            value={form.artworkDescription}
            onChange={(e) => updateField("artworkDescription", e.target.value)}
            placeholder="Describe the customer's requirements..."
          />
        </label>
      </section>

      <div className="border-t border-[#eee7dd]" />

      <section>
        <h2 className="text-lg font-semibold text-[#292622]">
          Payment and delivery
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            Total artwork price (₹) *
            <input
              className={inputClass}
              type="number"
              min="1"
              max="10000000"
              step="0.01"
              value={form.totalAmount}
              onChange={(e) => updateField("totalAmount", e.target.value)}
              placeholder="1500"
              required
            />
          </label>

          <label className={labelClass}>
            Advance payment received (₹)
            <input
              className={inputClass}
              type="number"
              min="0"
              max="10000000"
              step="0.01"
              value={form.advancePaid}
              onChange={(e) => updateField("advancePaid", e.target.value)}
              placeholder="500"
            />
          </label>

          <label className={labelClass}>
            Estimated delivery date
            <input
              className={inputClass}
              type="date"
              value={form.estimatedDelivery}
              onChange={(e) => updateField("estimatedDelivery", e.target.value)}
            />
          </label>
        </div>

        <p className="mt-3 text-xs text-[#8b8175]">
          Balance payment is calculated automatically.
        </p>
      </section>

      <div className="border-t border-[#eee7dd]" />

      <section>
        <h2 className="text-lg font-semibold text-[#292622]">
          Private admin notes
        </h2>

        <textarea
          className={inputClass}
          rows={3}
          maxLength={3000}
          value={form.internalNotes}
          onChange={(e) => updateField("internalNotes", e.target.value)}
          placeholder="Notes visible only to you..."
        />

        <p className="mt-2 text-xs text-[#8b8175]">
          These notes will not be shown to customers.
        </p>
      </section>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#292622] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#443a30] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Creating order..." : "Create order"}
      </button>

      <p className="text-center text-xs text-[#8b8175]">
        A unique tracking code will be generated automatically.
      </p>
    </form>
  );
}
