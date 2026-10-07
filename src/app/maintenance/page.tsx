export const metadata = { title: "Maintenance" };

// Shown by proxy.ts when the Global Config item `maintenance` is true (slide 26).
export default function MaintenancePage() {
  return (
    <div className="space-y-3 py-20 text-center">
      <p className="text-5xl">🚧</p>
      <h1 className="text-3xl font-semibold">Back soon</h1>
      <p className="text-muted">
        Flip <code className="code">maintenance</code> back to{" "}
        <code className="code">false</code> in Global Config. No redeploy needed.
      </p>
    </div>
  );
}
