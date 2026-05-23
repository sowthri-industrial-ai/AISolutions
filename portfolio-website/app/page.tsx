// Welcome state for the control plane.
//
// The shell (top bar, sidebar, obs panel) already lives in app/layout.tsx —
// this route just fills the centre column with a hint when no project is
// selected. Deliberately spartan: the sidebar is the entry point, the
// landing surface should not compete with it.

export default function ControlPlaneWelcomePage() {
  return (
    <div className="flex h-full items-center justify-center px-6 text-base text-foreground-muted">
      <span className="select-none">
        <span className="mr-1 text-foreground-subtle">←</span>
        Pick a project from the sidebar.
      </span>
    </div>
  );
}
