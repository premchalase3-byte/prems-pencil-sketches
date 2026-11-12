import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Login | PREM'S Pencil Sketches",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f5f0] px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 block text-center">
          <span className="block text-3xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>
            PREM&apos;S
          </span>
          <span className="mt-1 block text-[10px] tracking-[0.28em] text-[#8b8175]">
            PENCIL SKETCHES
          </span>
        </Link>

        <section className="rounded-3xl border border-[#e9e1d6] bg-white p-7 shadow-[0_18px_60px_rgba(50,40,25,0.07)] sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b18a52]">
            Private workspace
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-[#222]" style={{ fontFamily: "var(--font-playfair)" }}>
            Studio admin
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#77716a]">
            Sign in to create orders and manage artwork progress.
          </p>
          <AdminLoginForm />
        </section>

        <p className="mt-6 text-center text-xs text-[#928a80]">
          <Link href="/" className="transition hover:text-[#a17b45]">
            Return to the public website
          </Link>
        </p>
      </div>
    </main>
  );
}
