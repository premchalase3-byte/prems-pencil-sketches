
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import {
  ArrowLeft,
  ClipboardList,
  Database,
  PencilRuler,
  Plus,
  ArrowRight,
  Package,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard | PREM'S Pencil Sketches",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  if (!session) redirect("/admin/login");

  return (
    <main className="min-h-screen bg-[#f8f5f0] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e8dfd3] pb-6">
          <Link href="/" className="group">
            <span
              className="block text-2xl font-semibold"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              PREM&apos;S
            </span>

            <span className="text-[10px] tracking-[0.25em] text-[#8b8175]">
              STUDIO ADMIN
            </span>
          </Link>

          <AdminLogoutButton />
        </header>

        {/* Welcome Section */}
        <section className="flex flex-col gap-6 py-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b18a52]">
              Private workspace
            </p>

            <h1
              className="mt-2 text-3xl font-semibold text-[#222]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Welcome to your studio, Prem.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#77716a]">
              Manage customer orders, track artwork production, monitor
              payments and keep your sketching business organized
              from one place.
            </p>
          </div>

          <Link
            href="/admin/orders/new"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#292622] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#443a30]"
          >
            <Plus className="h-5 w-5" />
            Create New Order
          </Link>
        </section>

        {/* Main Feature Cards */}
        <div className="grid gap-4 md:grid-cols-3">

          {/* Order Management */}
          <article className="rounded-2xl border border-[#e9e1d6] bg-white p-6 transition hover:shadow-md">
            <ClipboardList className="h-6 w-6 text-[#b18a52]" />

            <h2 className="mt-4 text-base font-semibold text-[#292622]">
              Order Management
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#77716a]">
              View all customer orders, manage artwork details, search
              customers and access individual order workspaces.
            </p>

            <div className="mt-5 flex flex-wrap gap-4">
              <Link
                href="/admin/orders"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#98713d] hover:underline"
              >
                Manage all orders
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/admin/orders/new"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#98713d] hover:underline"
              >
                Create order
                <Plus className="h-4 w-4" />
              </Link>
            </div>
          </article>

          {/* Artwork Progress */}
          <article className="rounded-2xl border border-[#e9e1d6] bg-white p-6 transition hover:shadow-md">
            <PencilRuler className="h-6 w-6 text-[#b18a52]" />

            <h2 className="mt-4 text-base font-semibold text-[#292622]">
              Artwork Progress
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#77716a]">
              Update all 13 order milestones, monitor production progress
              and keep customers informed through tracking.
            </p>

            <Link
              href="/admin/orders"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#98713d] hover:underline"
            >
              Update production stages
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>

          {/* Database */}
          <article className="rounded-2xl border border-[#e9e1d6] bg-white p-6 transition hover:shadow-md">
            <Database className="h-6 w-6 text-[#b18a52]" />

            <h2 className="mt-4 text-base font-semibold text-[#292622]">
              MongoDB Storage
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#77716a]">
              Store customer information, payment records, artwork
              progress and order history securely.
            </p>

            <span className="mt-5 inline-flex items-center gap-2 text-xs text-green-700">
              <span className="h-2 w-2 rounded-full bg-green-600" />
              Database connected
            </span>
          </article>
        </div>

        {/* Quick Action Section */}
        <section className="mt-8 rounded-2xl border border-[#e9d9bd] bg-[#fbf6ed] p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b18a52]">
                Studio operations
              </p>

              <h2
                className="mt-2 text-xl font-semibold text-[#332c23]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Ready to register a new artwork?
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#746858]">
                Enter your customer&apos;s details, artwork requirements,
                pricing and advance payment. A unique tracking code
                will be generated automatically.
              </p>
            </div>

            <Link
              href="/admin/orders/new"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#c8a875] bg-white px-5 py-3 text-sm font-semibold text-[#76572e] transition hover:bg-[#f5ead8]"
            >
              <Plus className="h-4 w-4" />
              Register Order
            </Link>
          </div>
        </section>

        {/* Customer Tracking Shortcut */}
        <section className="mt-8 rounded-2xl border border-[#e9e1d6] bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-[#f3eee6] p-3">
                <Package className="h-6 w-6 text-[#98713d]" />
              </div>

              <div>
                <h2 className="font-semibold text-[#332c23]">
                  Customer Order Tracking
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[#77716a]">
                  Preview the public tracking experience customers use
                  to check their artwork production and order status.
                </p>
              </div>
            </div>

            <Link
              href="/track"
              target="_blank"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#e8dfd3] px-5 py-3 text-sm font-semibold text-[#76572e] transition hover:bg-[#f8f5f0]"
            >
              Open tracking page
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Development Progress */}
        <section className="mt-8 rounded-2xl border border-[#e9e1d6] bg-white p-6">
          <h2 className="font-semibold text-[#332c23]">
            Development progress
          </h2>

          <div className="mt-5 space-y-4">

            {[
              "Admin authentication",
              "MongoDB Atlas connection",
              "Order creation interface",
              "Customer tracking page",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="text-[#625b52]">{item}</span>
                <span className="font-medium text-green-700">
                  Completed
                </span>
              </div>
            ))}

            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-[#625b52]">
                Admin order management and stage updates
              </span>
              <span className="font-medium text-[#b18a52]">
                Implementation
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-[#625b52]">
                Payment and delivery management
              </span>
              <span className="font-medium text-[#8b8175]">
                Upcoming
              </span>
            </div>
          </div>

          <div className="mt-6 border-t border-[#eee7dd] pt-5">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#98713d] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              View public website
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
