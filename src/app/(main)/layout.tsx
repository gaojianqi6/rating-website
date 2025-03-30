// app/(main)/layout.tsx
import type { ReactNode } from "react";
import LayoutClient from "@/components/LayoutClient";

export default function MainLayout({ children }: { children: ReactNode }) {
  return <LayoutClient>{children}</LayoutClient>;
}