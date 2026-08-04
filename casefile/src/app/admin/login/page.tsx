import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-5 sm:px-8">
      <p className="font-display text-xs uppercase tracking-[0.2em] text-stamp">
        Restricted access
      </p>
      <h1 className="mt-3 font-display text-2xl font-bold text-paper">Admin login</h1>
      <p className="mt-2 text-sm text-muted">
        This area isn&apos;t linked anywhere on the site.
      </p>
      <LoginForm />
    </div>
  );
}
