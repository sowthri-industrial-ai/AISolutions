// app/control/layout.tsx
// Control plane shell — placeholder.
// TECH-STACK.md §6 specifies the final shape: TopBar at the top, then a
// three-column grid of Sidebar (180px) · main (1fr) · ObservabilityPanel
// (200px). For the scaffold, render children only so the route tree is
// in place.

export default function ControlPlaneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
