
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, RefreshCw, Loader2, ArrowRight } from "lucide-react";

type Order = {
  _id: string;
  customer?: { name?: string; phone?: string };
  artwork?: { type?: string; size?: string };
  payment?: { total?: number; balance?: number };
  production?: { progressPercent?: number; currentStage?: string };
  orderStatus?: string;
  createdAt?: string;
};

function money(value = 0) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  async function loadOrders() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/orders", {
        cache: "no-store",
      });

      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load orders.");
      }

      setOrders(data.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        order.customer?.name?.toLowerCase().includes(query) ||
        order.customer?.phone?.toLowerCase().includes(query) ||
        order.artwork?.type?.toLowerCase().includes(query) ||
        order._id.toLowerCase().includes(query);

      const matchesFilter =
        filter === "all" || order.orderStatus === filter;

      return matchesSearch && matchesFilter;
    });
  }, [orders, search, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999187]"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search customer, phone, artwork or order ID..."
            className="w-full rounded-xl border border-[#e8dfd3] bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#b18a52]"
          />
        </div>

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="rounded-xl border border-[#e8dfd3] bg-white px-4 py-3 text-sm"
        >
          <option value="all">All orders</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="archived">Archived</option>
        </select>

        <button
          onClick={loadOrders}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e8dfd3] bg-white px-4 py-3 text-sm"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-[#e8dfd3] bg-white p-12 text-center text-sm text-[#77716a]">
          <Loader2 className="mx-auto mb-3 animate-spin" size={24} />
          Loading orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-[#e8dfd3] bg-white p-12 text-center">
          <p className="font-semibold text-[#403a33]">No orders found</p>
          <p className="mt-2 text-sm text-[#77716a]">
            Try changing your search or filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Link
              key={order._id}
              href={`/admin/orders/${order._id}`}
              className="block rounded-2xl border border-[#e8dfd3] bg-white p-5 transition hover:border-[#b18a52] hover:shadow-sm sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="rounded-full bg-[#f3eee6] px-3 py-1 text-xs font-semibold capitalize text-[#80613a]">
                    {order.orderStatus || "active"}
                  </span>
                  <h2 className="mt-3 text-lg font-semibold text-[#292622]">
                    {order.customer?.name || "Unnamed customer"}
                  </h2>
                  <p className="mt-1 text-sm text-[#77716a]">
                    {order.customer?.phone || "No phone number"}
                  </p>
                </div>

                <ArrowRight size={20} className="text-[#98713d]" />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[#eee8df] pt-5 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-[#999187]">Artwork</p>
                  <p className="mt-1 text-sm font-medium text-[#403a33]">
                    {order.artwork?.type || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#999187]">Size</p>
                  <p className="mt-1 text-sm font-medium text-[#403a33]">
                    {order.artwork?.size || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#999187]">Total amount</p>
                  <p className="mt-1 text-sm font-medium text-[#403a33]">
                    {money(order.payment?.total)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#999187]">Artwork progress</p>
                  <p className="mt-1 text-sm font-medium text-[#403a33]">
                    {order.production?.progressPercent ?? 0}%
                  </p>
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#eee8df]">
                <div
                  className="h-full rounded-full bg-[#b18a52]"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, order.production?.progressPercent ?? 0)
                    )}%`,
                  }}
                />
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && (
        <p className="text-xs text-[#999187]">
          Showing {filteredOrders.length} of {orders.length} orders.
        </p>
      )}
    </div>
  );
}
