import type { Metadata } from "next";
import { site } from "@/lib/config";

export const metadata: Metadata = {
  title: `Privacy Policy — ${site.brand}`,
  description: "What this site does and doesn't collect.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="font-display text-xs uppercase tracking-[0.2em] text-stamp">
        Legal
      </p>
      <h1 className="mt-3 font-display text-2xl font-bold text-paper sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted-2">
        Last updated: July 2026 — update this date whenever you materially change what the site collects.
      </p>

      <div className="prose-case mt-10 max-w-none">
        <p>
          This is a personal portfolio and CTF writeup blog, not a
          commercial service. It doesn&apos;t ask you to create an account,
          and it doesn&apos;t sell or share data with anyone, because it
          doesn&apos;t collect meaningful data about visitors in the first
          place.
        </p>

        <h2>What this site stores</h2>
        <ul>
          <li>
            <strong>Theme preference.</strong> If you use the dark/light
            toggle, your choice is saved in your browser&apos;s
            <code>localStorage</code>. It never leaves your device and
            isn&apos;t sent to any server.
          </li>
          <li>
            <strong>No visitor cookies.</strong> Public pages don&apos;t set
            cookies. A session cookie exists only for the site owner&apos;s
            private admin login (<code>/admin</code>) — it&apos;s not set
            for ordinary visitors and isn&apos;t used to track anyone.
          </li>
          <li>
            <strong>No analytics or trackers, by default.</strong> This
            template doesn&apos;t ship with Google Analytics, Vercel
            Analytics, ad pixels, or similar. If the owner adds one later,
            this page should be updated to say so.
          </li>
        </ul>

        <h2>Hosting</h2>
        <p>
          Like any web host, whatever platform this site is deployed on
          (e.g. Vercel) may log standard server request data (IP address,
          user agent, timestamp) for operational and security purposes.
          That&apos;s outside this site&apos;s own code — check your
          host&apos;s privacy policy for specifics.
        </p>

        <h2>External links</h2>
        <p>
          Writeups often link out to tools, CTF platforms, or reference
          material. Those sites have their own privacy practices, which
          this policy doesn&apos;t cover.
        </p>

        <h2>Changes</h2>
        <p>
          If what this site collects ever changes, this page will be
          updated to reflect that.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy can go to{" "}
          {site.email ? (
            <a href={`mailto:${site.email}`}>{site.email}</a>
          ) : (
            "the contact address on the Dossier page"
          )}
          .
        </p>
      </div>
    </div>
  );
}
