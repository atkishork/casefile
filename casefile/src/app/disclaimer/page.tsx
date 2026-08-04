import type { Metadata } from "next";
import { site } from "@/lib/config";

export const metadata: Metadata = {
  title: `Disclaimer — ${site.brand}`,
  description: "Educational-use disclaimer for CTF writeups on this site.",
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="font-display text-xs uppercase tracking-[0.2em] text-stamp">
        Legal
      </p>
      <h1 className="mt-3 font-display text-2xl font-bold text-paper sm:text-4xl">
        Disclaimer
      </h1>

      <div className="prose-case mt-10 max-w-none">
        <h2>Educational purpose only</h2>
        <p>
          Everything published here — writeups, payloads, exploitation
          techniques — documents work done against deliberately vulnerable
          CTF challenges, in environments built for that purpose. It&apos;s
          shared for learning: to help others understand how a
          vulnerability class works and how to find it.
        </p>

        <h2>Get authorization first</h2>
        <p>
          Do not run these techniques against any system you don&apos;t own
          or don&apos;t have explicit, written permission to test.
          Unauthorized access to computer systems is illegal in most
          jurisdictions, regardless of intent. If in doubt, don&apos;t.
        </p>

        <h2>No warranty</h2>
        <p>
          Content here is provided as-is, without warranty of any kind. It
          may be incomplete, outdated, or specific to a challenge that no
          longer exists in the state described. Nothing here is a
          guarantee that a technique will work elsewhere.
        </p>

        <h2>Not liable for misuse</h2>
        <p>
          {site.name} is not responsible for how anyone else chooses to use
          the information on this site. Responsibility for lawful,
          authorized use rests entirely with the reader.
        </p>

        <h2>Personal opinions</h2>
        <p>
          Views expressed here are personal and don&apos;t represent the
          position of any current or former employer, including TCS.
        </p>

        <h2>External links</h2>
        <p>
          Links to external tools, platforms, or documentation are provided
          for convenience. Their content and availability aren&apos;t
          controlled by this site.
        </p>
      </div>
    </div>
  );
}
