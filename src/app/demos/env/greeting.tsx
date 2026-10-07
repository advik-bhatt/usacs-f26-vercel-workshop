"use client";

// Client Components can ONLY see env vars prefixed with NEXT_PUBLIC_.
// Their values are inlined into the JS bundle at build time — never put
// secrets in a NEXT_PUBLIC_ variable.
export function Greeting() {
  const greeting = process.env.NEXT_PUBLIC_WORKSHOP_GREETING;
  return (
    <p className="font-mono text-lg">
      {greeting ?? <span className="text-muted">(NEXT_PUBLIC_WORKSHOP_GREETING is not set)</span>}
    </p>
  );
}
