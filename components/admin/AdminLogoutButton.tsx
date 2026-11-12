"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, LoaderCircle } from "lucide-react";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full border border-[#e7dfd4] px-4 py-2 text-sm text-[#514a42] transition hover:border-[#C8A165] hover:text-[#9b743f] disabled:opacity-60"
    >
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      Sign out
    </button>
  );
}
