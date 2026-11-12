
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import OrderDetailsManager from "@/components/admin/OrderDetailsManager";

export const metadata: Metadata = {
  title: "Manage Order | PREM'S Pencil Sketches",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ManageOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAdminSession();

  if (!session) redirect("/admin/login");

  const { id } = await params;

  return (
    <main className="min-h-screen bg-[#f8f5f0] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b border-[#e8dfd3] pb-6">
          <Link href="/admin/dashboard">
            <span className="block text-2xl font-semibold">PREM&apos;S</span>
            <span className="text-[10px] tracking-[0.25em] text-[#8b8175]">
              STUDIO ADMIN
            </span>
          </Link>

          <Link
            href="/admin/orders"
            className="text-sm text-[#98713d] hover:underline"
          >
            ← All orders
          </Link>
        </header>

        <section className="py-9">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b18a52]">
            Order workspace
          </p>
          <h1
            className="mt-2 text-3xl font-semibold text-[#292622]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Manage Artwork
          </h1>
          <p className="mt-2 text-sm text-[#77716a]">
            Update production stages and monitor this customer&apos;s order.
          </p>
        </section>

        <OrderDetailsManager orderId={id} />
      </div>
    </main>
  );
}
