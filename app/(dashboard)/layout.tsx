import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next Pizza | Главная",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="min-h-screen">{children}</main>;
}
