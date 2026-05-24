// Home → /control. For slice 3 the portfolio surfaces only the control
// plane; the marketing-style home page (hero + featured projects, both
// surfaces side-by-side) lands in a later slice.

import { redirect } from "next/navigation";

export default function HomePage(): never {
  redirect("/control");
}
