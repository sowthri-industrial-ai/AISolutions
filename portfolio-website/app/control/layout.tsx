// /control/* layout — mounts the persistent 3-column shell once and
// streams the per-route page into the workspace slot. The shell itself
// is a client component (ControlPlaneShell) so it can read URL segments
// to derive the active project for the breadcrumb + sidebar highlight.

import { ControlPlaneShell } from "@/components/control-plane/shell";

export default function ControlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ControlPlaneShell>{children}</ControlPlaneShell>;
}
