
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import OrdersList from "@/components/admin/OrdersList";

export const metadata: Metadata = {
  title: "Order Management | PREM'S Pencil Sketches",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await getAdminSession();

  if (!session) redirect("/admin/login");

  return (
    <main className="min-h-screen bg-[#f8f5f0] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e8dfd3] pb-6">
          <Link href="/admin/dashboard">
            <span className="block text-2xl font-semibold">PREM&apos;S</span>
            <span className="text-[10px] tracking-[0.25em] text-[#8b8175]">
              STUDIO ADMIN
            </span>
          </Link>

          <Link
            href="/admin/orders/new"
            className="rounded-xl bg-[#292622] px-5 py-3 text-sm font-semibold text-white hover:bg-[#443a30]"
          >
            + Create New Order
          </Link>
        </header>

        <div className="py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b18a52]">
            Studio workspace
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[#292622]">
            Order Management
          </h1>
          <p className="mt-2 text-sm text-[#77716a]">
            View customer orders and manage artwork production progress.
          </p>
        </div>

        <OrdersList />
      </div>
    </main>
  );
}
